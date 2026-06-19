from __future__ import annotations

from pathlib import Path

import pytest
import yaml

from connectors.period_plan.config import PeriodPlanConfig, ApiConfig, OutputsConfig


def test_period_plan_config_from_yaml(tmp_path):
    data = {
        "inputs": {
            "excel": {
                "subject": "social",
                "file_path": str(tmp_path / "sheet.xlsx"),
                "sheet_map": {"9": "grade 9"},
                "grades": ["9"],
            }
        },
        "templates": {"workflow_template_path": str(tmp_path / "workflow.yaml")},
    }
    p = tmp_path / "config.yaml"
    p.write_text(yaml.dump(data), encoding="utf-8")
    cfg = PeriodPlanConfig.from_yaml(p)
    assert cfg.inputs["excel"].subject == "social"
    assert cfg.api.url == "http://localhost:7071/api/v2/lesson-plans"


def test_api_config_defaults():
    cfg = ApiConfig()
    assert cfg.concurrency == 1
    assert cfg.max_poll_retries == 60


def test_outputs_config_defaults():
    cfg = OutputsConfig()
    assert cfg.curated_dirname == "curated"
    assert cfg.run_root == Path("runs/period_plan_generation")


def test_period_plan_config_missing_inputs_raises():
    with pytest.raises(Exception):
        PeriodPlanConfig.model_validate({"templates": {"workflow_template_path": "x.yaml"}})
