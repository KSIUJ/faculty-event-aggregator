from fastapi.testclient import TestClient


def test_get_topic_categories_empty(client: TestClient):
    res = client.get("/topic-categories")
    assert res.status_code == 200
    assert res.json() == []


def test_create_topic_category(client: TestClient):
    payload = {"title": "Machine Learning", "icon_name": "brain"}
    res = client.post("/topic-categories", json=payload)
    assert res.status_code == 201
    data = res.json()
    assert data["id"] == 1
    assert data["title"] == "Machine Learning"
    assert data["icon_name"] == "brain"
    assert "created_at" in data


def test_create_topic_category_without_icon(client: TestClient):
    payload = {"title": "Cloud Computing"}
    res = client.post("/topic-categories", json=payload)
    assert res.status_code == 201
    data = res.json()
    assert data["title"] == "Cloud Computing"
    assert data["icon_name"] is None


def test_create_topic_category_validation_error(client: TestClient):
    # Missing required 'title'
    res = client.post("/topic-categories", json={"icon_name": "cloud"})
    assert res.status_code == 422


def test_get_topic_category_by_id(client: TestClient):
    created = client.post("/topic-categories", json={"title": "DevOps"}).json()
    topic_id = created["id"]

    res = client.get(f"/topic-categories/{topic_id}")
    assert res.status_code == 200
    assert res.json()["title"] == "DevOps"


def test_get_topic_category_not_found(client: TestClient):
    res = client.get("/topic-categories/999")
    assert res.status_code == 404
    assert res.json()["detail"] == "Topic category not found"


def test_patch_topic_category(client: TestClient):
    created = client.post("/topic-categories", json={"title": "Web Dev", "icon_name": "browser"}).json()
    topic_id = created["id"]

    res = client.patch(f"/topic-categories/{topic_id}", json={"title": "Frontend & Backend Dev"})
    assert res.status_code == 200
    data = res.json()
    assert data["title"] == "Frontend & Backend Dev"
    assert data["icon_name"] == "browser"


def test_patch_topic_category_not_found(client: TestClient):
    res = client.patch("/topic-categories/999", json={"title": "Ghost"})
    assert res.status_code == 404


def test_delete_topic_category(client: TestClient):
    created = client.post("/topic-categories", json={"title": "To Delete"}).json()
    topic_id = created["id"]

    res = client.delete(f"/topic-categories/{topic_id}")
    assert res.status_code == 204

    # Verify deleted
    res = client.get(f"/topic-categories/{topic_id}")
    assert res.status_code == 404


def test_delete_topic_category_not_found(client: TestClient):
    res = client.delete("/topic-categories/999")
    assert res.status_code == 404
