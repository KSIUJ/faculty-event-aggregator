from fastapi.testclient import TestClient


def test_get_organizers_empty(client: TestClient):
    res = client.get("/organizers")
    assert res.status_code == 200
    assert res.json() == []


def test_create_organizer_full_payload(client: TestClient):
    payload = {
        "name": "UJ Robotics Club",
        "type": "ORGANIZATION",
        "logo_url": "https://example.com/logo.png",
        "website_url": "https://example.com",
        "description": "Student scientific club",
    }
    res = client.post("/organizers", json=payload)
    assert res.status_code == 201
    data = res.json()
    assert data["id"] == 1
    assert data["name"] == "UJ Robotics Club"
    assert data["type"] == "ORGANIZATION"
    assert data["logo_url"] == "https://example.com/logo.png"
    assert data["website_url"] == "https://example.com"
    assert data["description"] == "Student scientific club"
    assert "created_at" in data


def test_create_organizer_minimal_payload(client: TestClient):
    payload = {
        "name": "Prof. Alan Turing",
        "type": "PERSON",
    }
    res = client.post("/organizers", json=payload)
    assert res.status_code == 201
    data = res.json()
    assert data["name"] == "Prof. Alan Turing"
    assert data["type"] == "PERSON"
    assert data["logo_url"] is None
    assert data["website_url"] is None
    assert data["description"] is None


def test_create_organizer_validation_error(client: TestClient):
    # Missing required 'type'
    res = client.post("/organizers", json={"name": "Incomplete Org"})
    assert res.status_code == 422


def test_get_organizer_by_id(client: TestClient):
    created = client.post("/organizers", json={"name": "ACM Chapter", "type": "ORGANIZATION"}).json()
    org_id = created["id"]

    res = client.get(f"/organizers/{org_id}")
    assert res.status_code == 200
    assert res.json()["name"] == "ACM Chapter"


def test_get_organizer_not_found(client: TestClient):
    res = client.get("/organizers/999")
    assert res.status_code == 404
    assert res.json()["detail"] == "Organizer not found"


def test_patch_organizer(client: TestClient):
    created = client.post("/organizers", json={"name": "Initial Name", "type": "PERSON"}).json()
    org_id = created["id"]

    patch_payload = {
        "name": "Updated Name",
        "description": "Added description",
    }
    res = client.patch(f"/organizers/{org_id}", json=patch_payload)
    assert res.status_code == 200
    data = res.json()
    assert data["name"] == "Updated Name"
    assert data["description"] == "Added description"
    assert data["type"] == "PERSON"


def test_patch_organizer_not_found(client: TestClient):
    res = client.patch("/organizers/999", json={"name": "Ghost"})
    assert res.status_code == 404


def test_delete_organizer(client: TestClient):
    created = client.post("/organizers", json={"name": "To Delete", "type": "ORGANIZATION"}).json()
    org_id = created["id"]

    res = client.delete(f"/organizers/{org_id}")
    assert res.status_code == 204

    # Verify deleted
    res = client.get(f"/organizers/{org_id}")
    assert res.status_code == 404


def test_delete_organizer_not_found(client: TestClient):
    res = client.delete("/organizers/999")
    assert res.status_code == 404
