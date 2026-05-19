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

    async def transcribe(self, file, enable_diarization=True, number_of_speaker="0", language="*", enablePunctuation=True, name=f"imported file {datetime.now().isoformat()}", members_right=None):
        args = {}
        args["file"] = file
        res = await self.api_service.upload_file(
            file=file,
            enable_diarization=enable_diarization,
            number_of_speaker=number_of_speaker,
            lang=language,
            enablePunctuation=enablePunctuation,
            name=name,
            membersRight=members_right,
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

    async def share_conversation(self, conversation_id, email, right=1, notify=True):
        """Share a conversation with a user by email (READ access by default).

        By default LinTO Studio sends the notification email automatically.
        Pass notify=False to suppress it.
        """
        return await self.api_service.share_conversation(
            conversationId=conversation_id, email=email, right=right, notify=notify,
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

    # --- Taxonomy: categories, tags, folders ---

    async def list_categories(self):
        """List categories of the current organization."""
        return await self.api_service.list_categories()

    async def list_tags(self, category_id):
        """List tags of a category."""
        return await self.api_service.list_tags(categoryId=category_id)

    async def create_tag(self, category_id, name, color=None, emoji=None):
        """Create a tag inside a category. Returns the created tag dict."""
        return await self.api_service.create_tag(
            categoryId=category_id, name=name, color=color, emoji=emoji
        )

    async def ensure_tag(self, name, category_name="tags", color=None, emoji=None):
        """Return tag id for `name` in category `category_name`, creating both if needed.

        Defaults to the built-in "tags" category whose entries surface as
        tag chips on media cards. Falls back to the first available category
        when `category_name` is missing. Returns None if no category exists.
        """
        categories = await self.list_categories()
        if not isinstance(categories, list) or not categories:
            return None

        cat = None
        for c in categories:
            if str(c.get("name", "")).lower() == category_name.lower():
                cat = c
                break
        if cat is None:
            cat = categories[0]
        category_id = str(cat.get("_id") or cat.get("id") or "")
        if not category_id:
            return None

        tags = await self.list_tags(category_id)
        if isinstance(tags, list):
            for t in tags:
                if str(t.get("name", "")).lower() == name.lower():
                    return str(t.get("_id") or t.get("id") or "")

        created = await self.create_tag(
            category_id=category_id, name=name, color=color, emoji=emoji
        )
        if isinstance(created, dict):
            return str(created.get("_id") or created.get("id") or "") or None
        return None

    async def add_conversation_tag(self, conversation_id, tag_id):
        """Append a tag to a conversation, preserving existing tags."""
        if not tag_id:
            return None
        conv = await self.api_service.get_conversation(
            conversationId=conversation_id
        )
        existing = []
        if isinstance(conv, dict):
            raw = conv.get("tags") or []
            if isinstance(raw, list):
                existing = [str(t) for t in raw if t]
        if tag_id in existing:
            return existing
        new_tags = existing + [tag_id]
        await self.update_conversation(conversation_id, {"tags": new_tags})
        return new_tags

    async def list_folders(self):
        """List folders of the current organization."""
        return await self.api_service.list_folders()

    async def create_folder(self, name, parent_id=None, color=None, emoji=None, visibility="public"):
        """Create a folder. Returns the created folder dict."""
        return await self.api_service.create_folder(
            name=name, parentId=parent_id, color=color, emoji=emoji,
            visibility=visibility,
        )

    async def ensure_folder(self, name, parent_id=None, visibility="public"):
        """Return folder id for `name` (root level by default), creating it if needed.

        When created with visibility='private', the service account becomes
        the folder owner and conversations moved into it get
        membersRight=UNDEFINED — invisible to org members below MAINTAINER.
        """
        folders = await self.list_folders()
        if isinstance(folders, list):
            for f in folders:
                if (
                    str(f.get("name", "")).lower() == name.lower()
                    and (f.get("parentId") or None) == parent_id
                ):
                    return str(f.get("_id") or f.get("id") or "")

        created = await self.create_folder(
            name=name, parent_id=parent_id, visibility=visibility,
        )
        if isinstance(created, dict):
            return str(created.get("_id") or created.get("id") or "") or None
        return None

    async def move_to_folder(self, folder_id, conversation_id):
        """Move a conversation into a folder."""
        return await self.api_service.move_conversation_to_folder(
            folderId=folder_id, conversationId=conversation_id
        )
