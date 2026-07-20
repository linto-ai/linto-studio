
import aiohttp
import json
import logging
from datetime import datetime
from ..models.media import Media
from ..tools.generate_service_config import generate_service_config
from ..tools.pick_kwarg import pick_kwarg

def _lang_matches(service_lang, requested_lang):
    if requested_lang == "*":
        return True
    if not service_lang or not requested_lang:
        return False
    for token in str(service_lang).split(","):
        token = token.strip()
        if not token:
            continue
        if token == "*" or token == requested_lang:
            return True
        if token.split("-")[0] == requested_lang.split("-")[0]:
            return True
    return False


def get_service_by_quality_and_lang(services, quality, lang):
    return next(
        (s for s in services if _lang_matches(s.get("language"), lang)),
        None,
    )

# --- Decorators ---

def with_token(method):
    async def wrapper(self, *args, **kwargs):
        if "token" not in kwargs:
            if not self.token:
                raise RuntimeError(
                    "No token. You need to pass a token or login first")
            kwargs["token"] = self.token
        return await method(self, *args, **kwargs)
    return wrapper


def with_organization_id(method):
    async def wrapper(self, *args, **kwargs):
        if "organizationId" not in kwargs:
            if not self.organizations:
                await self.fetch_organizations()
            if not self.organizations:
                raise RuntimeError("User has no organizations")
            kwargs["organizationId"] = self.organizations[0]["_id"]
        return await method(self, *args, **kwargs)
    return wrapper


def with_upload_config(method):
    async def wrapper(self, *args, **kwargs):
        file = kwargs.pop("file", None)
        lang = kwargs.get("lang", "*")

        if not self.asr_services:
            await self.fetch_asr_services()

        selected = get_service_by_quality_and_lang(self.asr_services, 1, lang)
        if not selected:
            available = sorted({s.get("language") or "?" for s in self.asr_services})
            raise RuntimeError(
                f"No ASR service available for lang={lang!r}. "
                f"Available languages: {available}. "
                f"Check gateway service configuration."
            )

        # Accept both snake_case (PEP 8) and camelCase keys: callers from
        # within the SDK (e.g. LinTO.transcribe) use snake_case while public
        # kwargs historically used camelCase. Resolving both avoids the bug
        # where enable_diarization=True at the caller silently became False.
        service_config = generate_service_config(
            selected,
            enable_punctuation=pick_kwarg(
                kwargs, "enablePunctuation", "enable_punctuation", default=False
            ),
            enable_diarization=pick_kwarg(
                kwargs, "enableDiarization", "enable_diarization", default=False
            ),
            number_of_speaker=pick_kwarg(
                kwargs, "numberOfSpeaker", "number_of_speaker", default=0
            ),
            language_value=lang,
        )

        kwargs.setdefault("serviceName", service_config["serviceName"])
        kwargs.setdefault("endpoint", service_config["endpoint"])
        kwargs.setdefault("transcriptionConfig", service_config["config"])
        kwargs.setdefault("lang", lang)
        kwargs["file"] = file
        kwargs.setdefault(
            "name", f"imported file {datetime.now().isoformat()}")
        kwargs.setdefault("segmentCharSize", 2000)
        return await method(self, *args, **kwargs)
    return wrapper


class StudioApiService:
    def __init__(
        self,
        base_url="https://studio.linto.ai",
        api_path="api",
        auth_path="auth",
        token=None,
    ):
        self.base_api_url = f"{base_url}/{api_path}"
        self.base_auth_url = f"{base_url}/{auth_path}"
        self.token = token
        self.organizations = []
        self.asr_services = []

    # --- API methods ---

    @with_token
    async def fetch_asr_services(self, **kwargs):
        services = await self._fetch_services(**kwargs)
        stt_services = [s for s in services if "stt" in s.get("scope", [])]
        self.asr_services = stt_services
        return stt_services

    @with_token
    async def get_media_status(self, mediaId: str, **kwargs):
        return await self._fetch_media(mediaId=mediaId, key="job", **kwargs)

    @with_token
    async def get_media(self, mediaId: str, **kwargs):
        mediaValue = await self._fetch_media(mediaId=mediaId, **kwargs)
        return Media(mediaValue)

    @with_token
    async def fetch_organizations(self, **kwargs):
        organizations = await self._fetch_organizations(**kwargs)
        self.organizations = organizations
        return organizations

    @with_token
    @with_organization_id
    @with_upload_config
    async def upload_file(self, **kwargs):
        file = kwargs.get("file")
        if not file:
            raise RuntimeError("File is required")

        org_id = kwargs["organizationId"]
        url = f"{self.base_api_url}/organizations/{org_id}/conversations/create"

        form = aiohttp.FormData()
        form.add_field("name", kwargs.get("name", "name"))
        form.add_field("file", file)
        form.add_field("serviceName", kwargs["serviceName"])

        form.add_field("transcriptionConfig", json.dumps(
            kwargs["transcriptionConfig"]))
        form.add_field("segmentCharSize", json.dumps(
            kwargs["segmentCharSize"]))
        form.add_field("lang", kwargs["lang"])
        form.add_field("endpoint", kwargs["endpoint"])

        if kwargs.get("membersRight") is not None:
            form.add_field("membersRight", str(int(kwargs["membersRight"])))

        # Speaker identification (org-level): forward the requested voiceprint
        # collection ids so studio-api runs identification during diarization.
        # Guarded on diarization being *effectively* enabled — with_upload_config
        # downgrades enableDiarization to False when no diarization worker is
        # available, and the backend rejects the whole upload when collections
        # are sent without diarization.
        collections = kwargs.get("speakerIdentificationCollections")
        if collections and kwargs["transcriptionConfig"].get(
            "diarizationConfig", {}
        ).get("enableDiarization") is True:
            form.add_field(
                "speakerIdentificationCollections", json.dumps(list(collections))
            )

        return await self._send_request("POST", url, data=form, token=kwargs["token"])

    # --- Speaker identification methods ---

    @with_token
    @with_organization_id
    async def list_voiceprint_collections(self, **kwargs):
        """List the organization's voiceprint collections.

        The backend auto-creates and includes the org-level "Organization"
        collection (type == "organization") on this call.
        """
        org_id = kwargs["organizationId"]
        url = f"{self.base_api_url}/organizations/{org_id}/voiceprint-collections"
        return await self._send_request("GET", url, **kwargs)

    # --- LLM / Summary methods ---

    @with_token
    @with_organization_id
    async def fetch_llm_services(self, **kwargs):
        """List available LLM services for the organization."""
        org_id = kwargs["organizationId"]
        url = f"{self.base_api_url}/services/{org_id}/llm"
        return await self._send_request("GET", url, **kwargs)

    @with_token
    async def trigger_summary(self, conversationId, format, flavor=None, **kwargs):
        """Trigger LLM summary generation for a conversation."""
        url = f"{self.base_api_url}/conversations/{conversationId}/download?format={format}"
        if flavor:
            url += f"&flavor={flavor}"
        return await self._send_request("POST", url, **kwargs)

    @with_token
    async def get_export_list(self, conversationId, **kwargs):
        """Get list of exports for a conversation."""
        url = f"{self.base_api_url}/conversations/{conversationId}/export/list"
        return await self._send_request("GET", url, **kwargs)

    @with_token
    async def get_export_content(self, conversationId, jobId, **kwargs):
        """Get the content of a completed export."""
        url = f"{self.base_api_url}/conversations/{conversationId}/export/{jobId}/content"
        return await self._send_request("GET", url, **kwargs)

    # --- Sharing methods ---

    @with_token
    async def share_conversation(self, conversationId, email, right=1, notify=True, **kwargs):
        """Share a conversation with a user by email.

        By default LinTO Studio sends an email notification. Pass notify=False
        to suppress it (useful when the caller already manages user comms).
        If the user doesn't exist, an external account with magic link is created.
        """
        url = f"{self.base_api_url}/conversations/{conversationId}/invite"
        payload = {"email": email, "right": right}
        if not notify:
            payload["notify"] = False
        return await self._send_request("POST", url, json=payload, **kwargs)

    # --- Taxonomy methods (categories, tags, folders) ---

    @with_token
    @with_organization_id
    async def list_categories(self, **kwargs):
        """List categories of the organization."""
        org_id = kwargs["organizationId"]
        url = f"{self.base_api_url}/organizations/{org_id}/categories"
        return await self._send_request("GET", url, **kwargs)

    @with_token
    @with_organization_id
    async def list_tags(self, categoryId, **kwargs):
        """List tags of a category."""
        org_id = kwargs["organizationId"]
        url = (
            f"{self.base_api_url}/organizations/{org_id}/tags"
            f"?categoryId={categoryId}"
        )
        return await self._send_request("GET", url, **kwargs)

    @with_token
    @with_organization_id
    async def create_tag(
        self, categoryId, name, color=None, emoji=None, description=None, **kwargs
    ):
        """Create a tag inside a category."""
        org_id = kwargs["organizationId"]
        url = f"{self.base_api_url}/organizations/{org_id}/tags"
        payload = {
            "organizationId": org_id,
            "categoryId": categoryId,
            "name": name,
        }
        if color is not None:
            payload["color"] = color
        if emoji is not None:
            payload["emoji"] = emoji
        if description is not None:
            payload["description"] = description
        return await self._send_request("POST", url, json=payload, **kwargs)

    @with_token
    @with_organization_id
    async def list_folders(self, tree=False, withConversationCount=False, **kwargs):
        """List folders of the organization."""
        org_id = kwargs["organizationId"]
        params = []
        if tree:
            params.append("tree=true")
        if withConversationCount:
            params.append("withConversationCount=true")
        url = f"{self.base_api_url}/organizations/{org_id}/folders"
        if params:
            url += "?" + "&".join(params)
        return await self._send_request("GET", url, **kwargs)

    @with_token
    @with_organization_id
    async def create_folder(
        self, name, parentId=None, color=None, emoji=None, visibility="public", **kwargs
    ):
        """Create a folder in the organization."""
        org_id = kwargs["organizationId"]
        url = f"{self.base_api_url}/organizations/{org_id}/folders"
        payload = {"name": name, "visibility": visibility}
        if parentId is not None:
            payload["parentId"] = parentId
        if color is not None:
            payload["color"] = color
        if emoji is not None:
            payload["emoji"] = emoji
        return await self._send_request("POST", url, json=payload, **kwargs)

    @with_token
    @with_organization_id
    async def move_conversation_to_folder(self, folderId, conversationId, **kwargs):
        """Move a conversation into a folder (a conversation has at most one folder)."""
        org_id = kwargs["organizationId"]
        url = (
            f"{self.base_api_url}/organizations/{org_id}/folders/"
            f"{folderId}/conversations/{conversationId}"
        )
        return await self._send_request("POST", url, **kwargs)

    @with_token
    async def get_conversation(self, conversationId, **kwargs):
        """Fetch a conversation by id (raw response)."""
        url = f"{self.base_api_url}/conversations/{conversationId}"
        return await self._send_request("GET", url, **kwargs)

    # --- User methods ---

    @with_token
    async def search_users(self, search, **kwargs):
        """Search users by email or name."""
        url = f"{self.base_api_url}/users/search?search={search}"
        return await self._send_request("GET", url, **kwargs)

    # --- Conversation management methods ---

    @with_token
    async def update_conversation(self, conversationId, data, **kwargs):
        """Update conversation fields (owner, sharedWithUsers, etc.)."""
        url = f"{self.base_api_url}/conversations/{conversationId}"
        return await self._send_request("PATCH", url, json=data, **kwargs)

    # --- Download methods ---

    @with_token
    async def download_conversation(self, conversationId, format="docx", **kwargs):
        """Download transcription in the given format (docx, text, json, etc.)."""
        url = f"{self.base_api_url}/conversations/{conversationId}/download?format={format}"
        response_type = "binary" if format in ("docx", "odt", "verbatim") else None
        return await self._send_request("POST", url, response_type=response_type, **kwargs)

    # --- Publication methods ---

    @with_token
    @with_organization_id
    async def get_publication_templates(self, **kwargs):
        """Get available publication templates for the organization."""
        org_id = kwargs["organizationId"]
        url = f"{self.base_api_url}/publication/templates?organization_id={org_id}"
        return await self._send_request("GET", url, **kwargs)

    @with_token
    async def get_template_placeholders(self, templateId, **kwargs):
        """Get placeholders for a specific publication template."""
        url = f"{self.base_api_url}/publication/templates/{templateId}/placeholders"
        return await self._send_request("GET", url, **kwargs)

    @with_token
    async def export_with_template(self, jobId, format, templateId=None, versionNumber=None, **kwargs):
        """Export a document using a publication template. Returns binary content (PDF/DOCX)."""
        url = f"{self.base_api_url}/publication/{jobId}/export/{format}"
        params = []
        if templateId:
            params.append(f"templateId={templateId}")
        if versionNumber is not None:
            params.append(f"versionNumber={versionNumber}")
        if params:
            url += "?" + "&".join(params)
        return await self._send_request("GET", url, response_type="binary", **kwargs)

    async def login(self, email: str, password: str):
        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"{self.base_auth_url}/login",
                json={"email": email, "password": password},
            ) as resp:
                res = await resp.json()
                self.token = res.get("auth_token")
                return res

    # --- Internal fetchers ---

    async def _fetch_media(self, mediaId, **kwargs):
        url = f"{self.base_api_url}/conversations/{mediaId}"
        return await self._send_request("GET", url, **kwargs)

    async def _fetch_services(self, **kwargs):
        url = f"{self.base_api_url}/services"
        return await self._send_request("GET", url, **kwargs)

    async def _fetch_organizations(self, **kwargs):
        url = f"{self.base_api_url}/organizations"
        return await self._send_request("GET", url, **kwargs)

    async def _send_request(self, method, url, **kwargs):
        headers = {"Authorization": f"Bearer {kwargs.get('token')}"}
        logging.debug(f"Sending request {method} {url}")
        async with aiohttp.ClientSession() as session:
            async with session.request(
                method, url, headers=headers, json=kwargs.get("json"), data=kwargs.get("data")
            ) as resp:
                logging.debug(f"Response status: {resp.status}")

                if not (200 <= resp.status < 300):
                    try:
                        content = await resp.text()
                    except Exception:
                        content = "<no content>"
                    raise aiohttp.ClientResponseError(
                        status=resp.status,
                        message=f"HTTP request failed: {resp.status}, content: {content}",
                        request_info=resp.request_info,
                        history=resp.history,
                    )
                if resp.status == 204:
                    return None
                if kwargs.get("response_type") == "binary":
                    return await resp.read()
                return await resp.json()
