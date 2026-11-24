import asyncio

import pytest

from linto.main import LinTO
from linto.services.studioApiService import StudioApiService


class _Recorder:
    def __init__(self):
        self.calls = []

    async def send(self, method, url, **kwargs):
        self.calls.append((method, url, kwargs.get("response_type")))
        return {"ok": True}


@pytest.fixture
def service():
    svc = StudioApiService.__new__(StudioApiService)
    svc.base_api_url = "http://studio/api"
    svc.token = "tok"
    svc.organizations = [{"_id": "org-1"}]
    rec = _Recorder()
    svc._send_request = rec.send
    return svc, rec


def test_templates_are_listed_under_the_organization(service):
    svc, rec = service
    asyncio.run(svc.get_publication_templates())
    assert rec.calls == [("GET", "http://studio/api/publication/organizations/org-1/templates", None)]


def test_templates_can_be_narrowed_to_a_service(service):
    svc, rec = service
    asyncio.run(svc.get_publication_templates(serviceId="meeting/minutes"))
    assert rec.calls[0][1] == (
        "http://studio/api/publication/organizations/org-1/templates?service_id=meeting%2Fminutes"
    )


def test_placeholders_are_under_the_organization(service):
    svc, rec = service
    asyncio.run(svc.get_template_placeholders(templateId="tpl-1"))
    assert rec.calls[0][1] == (
        "http://studio/api/publication/organizations/org-1/templates/tpl-1/placeholders"
    )


def test_export_is_scoped_by_the_conversation(service):
    svc, rec = service
    asyncio.run(
        svc.export_with_template(
            conversationId="conv-1", jobId="job-1", format="pdf", templateId="tpl-1", versionNumber=2
        )
    )
    assert rec.calls == [
        (
            "GET",
            "http://studio/api/publication/conversations/conv-1/jobs/job-1/export/pdf"
            "?templateId=tpl-1&versionNumber=2",
            "binary",
        )
    ]


def test_high_level_export_requires_the_conversation():
    linto = LinTO.__new__(LinTO)
    with pytest.raises(ValueError, match="conversation_id"):
        asyncio.run(linto.export_with_template("job-1", template_id="tpl-1"))


def test_high_level_export_forwards_every_argument(service):
    svc, rec = service
    linto = LinTO.__new__(LinTO)
    linto.api_service = svc
    asyncio.run(
        linto.export_with_template(
            "job-1", format="docx", template_id="tpl-1", conversation_id="conv-1"
        )
    )
    assert rec.calls[0][1] == (
        "http://studio/api/publication/conversations/conv-1/jobs/job-1/export/docx?templateId=tpl-1"
    )


def test_an_explicit_organization_is_the_one_in_the_path(service):
    svc, rec = service
    linto = LinTO.__new__(LinTO)
    linto.api_service = svc
    asyncio.run(linto.get_publication_templates(service_id="minutes", organization_id="org-9"))
    asyncio.run(linto.get_template_placeholders("tpl-1", organization_id="org-9"))
    assert [call[1] for call in rec.calls] == [
        "http://studio/api/publication/organizations/org-9/templates?service_id=minutes",
        "http://studio/api/publication/organizations/org-9/templates/tpl-1/placeholders",
    ]


def test_without_an_organization_the_first_one_is_used(service):
    svc, rec = service
    linto = LinTO.__new__(LinTO)
    linto.api_service = svc
    asyncio.run(linto.get_publication_templates())
    asyncio.run(linto.get_template_placeholders("tpl-1"))
    assert [call[1] for call in rec.calls] == [
        "http://studio/api/publication/organizations/org-1/templates",
        "http://studio/api/publication/organizations/org-1/templates/tpl-1/placeholders",
    ]
