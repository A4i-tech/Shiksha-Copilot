import asyncio
import hashlib
from io import BytesIO
import os
import shutil
import tempfile
from typing import IO, Literal
import aiofiles
import aiohttp
import pathlib
from app.config import settings
from app.models.presentation import ImageSearchResult, ImageSearchResults, YouTubeVideoResult
from app.utils.storage import Storage
from app.utils.utils import local_unique_id
from fastapi import UploadFile
import magic
from pydantic import HttpUrl, validate_call
import logging
from html.parser import HTMLParser
from urllib.parse import urlparse

from tenacity import retry, retry_if_exception_type, stop_after_attempt, wait_exponential


class TextInHTMLParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.text_content = []

    def handle_data(self, data): self.text_content.append(data)
    def get_text(self): return "".join(self.text_content)


def _client() -> aiohttp.ClientSession:
    return aiohttp.ClientSession(
        headers={"User-Agent": "Shiksha-Copilot/1.0 (https://github.com/A4i-tech/Shiksha-Copilot; dev.a4i@iiitb.ac.in) Python/aiohttp"},
        raise_for_status=True,
        timeout=aiohttp.ClientTimeout(total=30)
    )


def _youtube_process_response(data: dict) -> list[YouTubeVideoResult]:
    out = []
    for item in data["items"]:
        video_id = item["id"]["videoId"]
        thumbnails = item["snippet"]["thumbnails"]

        # Get highest quality thumbnail available
        if "maxresdefault" in thumbnails:
            thumbnail_url = f"https://i.ytimg.com/vi/{video_id}/maxresdefault.jpg"
        elif "high" in thumbnails:
            thumbnail_url = thumbnails["high"]["url"]
        elif "medium" in thumbnails:
            thumbnail_url = thumbnails["medium"]["url"]
        else:
            thumbnail_url = thumbnails["default"]["url"]

        out.append(YouTubeVideoResult(
            title=item["snippet"]["title"],
            description=item["snippet"]["description"],
            channel=item["snippet"]["channelTitle"],
            published_at=item["snippet"]["publishedAt"],
            url=HttpUrl(f"https://www.youtube.com/watch?v={video_id}"),
            thumbnail_url=HttpUrl(thumbnail_url),
        ))
    return out


@validate_call
async def youtube_video_search(query: str, max_results: int) -> list[YouTubeVideoResult]:
    if not settings.youtube_api_key:
        raise ValueError("Cannot browse for videos - no YouTube API key is configured.")

    async with _client() as client:
        response = await client.get("https://www.googleapis.com/youtube/v3/search", params={
            "part": "snippet",
            "q": query,
            "type": "video",
            "maxResults": max_results,
            "safeSearch": "strict",
            "key": settings.youtube_api_key
        })
        data = await response.json()
    return _youtube_process_response(data)


def _wikimedia_process_response(data: dict) -> list[ImageSearchResult]:
    if "query" not in data or "pages" not in data["query"]:
        return []

    results = []
    for page_data in data["query"]["pages"].values():
        if "imageinfo" not in page_data:
            continue

        image_info = page_data["imageinfo"][0]
        extmetadata = image_info.get("extmetadata", {})
        license_info = "Creative Commons / Public Domain"
        attribution = page_data.get("title", "Unknown")

        if "LicenseShortName" in extmetadata:
            license_info = extmetadata["LicenseShortName"].get("value", license_info)
        if "Artist" in extmetadata:
            attribution = extmetadata["Artist"].get("value", attribution)

        free_licenses = ["cc", "public domain", "pd", "gfdl"]
        if not any(lic in license_info.lower() for lic in free_licenses):
            continue

        image_url = image_info.get("url", "")
        image_ext = pathlib.Path(urlparse(image_url).path).suffix
        if not any(image_ext.lower() == ext for ext in ['.jpg', '.jpeg', '.png', '.gif', '.webp']):
            continue

        attr_parser = TextInHTMLParser()
        attr_parser.feed(attribution)
        results.append(ImageSearchResult(
            url=image_url,
            description=
                extmetadata.get("ImageDescription", {}).get("value", None) or
                extmetadata.get("ObjectName", {}).get("value", None) or
                os.path.splitext(page_data.get("title", "").replace("File:", ""))[0],
            source="Wikimedia Commons",
            license=license_info,
            attribution=attr_parser.get_text(),
        ))

    return results


async def _wikimedia_image_search(session: aiohttp.ClientSession, query: str, max_results_per_query: int, mime: str | None) -> list[ImageSearchResult]:
    async with session.get("https://commons.wikimedia.org/w/api.php", params={
        "action": "query",
        "format": "json",
        "generator": "search",
        "gsrsearch": "%s%s" % (query, " filemime:%s" % mime if mime else ""),
        "gsrnamespace": 6,  # File namespace
        "gsrlimit": max_results_per_query,
        "prop": "imageinfo",
        "iiprop": "url|extmetadata",
        "iiurlwidth": 800,
    }) as response:
        return _wikimedia_process_response(await response.json())


MSG_NO_RESULTS_FOUND = "No results found."
async def wikimedia_image_search(queries: list[str], max_results_per_query: int, mime: str | None) -> ImageSearchResults:
    if not queries:
        return ImageSearchResults(results=[], message="No queries provided")

    async with _client() as session:
        tasks = [_wikimedia_image_search(session, query, max_results_per_query, mime) for query in queries]
        all_results = await asyncio.gather(*tasks, return_exceptions=True)
        combined_results = {}
        for i, result in enumerate(all_results):
            if isinstance(result, BaseException):
                logging.error(f"Query '{queries[i]}' failed: {str(result)}")
                logging.exception(result)
            else:
                combined_results.update({r.url: r for r in result})
        return ImageSearchResults(results=list(combined_results.values()), message=MSG_NO_RESULTS_FOUND if len(combined_results) == 0 else None)


@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=1, max=5),
    retry=retry_if_exception_type((aiohttp.ClientError, asyncio.TimeoutError)),
    reraise=True,
)
async def resolve_image(image: str, is_url: bool, storage: Storage | None = None, local_dir: str | None = None) -> str | BytesIO:
    if not is_url:
        if not storage or not local_dir:
            raise ValueError("Storage and local directory must be specified to resolve local image (%s)" % image)
        path = storage.path(local_dir, image)
        if not await storage.exists(path):
            raise ValueError(f"Image not found: {image}")
        return BytesIO(await storage.read_bytes(storage.path(local_dir, image)))

    async with _client() as session, session.get(image) as resp:
        return BytesIO(await resp.read())


async def save_file_with_hash(storage: Storage, file: UploadFile, filename: str, allowed_mimes: set[str], chunk_size: int, max_size: int) -> tuple[str, str]:
    suffix = pathlib.Path(filename).suffix.lower()
    sha256 = hashlib.sha256()
    total = 0
    async with aiofiles.tempfile.NamedTemporaryFile(suffix=suffix) as f:
        while buf := await file.read(chunk_size):
            total += len(buf)
            if total > max_size: raise ValueError(f"Bad file size (expected <= {max_size}, got > {total})")

            await f.write(buf)
            sha256.update(buf)

        await f.flush()
        await f.seek(0)
        path = pathlib.Path(str(f.name))
        mime = await asyncio.to_thread(magic.from_file, path, mime=True)
        if mime not in allowed_mimes: raise ValueError("Unexpected mime (%s)" % mime)

        final_name = f"{sha256.hexdigest()}{suffix}"
        await f.seek(0)
        await storage.write_bytes(storage.path("uploads", final_name), path)
    return final_name, mime


# This CNAME is used to form dummy urls from real urls, before sending the url over to agent.
# NOTE that this CDN is never ACTUALLY hit and can have any value. We just do not want to
# confuse the agent so we go with a standard "looks real" value.
_DUMMY_CDN = "cdn.shiksha.local"


def randomize_url(url: str, counter: int) -> str:
    # retain suffix (.jpg, .gif, etc.) - this is necessary for LLMs to reason about image type. for instance, a user
    # may make an explicit requirement to 'include GIFs in presentation' where the suffix would come handy.
    data = urlparse(url)
    return data.scheme + "://" + _DUMMY_CDN + "/" + local_unique_id(counter) + pathlib.Path(data.path).suffix


LibreOfficeOutputFormat = Literal["pdf", "html", "odp", "ppt", "pptx"]
class LibreOffice:

    def __init__(self) -> None:
        self.path: str | None = shutil.which("soffice")

    async def _call(self, *args: str) -> bytes:
        if self.path is None: raise RuntimeError("soffice executable not found in PATH")
        default_args = ["--headless", "--nologo", "--nofirststartwizard", "--nodefault", "--norestore"]
        proc = await asyncio.create_subprocess_exec(self.path, *default_args, *args, stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.PIPE)
        stdout, stderr = await proc.communicate()
        code = proc.returncode or 0
        if code != 0: raise RuntimeError(stderr.decode())
        return stdout

    async def convert(self, data: IO[bytes], output_format: LibreOfficeOutputFormat) -> bytes:
        with tempfile.TemporaryDirectory() as profile, tempfile.TemporaryDirectory() as tmp:
            tmpdir = pathlib.Path(tmp)
            in_path = tmpdir / "input.pptx"
            async with aiofiles.open(in_path, "wb") as f:
                await f.write(data.read())
            await self._call("-env:UserInstallation=file://" + profile, "--convert-to", output_format, "--outdir", str(tmpdir), str(in_path))

            # soffice creates 'input.xyz'
            out_path = tmpdir / ("input.%s" % output_format)
            async with aiofiles.open(out_path, "rb") as f:
                return await f.read()
