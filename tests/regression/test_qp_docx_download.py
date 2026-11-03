# DOCX is built in the browser, so these tests check the real download.
import json
import os
import re
import zipfile

import pytest
from playwright.sync_api import expect

BASE_URL = os.getenv("FRONTEND_URL")
API_URL = os.getenv("BACKEND_URL") or (f"{BASE_URL}/api" if BASE_URL else None)
assert API_URL, "Set BACKEND_URL or FRONTEND_URL so the tests can reach the API."


def _api_get(page, path: str):
    token = page.evaluate("localStorage.getItem('token')")
    response = page.context.request.get(f"{API_URL}{path}", headers={"authorization": token})
    assert response.ok, f"GET {path} returned {response.status}"
    return response.json()["data"]


def _assert_docx(download, tmp_path):
    assert download.suggested_filename.endswith(".docx")
    target = tmp_path / download.suggested_filename
    download.save_as(target)
    assert target.stat().st_size > 0
    with zipfile.ZipFile(target) as docx:
        assert "word/document.xml" in docx.namelist()
        return docx.read("word/document.xml").decode("utf-8")


@pytest.mark.parametrize("doc_index", [0, 2], ids=["question-paper", "question-paper-with-answer-key"])
def test_question_paper_docx_download_is_valid(logged_in_page, tmp_path, doc_index, step):
    page = logged_in_page
    page.goto(f"{BASE_URL}/#/question-papers")
    papers = _api_get(page, "/question-bank/list?page=1&limit=1")["results"]
    assert papers, "GET /question-bank/list returned no question papers for the test user"
    page.goto(f"{BASE_URL}/#/question-papers/view/{papers[0]['_id']}")
    button = page.get_by_test_id("download-btn").nth(doc_index)
    expect(button).to_be_enabled(timeout=20000)
    with step("Download"):
        with page.expect_download(timeout=30000) as info:
            button.click()
        xml = _assert_docx(info.value, tmp_path)
    assert "<w:t" in xml


def test_lesson_plan_docx_with_array_required_materials(logged_in_page, tmp_path, step):
    page = logged_in_page
    page.goto(f"{BASE_URL}/#/question-papers")
    plans = [p for p in _api_get(page, "/teacher-lesson-plan/list?page=1&limit=20") if p.get("isLesson")]
    assert plans, "GET /teacher-lesson-plan/list returned no lesson plans for the test user"
    lesson_id = plans[0]["lesson"]["_id"]
    materials = ["Chart paper", "Marker pens", "Magnets"]
    activities = [
        {
            "title": "Magnet hunt",
            "preparation": "Collect the items.",
            "required_materials": materials,
            "obtaining_materials": "Use the school kit.",
            "recap": "Discuss what stuck.",
        }
    ]

    def rewrite(route):
        response = route.fetch()
        body = response.json()
        body["data"]["sections"][0].update({"outputFormat": "json_3", "content": activities})
        route.fulfill(response=response, body=json.dumps(body))

    page.route(re.compile(rf"/teacher-lesson-plan/lesson/{lesson_id}$"), rewrite)
    page.goto(f"{BASE_URL}/#/content-generation/lesson-plan/{lesson_id}")
    expect(page.get_by_text("Magnet hunt").first).to_be_visible(timeout=20000)
    page.get_by_test_id("documents-tab-btn").click()
    button = page.get_by_test_id("download-btn").locator("visible=true").first
    expect(button).to_be_visible(timeout=20000)
    with step("Download"):
        with page.expect_download(timeout=30000) as info:
            button.click()
        xml = _assert_docx(info.value, tmp_path)
    text = " ".join(re.findall(r"<w:t[^>]*>([^<]*)</w:t>", xml))
    assert "Chart paper" in text and "Magnets" in text
