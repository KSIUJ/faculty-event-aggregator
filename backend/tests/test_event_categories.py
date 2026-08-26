from fastapi.testclient import TestClient


def test_get_event_categories_empty(client: TestClient):
    res = client.get("/event-categories")
    assert res.status_code == 200
    assert res.json() == []


def test_create_event_category(client: TestClient):
    payload = {"title": "Workshop", "icon_name": "tools"}
    res = client.post("/event-categories", json=payload)
    assert res.status_code == 201
    data = res.json()
    assert data["id"] == 1
    assert data["title"] == "Workshop"
    assert data["icon_name"] == "tools"
    assert "created_at" in data


def test_create_event_category_without_icon(client: TestClient):
    payload = {"title": "Lecture"}
    res = client.post("/event-categories", json=payload)
    assert res.status_code == 201
    data = res.json()
    assert data["title"] == "Lecture"
    assert data["icon_name"] is None


def test_create_event_category_validation_error(client: TestClient):
    # Missing required 'title'
    res = client.post("/event-categories", json={"icon_name": "tools"})
    assert res.status_code == 422


def test_create_event_category_rejects_unknown_title(client: TestClient):
    res = client.post("/event-categories", json={"title": "Meetup"})
    assert res.status_code == 422


def test_get_event_category_by_id(client: TestClient):
    created = client.post("/event-categories", json={"title": "Conference"}).json()
    cat_id = created["id"]

    res = client.get(f"/event-categories/{cat_id}")
    assert res.status_code == 200
    assert res.json()["title"] == "Conference"


def test_get_event_category_not_found(client: TestClient):
    res = client.get("/event-categories/999")
    assert res.status_code == 404
    assert res.json()["detail"] == "Event category not found"


def test_patch_event_category(client: TestClient):
    created = client.post("/event-categories", json={"title": "Lecture", "icon_name": "old_icon"}).json()
    cat_id = created["id"]

    res = client.patch(f"/event-categories/{cat_id}", json={"title": "Seminar"})
    assert res.status_code == 200
    data = res.json()
    assert data["title"] == "Seminar"
    assert data["icon_name"] == "old_icon"


def test_patch_event_category_not_found(client: TestClient):
    res = client.patch("/event-categories/999", json={"title": "Conference"})
    assert res.status_code == 404


def test_delete_event_category(client: TestClient):
    created = client.post("/event-categories", json={"title": "Networking"}).json()
    cat_id = created["id"]

    res = client.delete(f"/event-categories/{cat_id}")
    assert res.status_code == 204

    # Verify subsequent lookup is 404
    res = client.get(f"/event-categories/{cat_id}")
    assert res.status_code == 404


def test_delete_event_category_not_found(client: TestClient):
    res = client.delete("/event-categories/999")
    assert res.status_code == 404
