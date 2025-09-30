from .services.studioApiService import StudioApiService


class LinTO:
    def __init__(self, token, base_url="https://studio.linto.ai", api_path="cm-api", auth_path="auth"):
        self.base_url = base_url
        self.api_path = api_path
        self.auth_path = auth_path
        self.api_service = StudioApiService(
            base_url, api_path, auth_path, token
        )

    async def transcribe(self, file, enable_diarization=True, number_of_speaker="0", language="*"):
        args = {}
        args["file"] = file
        res = await self.api_service.upload_file(file=file)
        media_id = res["conversationId"]
        print(media_id)
        # orgas = await self.api_service.fetch_asr_services()
