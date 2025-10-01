from .services.studioApiService import StudioApiService
from .services.pollingService import PollingService


class LinTO:
    def __init__(self, token, base_url="https://studio.linto.ai/cm-api"):
        self.base_url = base_url
        self.api_service = StudioApiService(
            base_url=base_url, token=token
        )

    async def transcribe(self, file, enable_diarization=True, number_of_speaker="0", language="*"):
        args = {}
        args["file"] = file
        res = await self.api_service.upload_file(file=file)
        media_id = res["conversationId"]
        return PollingService(media_id, self.api_service)
