import pathlib
import posixpath
from contextlib import asynccontextmanager
from typing import Any, AsyncIterator

import aiofiles
import fsspec
from fsspec.implementations.asyn_wrapper import AsyncFileSystemWrapper
from aiofiles.threadpool.binary import AsyncBufferedReader


class Storage:

    def __init__(self, filesystem: str, root: str, options: dict[str, Any] = {}):
        _fs = fsspec.filesystem(filesystem, asynchronous=True, **options)
        self.fs = _fs if _fs.async_impl else AsyncFileSystemWrapper(_fs, asynchronous=True)
        self.root = root.strip("/")


    def path(self, *parts: str) -> str: return posixpath.join(*parts)
    async def exists(self, path: str) -> bool: return await self.fs._exists(self.path(self.root, path))
    async def size(self, path: str) -> int: return int((await self.fs._info(self.path(self.root, path)))["size"])
    async def read_bytes(self, path: str) -> bytes: return await self.fs._cat_file(self.path(self.root, path))
    async def read_text(self, path: str) -> str: return (await self.read_bytes(path)).decode()
    async def write_text(self, path: str, data: str): await self.write_bytes(path, data.encode())

    async def read_stream(self, path: str, chunk_size: int = 1024 * 1024, size: int | None = None) -> AsyncIterator[bytes]:
        size = size or await self.size(path)
        full = self.path(self.root, path)
        for start in range(0, size, chunk_size):
            yield await self.fs._cat_file(full, start=start, end=start + chunk_size)

    async def write_bytes(self, dst: str, src: bytes | pathlib.Path):
        dst = posixpath.join(self.root, dst)
        parent = posixpath.dirname(dst)
        if parent:
            await self.fs._makedirs(parent, exist_ok=True)
        if isinstance(src, bytes):
            await self.fs._pipe_file(dst, src)
        else:
            await self.fs._put_file(src, dst)


    @asynccontextmanager
    async def read(self, path: str) -> AsyncIterator[AsyncBufferedReader]:
        async with aiofiles.tempfile.NamedTemporaryFile(suffix=pathlib.Path(path).suffix) as f:
            await self.fs._get_file(posixpath.join(self.root, path), f.name)
            await f.seek(0)
            yield f
