def test_remove_participant_success(client):
    response = client.delete(
        "/activities/Chess Club/remove",
        params={"email": "michael@mergington.edu"},
    )

    assert response.status_code == 200
    assert response.json()["message"] == "Removed michael@mergington.edu from Chess Club"
