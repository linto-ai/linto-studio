"""Tests for ASR service selection and language matching in the SDK."""

import json

import pytest

from linto.main import LinTO
from linto.services.studioApiService import (
    StudioApiService,
    _lang_matches,
    get_service_by_quality_and_lang,
)


STT_SERVICE_FR = {
    "serviceName": "stt-fr",
    "language": "fr-FR",
    "scope": ["stt"],
    "endpoints": [{"endpoint": "/stt-fr"}],
    "model_type": "whisper",
}
STT_SERVICE_EN = {
    "serviceName": "stt-en",
    "language": "en-US",
    "scope": ["stt"],
    "endpoints": [{"endpoint": "/stt-en"}],
    "model_type": "whisper",
}
STT_SERVICE_MULTILINGUAL = {
    "serviceName": "stt-multi",
    "language": "*",
    "scope": ["stt"],
    "endpoints": [{"endpoint": "/stt-multi"}],
    "model_type": "whisper",
}
NLP_SERVICE = {
    "serviceName": "nlp-punct",
    "language": "fr-FR",
    "scope": ["nlp"],
    "endpoints": [{"endpoint": "/nlp-punct"}],
}


class TestLangMatches:
    def test_wildcard_service_matches_anything(self):
        assert _lang_matches("*", "fr") is True
        assert _lang_matches("*", "en-US") is True
        assert _lang_matches("*", "*") is True

    def test_wildcard_request_matches_anything(self):
        assert _lang_matches("fr-FR", "*") is True
        assert _lang_matches("en-US", "*") is True

    def test_exact_match(self):
        assert _lang_matches("fr-FR", "fr-FR") is True

    def test_iso_639_1_matches_locale(self):
        assert _lang_matches("fr-FR", "fr") is True

    def test_locale_matches_iso_639_1(self):
        assert _lang_matches("fr", "fr-FR") is True

    def test_different_languages_do_not_match(self):
        assert _lang_matches("fr-FR", "en-US") is False
        assert _lang_matches("fr", "en") is False

    def test_empty_values(self):
        assert _lang_matches("", "fr") is False
        assert _lang_matches("fr", "") is False
        assert _lang_matches(None, "fr") is False

    def test_csv_service_lang_matches_any_token(self):
        csv = "*,fr,en,de,es,it,pt,nl,ru,zh,ja,ko,ar"
        assert _lang_matches(csv, "fr") is True
        assert _lang_matches(csv, "de") is True
        assert _lang_matches(csv, "ar") is True

    def test_csv_service_lang_matches_locale_prefix(self):
        assert _lang_matches("fr,en,de", "fr-FR") is True
        assert _lang_matches("fr-FR,en-US", "fr") is True

    def test_csv_service_lang_no_match(self):
        assert _lang_matches("fr,en,de", "ja") is False

    def test_csv_with_wildcard_token(self):
        assert _lang_matches("*,fr,en", "xx") is True

    def test_csv_with_spaces(self):
        assert _lang_matches("fr, en, de", "en") is True


class TestGetServiceByQualityAndLang:
    def test_selects_fr_service_for_fr_request(self):
        services = [STT_SERVICE_EN, STT_SERVICE_FR]
        selected = get_service_by_quality_and_lang(services, 1, "fr")
        assert selected is STT_SERVICE_FR

    def test_selects_fr_service_for_fr_fr_request(self):
        services = [STT_SERVICE_EN, STT_SERVICE_FR]
        selected = get_service_by_quality_and_lang(services, 1, "fr-FR")
        assert selected is STT_SERVICE_FR

    def test_wildcard_request_picks_first_service(self):
        services = [STT_SERVICE_EN, STT_SERVICE_FR]
        selected = get_service_by_quality_and_lang(services, 1, "*")
        assert selected is STT_SERVICE_EN

    def test_wildcard_service_matches_any_lang(self):
        services = [STT_SERVICE_MULTILINGUAL]
        assert get_service_by_quality_and_lang(services, 1, "fr") is STT_SERVICE_MULTILINGUAL
        assert get_service_by_quality_and_lang(services, 1, "en-US") is STT_SERVICE_MULTILINGUAL

    def test_no_match_returns_none(self):
        services = [STT_SERVICE_FR]
        assert get_service_by_quality_and_lang(services, 1, "de") is None


@pytest.mark.asyncio
class TestFetchAsrServicesCache:
    async def test_cache_contains_only_stt_services(self, monkeypatch):
        service = StudioApiService(token="dummy")

        async def fake_fetch(self_, **kwargs):
            return [STT_SERVICE_FR, NLP_SERVICE, STT_SERVICE_EN]

        monkeypatch.setattr(StudioApiService, "_fetch_services", fake_fetch)
        returned = await service.fetch_asr_services()

        assert NLP_SERVICE not in returned
        assert NLP_SERVICE not in service.asr_services
        assert STT_SERVICE_FR in service.asr_services
        assert STT_SERVICE_EN in service.asr_services


@pytest.mark.asyncio
class TestUploadConfigError:
    async def test_missing_lang_raises_with_available_languages(self, monkeypatch):
        service = StudioApiService(token="dummy")
        service.asr_services = [STT_SERVICE_FR]
        service.organizations = [{"_id": "org-1"}]

        with pytest.raises(RuntimeError) as exc:
            await service.upload_file(file=b"data", lang="de")

        msg = str(exc.value)
        assert "lang='de'" in msg
        assert "fr-FR" in msg
        assert "gateway" in msg.lower()


@pytest.mark.asyncio
class TestTranscribePropagatesLanguage:
    async def test_transcribe_passes_lang_not_language(self, monkeypatch):
        """Regression test: main.py must pass `lang=` so upload_file decorator sees it."""
        captured = {}

        async def fake_upload(self_, **kwargs):
            captured.update(kwargs)
            return {"conversationId": "conv-1"}

        monkeypatch.setattr(StudioApiService, "upload_file", fake_upload)

        client = LinTO(auth_token="dummy", base_url="http://test")
        await client.transcribe(file=b"audio", language="fr")

        assert captured.get("lang") == "fr"
        assert "language" not in captured


@pytest.mark.asyncio
class TestTranscriptionConfigLanguage:
    async def test_transcription_config_language_uses_requested_lang_not_csv(self, monkeypatch):
        """Worker receives the user-requested language, not the raw CSV from the service."""
        csv_service = {
            "serviceName": "stt-multi",
            "language": "*,fr,en,de,es,it,pt,nl,ru,zh,ja,ko,ar",
            "scope": ["stt"],
            "endpoints": [{"endpoint": "/stt-multi"}],
            "model_type": "whisper",
        }
        captured = {}

        async def fake_send_request(self_, method, url, **kwargs):
            data = kwargs.get("data")
            if data is not None:
                for field in data._fields:
                    name = field[0]["name"]
                    value = field[2]
                    captured[name] = value
            return {"conversationId": "conv-1"}

        monkeypatch.setattr(StudioApiService, "_send_request", fake_send_request)

        service = StudioApiService(token="dummy")
        service.asr_services = [csv_service]
        service.organizations = [{"_id": "org-1"}]

        await service.upload_file(file=b"audio", lang="fr")

        config = json.loads(captured["transcriptionConfig"])
        assert config["language"] == "fr"
        assert captured["lang"] == "fr"


@pytest.mark.asyncio
class TestDiarizationPropagation:
    """Regression tests for the snake_case vs camelCase naming mismatch
    between LinTO.transcribe() and the with_upload_config decorator.

    Before the fix, enable_diarization=True at the caller silently became
    False inside generate_service_config because the decorator only checked
    for the camelCase key.
    """

    @staticmethod
    def _service_with_diarization():
        return {
            "serviceName": "stt-fr",
            "language": "fr-FR",
            "scope": ["stt"],
            "endpoints": [{"endpoint": "/stt-fr"}],
            "model_type": "whisper",
            "sub_services": {
                "diarization": [{"service_name": "stt-diarization"}],
                "punctuation": [],
            },
        }

    @staticmethod
    def _service_without_diarization():
        return {
            "serviceName": "stt-fr",
            "language": "fr-FR",
            "scope": ["stt"],
            "endpoints": [{"endpoint": "/stt-fr"}],
            "model_type": "whisper",
            "sub_services": {"diarization": [], "punctuation": []},
        }

    async def _capture_transcription_config(
        self, monkeypatch, service=None, **transcribe_kwargs
    ):
        captured = {}

        async def fake_send_request(self_, method, url, **kwargs):
            data = kwargs.get("data")
            if data is not None:
                for field in data._fields:
                    captured[field[0]["name"]] = field[2]
            return {"conversationId": "conv-1"}

        monkeypatch.setattr(StudioApiService, "_send_request", fake_send_request)

        client = LinTO(auth_token="dummy", base_url="http://test")
        client.api_service.asr_services = [service or self._service_with_diarization()]
        client.api_service.organizations = [{"_id": "org-1"}]

        await client.transcribe(file=b"audio", **transcribe_kwargs)
        return json.loads(captured["transcriptionConfig"])

    async def test_snake_case_enable_diarization_reaches_config(self, monkeypatch):
        config = await self._capture_transcription_config(
            monkeypatch, language="fr", enable_diarization=True
        )
        assert config["diarizationConfig"]["enableDiarization"] is True
        assert config["diarizationConfig"]["serviceName"] == "stt-diarization"

    async def test_camel_case_enableDiarization_reaches_config(self, monkeypatch):
        # Bypass the LinTO.transcribe wrapper so we can send camelCase.
        captured = {}

        async def fake_send_request(self_, method, url, **kwargs):
            data = kwargs.get("data")
            if data is not None:
                for field in data._fields:
                    captured[field[0]["name"]] = field[2]
            return {"conversationId": "conv-1"}

        monkeypatch.setattr(StudioApiService, "_send_request", fake_send_request)

        service = StudioApiService(token="dummy")
        service.asr_services = [self._service_with_diarization()]
        service.organizations = [{"_id": "org-1"}]

        await service.upload_file(file=b"audio", lang="fr", enableDiarization=True)

        config = json.loads(captured["transcriptionConfig"])
        assert config["diarizationConfig"]["enableDiarization"] is True
        assert config["diarizationConfig"]["serviceName"] == "stt-diarization"

    async def test_diarization_off_by_default(self, monkeypatch):
        config = await self._capture_transcription_config(
            monkeypatch, language="fr", enable_diarization=False
        )
        assert config["diarizationConfig"]["enableDiarization"] is False
        assert config["diarizationConfig"]["serviceName"] is None

    async def test_number_of_speaker_snake_case_reaches_config(self, monkeypatch):
        config = await self._capture_transcription_config(
            monkeypatch,
            language="fr",
            enable_diarization=True,
            number_of_speaker="3",
        )
        assert config["diarizationConfig"]["numberOfSpeaker"] == 3


@pytest.mark.asyncio
class TestDiarizationGracefulFallback:
    """Regression tests: when the caller requests diarization but the selected
    ASR service exposes no diarization sub-service, the SDK must fall back
    gracefully (enableDiarization=False) instead of sending a payload with
    enableDiarization=True + serviceName=null — which silently hangs the
    transcription on the gateway side.
    """

    @staticmethod
    def _build_service(diarization_workers=()):
        return {
            "serviceName": "stt-fr",
            "language": "fr-FR",
            "scope": ["stt"],
            "endpoints": [{"endpoint": "/stt-fr"}],
            "model_type": "whisper",
            "sub_services": {
                "diarization": [
                    {"service_name": name} for name in diarization_workers
                ],
                "punctuation": [],
            },
        }

    async def _capture(self, monkeypatch, service, **kwargs):
        captured = {}

        async def fake_send_request(self_, method, url, **request_kwargs):
            data = request_kwargs.get("data")
            if data is not None:
                for field in data._fields:
                    captured[field[0]["name"]] = field[2]
            return {"conversationId": "conv-1"}

        monkeypatch.setattr(StudioApiService, "_send_request", fake_send_request)

        client = LinTO(auth_token="dummy", base_url="http://test")
        client.api_service.asr_services = [service]
        client.api_service.organizations = [{"_id": "org-1"}]

        await client.transcribe(file=b"audio", **kwargs)
        return json.loads(captured["transcriptionConfig"])

    async def test_falls_back_when_no_diarization_worker(self, monkeypatch):
        """Requesting diarization on a service without workers MUST result
        in enableDiarization=False, serviceName=null, numberOfSpeaker=null."""
        config = await self._capture(
            monkeypatch,
            self._build_service(diarization_workers=()),
            language="fr",
            enable_diarization=True,
            number_of_speaker="2",
        )
        diar = config["diarizationConfig"]
        assert diar["enableDiarization"] is False, "Fallback must disable"
        assert diar["serviceName"] is None
        assert diar["numberOfSpeaker"] is None
        assert diar["maxNumberOfSpeaker"] is None

    async def test_enabled_when_diarization_worker_present(self, monkeypatch):
        """Sanity: with a worker, enableDiarization stays True."""
        config = await self._capture(
            monkeypatch,
            self._build_service(diarization_workers=["stt-diar-1"]),
            language="fr",
            enable_diarization=True,
        )
        diar = config["diarizationConfig"]
        assert diar["enableDiarization"] is True
        assert diar["serviceName"] == "stt-diar-1"
