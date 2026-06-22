"""Tests for the idempotent upload / resume API.

Covers the split introduced for crash-safe resume:
  - upload()      -> returns conversation_id only (no polling)
  - get_media()   -> one-shot fetch of a finished media (resume path)
  - poll_media()  -> wraps an existing conversation_id in a polling handle
  - transcribe()  -> upload() + poll_media() composition (single upload)
and the PollingService "exception" event that surfaces a polling failure
to the awaiter instead of hanging forever.
"""

import asyncio
import inspect

import pytest

from linto.main import LinTO
from linto.services.studioApiService import StudioApiService
from linto.services.pollingService import PollingService


def _status(state):
    return {"jobs": {"transcription": {"state": state}}}


class FakeApiService:
    """Minimal api_service stand-in for PollingService tests."""

    def __init__(self, statuses=None, media=None, raise_on_status=None):
        # `statuses` are returned successively by get_media_status; once
        # exhausted the job stays "started" (in progress) forever.
        self._statuses = list(statuses or [])
        self._media = media if media is not None else {"transcription": "hello"}
        self._raise_on_status = raise_on_status
        self.get_media_calls = 0
        self.last_media_id = None

    async def get_media_status(self, mediaId=None):
        self.last_media_id = mediaId
        if self._raise_on_status is not None:
            raise self._raise_on_status
        if self._statuses:
            return self._statuses.pop(0)
        return _status("started")

    async def get_media(self, mediaId=None):
        self.get_media_calls += 1
        self.last_media_id = mediaId
        return self._media


class TestUpload:
    async def test_returns_conversation_id(self, monkeypatch):
        async def fake_upload(self_, **kwargs):
            return {"conversationId": "conv-xyz"}

        monkeypatch.setattr(StudioApiService, "upload_file", fake_upload)

        client = LinTO(auth_token="dummy", base_url="http://test")
        cid = await client.upload(file=b"audio", language="fr")
        assert cid == "conv-xyz"

    async def test_maps_kwargs_to_api_service(self, monkeypatch):
        captured = {}

        async def fake_upload(self_, **kwargs):
            captured.update(kwargs)
            return {"conversationId": "c"}

        monkeypatch.setattr(StudioApiService, "upload_file", fake_upload)

        client = LinTO(auth_token="dummy", base_url="http://test")
        await client.upload(
            file=b"audio",
            language="fr",
            enable_diarization=False,
            number_of_speaker="2",
            enablePunctuation=False,
            members_right=3,
        )
        # language -> lang (so the upload_file decorator sees it)
        assert captured["lang"] == "fr"
        assert "language" not in captured
        # members_right -> membersRight
        assert captured["membersRight"] == 3
        assert captured["enable_diarization"] is False
        assert captured["number_of_speaker"] == "2"
        assert captured["enablePunctuation"] is False

    async def test_default_name_is_generated_at_call_time(self, monkeypatch):
        names = []

        async def fake_upload(self_, **kwargs):
            names.append(kwargs["name"])
            return {"conversationId": "c"}

        monkeypatch.setattr(StudioApiService, "upload_file", fake_upload)

        client = LinTO(auth_token="dummy", base_url="http://test")
        await client.upload(file=b"a")
        assert names[0].startswith("imported file ")

    def test_name_default_is_none_not_a_frozen_timestamp(self):
        # Regression: the default must be None (computed in the body), never a
        # f-string evaluated once at import time — which would stamp every
        # upload with the SAME timestamp for the whole process lifetime.
        assert inspect.signature(LinTO.upload).parameters["name"].default is None

    async def test_explicit_name_passed_through(self, monkeypatch):
        captured = {}

        async def fake_upload(self_, **kwargs):
            captured.update(kwargs)
            return {"conversationId": "c"}

        monkeypatch.setattr(StudioApiService, "upload_file", fake_upload)

        client = LinTO(auth_token="dummy", base_url="http://test")
        await client.upload(file=b"a", name="my media")
        assert captured["name"] == "my media"


class TestGetMedia:
    async def test_delegates_one_shot_with_media_id(self, monkeypatch):
        captured = {}

        async def fake_get_media(self_, mediaId=None):
            captured["mediaId"] = mediaId
            return {"transcription": "final"}

        monkeypatch.setattr(StudioApiService, "get_media", fake_get_media)

        client = LinTO(auth_token="dummy", base_url="http://test")
        res = await client.get_media("conv-1")
        assert captured["mediaId"] == "conv-1"
        assert res == {"transcription": "final"}


class TestPollMedia:
    async def test_wraps_existing_conversation(self):
        fake = FakeApiService()
        client = LinTO(auth_token="dummy", base_url="http://test")
        client.api_service = fake

        handle = await client.poll_media("conv-1")
        try:
            assert isinstance(handle, PollingService)
            assert handle.media_id == "conv-1"
            assert handle.api_service is fake
        finally:
            handle.stop()


class TestTranscribeComposition:
    async def test_uploads_once_then_polls_that_conversation(self, monkeypatch):
        upload_calls = []

        async def fake_upload(self_, **kwargs):
            upload_calls.append(kwargs)
            return {"conversationId": "conv-42"}

        monkeypatch.setattr(StudioApiService, "upload_file", fake_upload)

        client = LinTO(auth_token="dummy", base_url="http://test")
        handle = await client.transcribe(file=b"audio", language="fr")
        try:
            assert len(upload_calls) == 1  # no duplicate upload
            assert isinstance(handle, PollingService)
            assert handle.media_id == "conv-42"  # polls the uploaded conversation
        finally:
            handle.stop()


class TestPollingServiceEvents:
    async def test_emits_exception_event_and_stops_on_status_failure(self):
        boom = RuntimeError("studio down")
        fake = FakeApiService(raise_on_status=boom)
        handle = PollingService("conv-1", fake, interval=0.01)

        captured = {}
        done = asyncio.Event()

        async def on_exc(exc):
            captured["exc"] = exc
            done.set()

        handle.on("exception", on_exc)
        await asyncio.wait_for(done.wait(), timeout=2)

        assert captured["exc"] is boom  # the real cause is surfaced
        assert handle._task is None  # the loop stopped itself

    async def test_emits_done_with_fetched_media(self):
        fake = FakeApiService(
            statuses=[_status("started"), _status("done")],
            media={"transcription": "final text"},
        )
        handle = PollingService("conv-1", fake, interval=0.01)

        result = {}
        done = asyncio.Event()

        async def on_done(media):
            result["media"] = media
            done.set()

        handle.on("done", on_done)
        await asyncio.wait_for(done.wait(), timeout=2)

        assert result["media"] == {"transcription": "final text"}
        assert fake.get_media_calls == 1  # full media fetched exactly once
        assert handle._task is None

    async def test_emits_error_event_and_stops(self):
        fake = FakeApiService(statuses=[_status("error")])
        handle = PollingService("conv-1", fake, interval=0.01)

        done = asyncio.Event()

        async def on_error():
            done.set()

        handle.on("error", on_error)
        await asyncio.wait_for(done.wait(), timeout=2)

        assert handle._task is None
