from .services.studioApiService import StudioApiService
from .services.pollingService import PollingService
from .services.summaryPollingService import SummaryPollingService
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

    async def list_llm_services(self):
        """List available LLM services."""
        return await self.api_service.fetch_llm_services()

    async def summarize(self, conversation_id, service_route, flavor=None):
        """Trigger LLM summary and return a polling handle.

        Returns a SummaryPollingService emitting "done", "error", "update" events.
        """
        await self.api_service.trigger_summary(
            conversationId=conversation_id,
            format=service_route,
            flavor=flavor,
        )
        return SummaryPollingService(
            conversation_id, service_route, self.api_service
        )

    async def get_export_list(self, conversation_id):
        """Get list of exports for a conversation."""
        return await self.api_service.get_export_list(
            conversationId=conversation_id
        )

    async def get_export_content(self, conversation_id, job_id):
        """Get the content of a completed export."""
        return await self.api_service.get_export_content(
            conversationId=conversation_id,
            jobId=job_id,
        )

    async def share_conversation(self, conversation_id, email, right=1):
        """Share a conversation with a user by email (READ access by default).

        LinTO Studio sends the notification email automatically.
        """
        return await self.api_service.share_conversation(
            conversationId=conversation_id, email=email, right=right
        )

    async def search_users(self, search):
        """Search users by email or name."""
        return await self.api_service.search_users(search=search)

    async def update_conversation(self, conversation_id, data):
        """Update conversation fields (owner, sharedWithUsers, etc.)."""
        return await self.api_service.update_conversation(
            conversationId=conversation_id, data=data
        )

    async def set_conversation_owner(self, conversation_id, email):
        """Set conversation owner by email. Removes all other access rights.

        Searches for the user by email, then updates the conversation
        owner and clears sharedWithUsers and customRights.
        Returns the userId if successful, None otherwise.
        """
        users = await self.search_users(email)
        if not users:
            return None

        user_id = None
        for u in users:
            if u.get("email", "").lower() == email.lower():
                user_id = str(u.get("_id", ""))
                break

        if not user_id:
            return None

        await self.update_conversation(conversation_id, {
            "owner": user_id,
            "sharedWithUsers": [],
            "organization": {"customRights": []},
        })
        return user_id

    async def download_conversation(self, conversation_id, format="docx"):
        """Download transcription directly (without LLM). Returns binary for docx/odt, dict for json."""
        return await self.api_service.download_conversation(
            conversationId=conversation_id,
            format=format,
        )

    async def get_publication_templates(self):
        """Get available publication templates."""
        return await self.api_service.get_publication_templates()

    async def get_template_placeholders(self, template_id):
        """Get placeholders for a specific publication template."""
        return await self.api_service.get_template_placeholders(
            templateId=template_id
        )

    async def export_with_template(self, job_id, format="pdf", template_id=None, version_number=None):
        """Export a document using a publication template. Returns binary content."""
        return await self.api_service.export_with_template(
            jobId=job_id,
            format=format,
            templateId=template_id,
            versionNumber=version_number,
        )
