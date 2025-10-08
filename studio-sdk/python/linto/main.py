from .services.studioApiService import StudioApiService
from .services.pollingService import PollingService
from datetime import datetime


class LinTO:
    def __init__(self, auth_token, base_url="https://studio.linto.ai/cm-api"):
        self.base_url = base_url
        self.api_service = StudioApiService(
            base_url=base_url, token=auth_token
        )

    async def transcribe(self, file, enable_diarization=True, number_of_speaker="0", language="*", enablePunctuation=True, name=f"imported file {datetime.now().isoformat()}"):
        args = {}
        args["file"] = file
        res = await self.api_service.upload_file(
            file=file,
            enable_diarization=enable_diarization,
            number_of_speaker=number_of_speaker,
            language=language,
            enablePunctuation=enablePunctuation,
            name=name
        )
        media_id = res["conversationId"]
        return PollingService(media_id, self.api_service)

    async def list_services(self):
        return await self.api_service.fetch_asr_services()
