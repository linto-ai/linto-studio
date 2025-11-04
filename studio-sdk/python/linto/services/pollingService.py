import asyncio
import logging


class EventEmitter:
    def __init__(self):
        self._listeners = {}

    def on(self, event, callback):
        self._listeners.setdefault(event, []).append(callback)

    def off(self, event, callback):
        if event in self._listeners:
            self._listeners[event].remove(callback)

    async def emit(self, event, *args, **kwargs):
        for callback in self._listeners.get(event, []):
            result = callback(*args, **kwargs)
            if asyncio.iscoroutine(result):
                await result


class PollingService(EventEmitter):
    def __init__(self, media_id, api_service, interval=1.0):
        super().__init__()
        self.media_id = media_id
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
                media = await self.api_service.get_media_status(mediaId=self.media_id)
                job = media.get("jobs", {}).get("transcription")

                state = job.get("state") if job else None
                if state == "done":
                    logging.debug("Sending done event")
                    media = await self.api_service.get_media(mediaId=self.media_id)
                    await self.emit("done", media)
                    self.stop()
                    break
                elif state == "error":
                    logging.debug("Sending error event")
                    await self.emit("error")
                    self.stop()
                    break
                else:
                    logging.debug("Sending update event")
                    await self.emit("update", job)
                await asyncio.sleep(self.interval)
        except asyncio.CancelledError:
            logging.debug("job cancelled")
            pass
