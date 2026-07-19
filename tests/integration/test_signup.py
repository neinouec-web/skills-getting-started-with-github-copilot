def test_signup_success(client):
    response = client.post(
        "/activities/Basketball Team/signup",
        params={"email": "alice@mergington.edu"},
    )

    assert response.status_code == 200
    assert response.json()["message"] == "Signed up alice@mergington.edu for Basketball Team"


def test_signup_duplicate_email_returns_400(client):
    client.post(
        "/activities/Basketball Team/signup",
        params={"email": "alice@mergington.edu"},
    )

    duplicate_response = client.post(
        "/activities/Basketball Team/signup",
        params={"email": "alice@mergington.edu"},
    )

    assert duplicate_response.status_code == 400
    assert duplicate_response.json()["detail"] == "Student is already signed up"
