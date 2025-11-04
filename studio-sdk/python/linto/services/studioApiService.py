
import aiohttp
import json
import logging
from datetime import datetime
from ..models.media import Media
from ..tools.generate_service_config import generate_service_config

def get_service_by_quality_and_lang(services, quality, lang):
    return next((s for s in services if s.get("language") in ("*", lang)), None)

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
            raise RuntimeError(f"No ASR services available for lang={lang}")

        service_config = generate_service_config(
            selected,
            enable_punctuation=kwargs.get("enablePunctuation", False),
            enable_diarization=kwargs.get("enableDiarization", False),
            number_of_speaker=kwargs.get("numberOfSpeaker", 0),
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
        self.asr_services = services
        return [s for s in services if "stt" in s.get("scope", [])]

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

        return await self._send_request("POST", url, data=form, token=kwargs["token"])

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
                return await resp.json()
