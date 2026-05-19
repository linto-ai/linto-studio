import asyncio
import logging

from .pollingService import EventEmitter


class SummaryPollingService(EventEmitter):
    """Polls export list until LLM summary is complete."""

    def __init__(self, conversation_id, service_route, api_service, interval=2.0):
        super().__init__()
        self.conversation_id = conversation_id
        self.service_route = service_route
        self.api_service = api_service
        self.interval = interval
        self._task = None
        self.start()

    def start(self):
        if self._task is None:
            self._task = asyncio.create_task(self._poll_loop())

    def stop(self):
        if self._task:
            self._task.cancel()
            self._task = None

    async def _poll_loop(self):
        try:
            while True:
                exports = await self.api_service.get_export_list(
                    conversationId=self.conversation_id
                )

                # Find the export matching our service route
                export = None
                for e in (exports if isinstance(exports, list) else []):
                    if e.get("format") == self.service_route:
                        export = e
                        break

                if export is None:
                    await asyncio.sleep(self.interval)
                    continue

                status = export.get("status")
                if status in ("complete", "done"):
                    job_id = export.get("jobId")
                    if job_id:
                        content = await self.api_service.get_export_content(
                            conversationId=self.conversation_id,
                            jobId=job_id,
                        )
                        await self.emit("done", {"content": content, "jobId": job_id})
                    else:
                        await self.emit("done", {"content": export, "jobId": None})
                    self.stop()
                    break
                elif status == "error":
                    await self.emit("error", export)
                    self.stop()
                    break
                else:
                    await self.emit("update", export)

                await asyncio.sleep(self.interval)
        except asyncio.CancelledError:
            logging.debug("Summary polling cancelled")
