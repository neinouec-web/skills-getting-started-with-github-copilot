from fastapi.testclient import TestClient

from src.app import app


def test_remove_participant_from_activity():
    client = TestClient(app)

    response = client.delete(
        "/activities/Chess Club/remove",
        params={"email": "michael@mergington.edu"},
    )

    assert response.status_code == 200
    assert response.json()["message"] == "Removed michael@mergington.edu from Chess Club"
