"""
OptiCropAI 2.0 - Backend Test Suite
Automated integration and unit tests for API endpoints, validators, ML, agent, and Tool Gateway.
"""
import pytest
import json
from backend.app import create_app
from backend.app.config import Config

class TestConfig(Config):
    TESTING = True
    DEBUG = False

@pytest.fixture
def client():
    app = create_app(TestConfig)
    with app.test_client() as client:
        yield client

def test_health_check(client):
    """Verifies system diagnostics, ML status, and tool gateway registry."""
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.get_json()
    assert data["status"] == "healthy"
    assert data["ml_engine"]["status"] == "ready"
    assert data["tool_gateway"]["status"] == "active"
    assert "basic_information" in data["tool_gateway"]["tools"]

def test_recommendation_valid_payload(client):
    """Verifies end-to-end recommendation, explainability, soil health, and risks."""
    payload = {
        "features": {
            "N": 90,
            "P": 42,
            "K": 43,
            "temperature": 20.8,
            "humidity": 82.0,
            "ph": 6.5,
            "rainfall": 202.9
        },
        "field_meta": {
            "field_name": "Test Field Delta",
            "state": "Punjab",
            "district": "Ludhiana"
        },
        "save_to_history": True
    }
    res = client.post("/api/recommend", json=payload)
    assert res.status_code == 200
    data = res.get_json()
    assert data["status"] == "success"
    assert data["recommendation"]["recommended_crop"] == "rice"
    assert data["recommendation"]["confidence"] is not None
    assert "soil_health" in data["recommendation"]
    assert "risks" in data["recommendation"]
    assert "action_plan" in data["recommendation"]
    assert "analysis_id" in data

def test_recommendation_invalid_input(client):
    """Verifies biological range validation rejection."""
    payload = {
        "features": {
            "N": 999,  # Unrealistic biological value (>200)
            "P": 42,
            "K": 43,
            "temperature": 20.8,
            "humidity": 82.0,
            "ph": 15.0, # Impossible pH (>14)
            "rainfall": 202.9
        }
    }
    res = client.post("/api/recommend", json=payload)
    assert res.status_code == 422
    data = res.get_json()
    assert "error" in data
    assert len(data["details"]) >= 2

def test_recommendation_missing_parameter(client):
    """Verifies missing parameter detection."""
    payload = {
        "features": {
            "N": 50,
            "P": 50
            # Missing K, temp, humidity, ph, rainfall
        }
    }
    res = client.post("/api/recommend", json=payload)
    assert res.status_code == 422
    data = res.get_json()
    assert "error" in data

def test_tool_gateway_endpoints(client):
    """Verifies tool discovery, schema inspection, and execution."""
    # List tools
    res = client.get("/api/tools")
    assert res.status_code == 200
    tools_data = res.get_json()
    assert tools_data["count"] >= 3

    # Inspect specific tool
    res_info = client.get("/api/tools/basic_information")
    assert res_info.status_code == 200
    info_data = res_info.get_json()
    assert info_data["name"] == "basic_information"
    assert "topic" in info_data["input_schema"]["properties"]

    # Execute basic_information tool via gateway
    exec_payload = {
        "tool": "basic_information",
        "arguments": {"topic": "nitrogen"}
    }
    res_exec = client.post("/api/tools/execute", json=exec_payload)
    assert res_exec.status_code == 200
    exec_data = res_exec.get_json()
    assert exec_data["success"] is True
    assert exec_data["data"]["topic"] == "nitrogen"
    assert "optimal_soil_range" in exec_data["data"]["content"]

    # Execute with invalid arguments
    bad_exec = client.post("/api/tools/execute", json={"tool": "basic_information", "arguments": {}})
    assert bad_exec.status_code == 422

def test_history_and_reports(client):
    """Tests saving analysis, listing history, viewing detail, generating PDF, and deletion."""
    # Create an analysis to ensure history has at least 1 record
    rec_res = client.post("/api/recommend", json={
        "features": {"N": 50, "P": 50, "K": 50, "temperature": 25, "humidity": 70, "ph": 6.8, "rainfall": 100},
        "field_meta": {"field_name": "Plot 101"},
        "save_to_history": True
    })
    rec_data = rec_res.get_json()
    analysis_id = rec_data["analysis_id"]

    # Check stats
    stats_res = client.get("/api/history/stats")
    assert stats_res.status_code == 200
    stats = stats_res.get_json()
    assert stats["total_analyses"] >= 1
    assert stats["has_data"] is True

    # List history
    hist_res = client.get("/api/history")
    assert hist_res.status_code == 200
    hist_data = hist_res.get_json()
    assert hist_data["count"] >= 1

    # Get single history detail
    detail_res = client.get(f"/api/history/{analysis_id}")
    assert detail_res.status_code == 200
    detail = detail_res.get_json()
    assert detail["id"] == analysis_id
    assert "full_analysis" in detail

    # Generate PDF report
    pdf_res = client.post("/api/report", json={"analysis_id": analysis_id})
    assert pdf_res.status_code == 200
    assert pdf_res.content_type == "application/pdf"
    assert len(pdf_res.data) > 1000

    # Delete record
    del_res = client.delete(f"/api/history/{analysis_id}")
    assert del_res.status_code == 200
    del_data = del_res.get_json()
    assert del_data["success"] is True

    # Verify deleted
    verify_del = client.get(f"/api/history/{analysis_id}")
    assert verify_del.status_code == 404
