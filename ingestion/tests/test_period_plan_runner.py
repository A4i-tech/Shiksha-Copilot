import argparse
import asyncio
import json
import sys
from pathlib import Path

import httpx
import pytest

import period_plan_runner as runner
from conftest import TEMPLATE

AZURE_VARS = (
    "AZURE_OPENAI_API_BASE",
    "AZURE_OPENAI_API_KEY",
    "AZURE_OPENAI_API_VERSION",
)


class FailingHttp:
    def __init__(self):
        self.urls = []

    async def __aenter__(self):
        return self

    async def __aexit__(self, *_):
        return False

    async def post(self, url, json):
        self.urls.append(url)
        raise httpx.ConnectError("down")


def run_main(monkeypatch, tmp_path, template):
    (tmp_path / "template.json").write_text(template, encoding="utf-8")
    argv = [
        "runner",
        str(tmp_path / "input.pdf"),
        "--workflow-template",
        str(tmp_path / "template.json"),
        "--out",
        str(tmp_path / "out"),
    ]
    monkeypatch.setattr(sys, "argv", argv)
    return asyncio.run(runner.main())


def test_string_parameters_keep_their_text_on_the_command_line():
    assert runner.name_value("grade=6") == ("grade", "6")
    assert runner.name_value("top_k=5") == ("top_k", 5)
    assert runner.name_value('discourse_types={"major": []}') == (
        "discourse_types",
        '{"major": []}',
    )


def test_a_non_string_parameter_must_be_json():
    with pytest.raises(argparse.ArgumentTypeError, match="must be valid JSON"):
        runner.name_value("top_k=five")


def test_a_parameter_needs_a_value():
    with pytest.raises(argparse.ArgumentTypeError, match="Use NAME=VALUE"):
        runner.name_value("top_k")


def test_json_body_values_get_the_type_the_yaml_declares():
    declared = runner.PARAMETERS
    assert runner.coerce(declared, "grade", 6) == "6"
    assert (
        runner.coerce(declared, "discourse_types", {"major": []})
        == '{"major": []}'
    )
    assert runner.coerce(declared, "top_k", 5) == 5


@pytest.mark.parametrize("var", AZURE_VARS)
def test_connect_names_the_missing_azure_variable(azure_env, monkeypatch, var):
    monkeypatch.delenv(var)
    with pytest.raises(RuntimeError, match=var):
        runner.connect()


def test_main_exits_with_the_missing_variable_message(
    azure_env, monkeypatch, tmp_path
):
    monkeypatch.delenv("AZURE_OPENAI_API_KEY")
    with pytest.raises(SystemExit) as exit_info:
        run_main(monkeypatch, tmp_path, json.dumps(TEMPLATE))
    assert "AZURE_OPENAI_API_KEY" in str(exit_info.value)


def test_main_rejects_a_template_that_is_not_a_workflow(
    azure_env, monkeypatch, tmp_path
):
    with pytest.raises(SystemExit) as exit_info:
        run_main(monkeypatch, tmp_path, "{}")
    assert "is not valid" in str(exit_info.value)


def test_atomic_save_leaves_no_partial_file(azure_env, tmp_path, monkeypatch):
    real = Path.write_text

    def crash(self, data, *a, **kw):
        real(self, data[:5], *a, **kw)
        raise OSError("disk full")

    monkeypatch.setattr(Path, "write_text", crash)
    c = runner.connect(tmp_path)
    with pytest.raises(OSError):
        c.save("plan-1", {"a": 1})
    assert not c.is_done("plan-1")


def test_terminal_status_post_is_retried_then_raised(azure_env, monkeypatch):
    http, sleeps = FailingHttp(), []

    async def no_sleep(seconds):
        sleeps.append(seconds)

    monkeypatch.setenv("WEBHOOK_URL", "http://backend/hook")
    monkeypatch.setattr(runner.httpx, "AsyncClient", lambda **_: http)
    monkeypatch.setattr(runner.asyncio, "sleep", no_sleep)
    post = runner.connect().post_status
    with pytest.raises(httpx.ConnectError):
        asyncio.run(post({"status": "COMPLETED"}))
    assert len(http.urls) == 4
    assert sleeps == [1, 2, 4]


class StatusHttp:
    def __init__(self, codes):
        self.codes, self.urls = list(codes), []

    async def __aenter__(self):
        return self

    async def __aexit__(self, *_):
        return False

    async def post(self, url, json):
        self.urls.append(url)
        return httpx.Response(
            self.codes.pop(0), request=httpx.Request("POST", url)
        )


def post_with(azure_env, monkeypatch, codes):
    http = StatusHttp(codes)

    async def no_sleep(seconds):
        pass

    monkeypatch.setenv("WEBHOOK_URL", "http://backend/hook")
    monkeypatch.setattr(runner.httpx, "AsyncClient", lambda **_: http)
    monkeypatch.setattr(runner.asyncio, "sleep", no_sleep)
    return http, runner.connect().post_status


def test_status_post_does_not_retry_a_client_error(azure_env, monkeypatch):
    http, post = post_with(azure_env, monkeypatch, [400])
    with pytest.raises(httpx.HTTPStatusError):
        asyncio.run(post({"status": "COMPLETED"}))
    assert len(http.urls) == 1


def test_status_post_retries_a_404_until_the_plan_record_exists(
    azure_env, monkeypatch
):
    http, post = post_with(azure_env, monkeypatch, [404, 200])
    asyncio.run(post({"status": "COMPLETED"}))
    assert len(http.urls) == 2


def test_status_post_gives_up_after_four_server_errors(azure_env, monkeypatch):
    http, post = post_with(azure_env, monkeypatch, [500] * 4)
    with pytest.raises(httpx.HTTPStatusError):
        asyncio.run(post({"status": "COMPLETED"}))
    assert len(http.urls) == 4
