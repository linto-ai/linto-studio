"""Tests for conversations whose audio is appended after the upload."""

import aiohttp
import pytest

from linto.main import LinTO
from linto.services.studioApiService import StudioApiService


STT_SERVICE = {
    "serviceName": "stt-fr",
    "language": "fr-FR",
    "scope": ["stt"],
    "endpoints": [{"endpoint": "/stt-fr"}],
    "model_type": "whisper",
}


def _fields(data):
    """The fields of a FormData, by name."""
    return {field[0]["name"]: field[2] for field in data._fields}


@pytest.fixture
def sent(monkeypatch):
    """The requests the SDK sends: method, url and form fields."""
    requests = []

    async def fake_send_request(self_, method, url, **kwargs):
        data = kwargs.get("data")
        requests.append(
            {
                "method": method,
                "url": url,
                "fields": _fields(data) if isinstance(data, aiohttp.FormData) else {},
            }
        )
        return {"conversationId": "conv-1", "message": "ok"}

    monkeypatch.setattr(StudioApiService, "_send_request", fake_send_request)
    return requests


def _linto():
    linto = LinTO(auth_token="dummy", base_url="http://studio")
    linto.api_service.asr_services = [STT_SERVICE]
    linto.api_service.organizations = [{"_id": "org-1"}]
    return linto


@pytest.mark.asyncio
class TestPartialUpload:
    async def test_partial_keeps_the_conversation_open(self, sent):
        assert await _linto().upload(b"audio", language="fr", partial=True) == "conv-1"
        assert sent[0]["url"] == "http://studio/api/organizations/org-1/conversations/create"
        assert sent[0]["fields"]["partial"] == "true"

    async def test_an_upload_is_whole_by_default(self, sent):
        await _linto().upload(b"audio", language="fr")
        assert "partial" not in sent[0]["fields"]


@pytest.mark.asyncio
class TestAppend:
    async def test_append_sends_the_next_audio(self, sent):
        await _linto().append("conv-1", b"next audio")
        assert sent[0]["method"] == "POST"
        assert (
            sent[0]["url"]
            == "http://studio/api/organizations/org-1/conversations/conv-1/append"
        )
        assert sent[0]["fields"] == {"file": b"next audio"}

    async def test_the_last_audio_can_close_the_conversation(self, sent):
        await _linto().append("conv-1", b"last audio", complete=True)
        assert sent[0]["fields"] == {"file": b"last audio", "complete": "true"}

    async def test_complete_closes_without_audio(self, sent):
        await _linto().complete("conv-1")
        assert (
            sent[0]["url"]
            == "http://studio/api/organizations/org-1/conversations/conv-1/append"
        )
        assert sent[0]["fields"] == {"complete": "true"}

    async def test_the_conversation_organization_can_be_named(self, sent):
        await _linto().append("conv-1", b"audio", organization_id="org-2")
        await _linto().complete("conv-1", organization_id="org-2")
        assert all("/organizations/org-2/" in request["url"] for request in sent)

    async def test_an_append_needs_audio_or_complete(self, sent):
        with pytest.raises(ValueError):
            await _linto().append("conv-1")
        assert sent == []
