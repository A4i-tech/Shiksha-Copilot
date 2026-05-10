import posixpath
import tempfile
from contextlib import asynccontextmanager
from typing import IO, Any, AsyncIterator

import fsspec
from fsspec.implementations.asyn_wrapper import AsyncFileSystemWrapper


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


    async def write_bytes(self, path: str, data: bytes):
        path = posixpath.join(self.root, path)
        parent = posixpath.dirname(path)
        if parent:
            await self.fs._makedirs(parent, exist_ok=True)
        await self.fs._pipe_file(path, data)


    @asynccontextmanager
    async def read(self, path: str) -> AsyncIterator[IO[bytes]]:
        with tempfile.NamedTemporaryFile() as f:
            await self.fs._get_file(posixpath.join(self.root, path), f.name)
            f.seek(0)
            yield f.file
