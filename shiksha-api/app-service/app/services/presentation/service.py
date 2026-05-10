import traceback
import asyncio
from contextlib import asynccontextmanager
import json
import logging
import pathlib
from datetime import datetime

from pptx import presentation, Presentation

from app.config import settings
from app.services.presentation import agent, docparser, template
from app.services.presentation.job import JobManager, JobDetail
from app.utils.storage import Storage


class PresentationService:

    def __init__(self, storage: Storage, jobs: JobManager):
        self.storage = storage
        self.jobs = jobs
        self.logger = logging.getLogger(__name__)
        self.processing: dict[bytes, asyncio.Task] = {}


    @asynccontextmanager
    async def run(self):
        async with self.jobs:
            t1 = asyncio.create_task(self._run_jobs())
            t2 = asyncio.create_task(self._propagate_jobs())
            try:
                yield
            finally:
                t1.cancel()
                t2.cancel()
                await asyncio.gather(t1, t2, return_exceptions=True)


    async def _run_jobs(self):
        async for job_id in self.jobs.sub():
            if job_id is None:
                break

            job = await self.jobs.get(job_id)
            if job is None:
                if job_id.bytes in self.processing:
                    self.processing[job_id.bytes].cancel()
                    self.logger.info("Terminated job - %s", job_id)
                continue

            if job.id.bytes in self.processing or job.status == "complete":
                continue

            self.logger.info("Processing job %s - %s", job.id, job.status)
            task = asyncio.create_task(self._run_job(job))
            self.processing[job.id.bytes] = task
            task.add_done_callback(lambda t, job=job: asyncio.create_task(self._on_job_complete(job, t)))


    async def _propagate_jobs(self):
        q = asyncio.Queue()
        self.jobs.listeners.add(q)
        try:
            while True:
                id = await q.get()
                if id is None:
                    break
                job = await self.jobs.get(id)
                if job is not None:
                    await self.jobs.log(job.id, "update", json.loads(job.model_dump_json()))
        finally:
            self.jobs.listeners.discard(q)


    async def _process_checkpoint(self, job: JobDetail, event: agent.ShikshaCheckpointEvent, metadata_dir: str, prs: presentation.Presentation | None, out_path: str):
        updates = {}
        if event.metadata is not None:
            updates["metadata." + metadata_dir] = event.metadata
        if event.message is not None:
            updates["message"] = event.message
        await self.jobs.update(job.id, updates)
        if prs:
            await docparser.save_pptx(self.storage, prs, out_path)


    async def _on_job_complete(self, job: JobDetail, task: asyncio.Task):
        del self.processing[job.id.bytes]
        e = task.exception()
        if e:
            self.logger.info("Job raised exception - %s - %s", job.id, str(e))
            traceback.print_exception(e)
            await self.jobs.update(job.id, {
                "status": "error",
                "message": f"Unexpected error: {str(e)}",
                "metadata.error": {
                    "error_type": "unexpected_error",
                    "error_message": str(e),
                    "recovery_attempted": False,
                    "timestamp": datetime.now().isoformat()
                }
            })
        elif task.cancelled():
            self.logger.info("Job cancelled - %s", job.id)
            await self.jobs.update(job.id, {
                "status": "error",
                "message": f"Task was cancelled",
                "metadata.error": {
                    "error_type": "unexpected_error",
                    "error_message": "Task was cancelled",
                    "recovery_attempted": False,
                    "timestamp": datetime.now().isoformat()
                }
            })


    async def _run_job(self, job: JobDetail):
        if job.status == "init":
            await self.jobs.update(job.id, {"status": "extracting_figures", "message": "Extracting figures from textbook"})
        elif job.status == "extracting_figures":
            await self.jobs.update(job.id, {"message": "Reading textbook and extracting figures"})
            async with self.storage.read(self.storage.path("uploads", job.textbook_file)) as f:
                stem = pathlib.Path(job.textbook_file).stem
                figures = await docparser.read_figures(self.storage, f, self.storage.path("out", stem, "figures"))
                await self.jobs.update(job.id, {"metadata.analysis": {
                    "extraction_time": datetime.now().isoformat(),
                    "figures": list(map(lambda x: x.model_dump(), figures)),
                }})
                if "transform_path" not in job.metadata or (job.metadata["transform_path"] is not None and not await self.storage.exists(self.storage.path("out", stem, job.metadata["transform_path"]))):
                    await self.jobs.update(job.id, {"message": "Simplifying document"})
                    # we are deliberately storing transformation in out/stem/stem instead of out/stem/jobid - if we had
                    # computed transformation for this document during another job, we can skip recomputing for this job.
                    transform_path = await docparser.transform(self.storage, job.textbook_file, f, self.storage.path("out", stem, stem))
                    await self.jobs.update(job.id, {"metadata.transform_path": transform_path})
            await self.jobs.update(job.id, {"status": "planning_structure"})
        elif job.status == "planning_structure":
            await self.jobs.update(job.id, {"message": "Creating presentation outline"})
            stem = pathlib.Path(job.textbook_file).stem
            out_path = self.storage.path("out", stem, f"{job.id}.pptx")
            metadata = job.metadata.get("plan", {})
            if not isinstance(metadata, dict):
                metadata = {}
            if job.use_pre_generated_outline and (source_plan := await self.jobs.latest_completed_outline(job.textbook_file)):
                metadata = source_plan
                job.metadata["plan"] = metadata
                await self.jobs.update(job.id, {"metadata.plan": metadata, "message": "Using pre-generated outline from latest completed job"})
            else:
                if transform_path := job.metadata.get("transform_path", None):
                    source_path = self.storage.path("out", stem, transform_path)
                else:
                    source_path = self.storage.path("uploads", job.textbook_file)
                async with self.storage.read(source_path) as f:
                    figures = await docparser.read_figures(self.storage, f, self.storage.path("out", stem, "figures"))
                    async for event in agent.plan(source_path, f, figures, job.slides, metadata, job.instruction):
                        if isinstance(event, agent.ShikshaCheckpointEvent):
                            await self._process_checkpoint(job, event, "plan", None, out_path)
                        else:
                            await self.jobs.log(job.id, "event", json.loads(event.model_dump_json()))
            await self.jobs.update(job.id, {"status": "creating_slides"})
        elif job.status == "creating_slides":
            await self.jobs.update(job.id, {"message": "Executing presentation outline"})
            stem = pathlib.Path(job.textbook_file).stem
            out_path = self.storage.path("out", stem, f"{job.id}.pptx")
            if not await self.storage.exists(out_path):
                prs = template.Templates.new_presentation()
                await docparser.save_pptx(self.storage, prs, out_path)
            else:
                async with self.storage.read(out_path) as f:
                    prs = Presentation(f)

            outline = agent.PresentationOutline.model_validate(job.metadata["plan"]["outline"])
            metadata = job.metadata.get("design", {})
            if not isinstance(metadata, dict):
                metadata = {}

            if transform_path := job.metadata.get("transform_path", None):
                source_path = self.storage.path("out", stem, transform_path)
            else:
                source_path = self.storage.path("uploads", job.textbook_file)

            figures_dir = self.storage.path("out", stem, "figures")
            async with self.storage.read(source_path) as f:
                async for event in agent.design(self.storage, prs, f, figures_dir, outline, metadata, job.instruction):
                    if isinstance(event, agent.ShikshaCheckpointEvent):
                        await self._process_checkpoint(job, event, "design", prs, out_path)
                    else:
                        await self.jobs.log(job.id, "event", json.loads(event.model_dump_json()))

            await docparser.save_pptx(self.storage, prs, out_path)
            failed_slides = metadata.get("failed_slides", [])
            slides_created = metadata.get("slides_created", 0)
            if len(failed_slides) > 0:
                await self.jobs.update(job.id, {"status": "adding_media", "message": f"Slides created ({slides_created} total, {len(failed_slides)} with warnings). Enriching content"})
            else:
                await self.jobs.update(job.id, {"status": "adding_media", "message": f"All {slides_created} slides created successfully. Enriching content"})
        elif job.status == "adding_media":
            await self.jobs.update(job.id, {"message": "Adding media"})
            stem = pathlib.Path(job.textbook_file).stem
            out_path = self.storage.path("out", stem, f"{job.id}.pptx")
            async with self.storage.read(out_path) as f:
                prs = Presentation(f)

                metadata = job.metadata.get("finalize", {})
                if not isinstance(metadata, dict):
                    metadata = {}

                async for event in agent.finalize(prs, metadata):
                    if isinstance(event, agent.ShikshaCheckpointEvent):
                        await self._process_checkpoint(job, event, "finalize", prs, out_path)
                    else:
                        await self.jobs.log(job.id, "event", json.loads(event.model_dump_json()))
                await docparser.save_pptx(self.storage, prs, out_path)
            await self.jobs.update(job.id, {"status": "quality_check"})
        elif job.status == "quality_check":
            stem = pathlib.Path(job.textbook_file).stem
            out_path = self.storage.path("out", stem, f"{job.id}.pptx")
            async with self.storage.read(out_path) as f:
                prs = Presentation(f)

                quality_score = 1.0
                quality_issues = []

                # check 1: minimum slide count
                if len(prs.slides) < 3:
                    quality_score -= 0.3
                    quality_issues.append("Presentation has very few slides")

                # check 2: slide creation success
                design_metadata = job.metadata.get("design", {})
                if isinstance(design_metadata, dict):
                    slides_created = design_metadata.get("slides_created", 0)
                    failed_slides = design_metadata.get("failed_slides", [])

                    if slides_created > 0:
                        quality_score = min(1.0, quality_score + 0.1)

                    if len(failed_slides) > 0:
                        quality_score -= 0.1 * len(failed_slides)
                        quality_issues.append(f"{len(failed_slides)} slide(s) had creation issues")

                # check 3: video integration
                finalize_metadata = job.metadata.get("finalize", {})
                if isinstance(finalize_metadata, dict):
                    videos_added = len(finalize_metadata.get("relevant_videos", []))
                    if videos_added > 0:
                        quality_score = min(1.0, quality_score + 0.1)
                    else:
                        quality_issues.append("No educational videos added")

                # Check 4: Content enrichment
                if isinstance(design_metadata, dict):
                    retry_count = design_metadata.get("retry_count", 0)
                    if retry_count > 2:
                        quality_score -= 0.05
                        quality_issues.append("Multiple retries required during creation")

                # Ensure score stays in valid range
                quality_score = max(0.0, min(1.0, quality_score))

                await self.jobs.update(job.id, {
                    "status": "complete",
                    "message": f"Presentation complete! Quality score: {int(quality_score * 100)}%",
                    "metadata.quality": {
                        "score": quality_score,
                        "issues": quality_issues,
                        "total_slides": len(prs.slides),
                        "completion_time": datetime.now().isoformat()
                    }
                })
        elif job.status == "error":
            # Check if recovery should be attempted
            error_metadata = job.metadata.get("error", {})
            if isinstance(error_metadata, dict) and not error_metadata.get("recovery_attempted", False):
                self.logger.info(f"Attempting recovery for job {job.id} after 5 seconds")
                await asyncio.sleep(5)
                await self.jobs.update(job.id, {
                    "status": "init",
                    "message": "Retrying after error - attempting recovery",
                    "metadata.error.recovery_attempted": True
                })
            else:
                # Recovery already attempted, stay in error state
                self.logger.error(f"Job {job.id} remains in error state - recovery already attempted")


def new_default():
    storage = Storage(settings.pres_storage_filesystem, settings.pres_storage_root, settings.pres_storage_options)
    jobs = JobManager(settings.pres_mongodb_url)
    return PresentationService(storage, jobs)
