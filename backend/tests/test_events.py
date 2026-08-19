from fastapi.testclient import TestClient


def test_get_events_empty(client: TestClient):
    res = client.get("/events")
    assert res.status_code == 200
    assert res.json() == []


def test_create_event_success_and_read(client: TestClient):
    cat = client.post("/event-categories", json={"title": "Conference", "icon_name": "mic"}).json()
    org = client.post("/organizers", json={"name": "UJ Faculty", "type": "ORGANIZATION"}).json()
    t1 = client.post("/topic-categories", json={"title": "Data Science"}).json()
    t2 = client.post("/topic-categories", json={"title": "AI"}).json()

    event_payload = {
        "title": "UJ Tech Summit",
        "description": "Annual technological summit",
        "location": "Auditorium Maximum",
        "start_time": "2026-10-15T10:00:00Z",
        "end_time": "2026-10-15T18:00:00Z",
        "event_category_id": cat["id"],
        "organizer_id": org["id"],
        "topic_category_ids": [t1["id"], t2["id"]],
    }

    res = client.post("/events", json=event_payload)
    assert res.status_code == 201
    event_data = res.json()
    event_id = event_data["id"]

    assert event_data["title"] == "UJ Tech Summit"
    assert event_data["description"] == "Annual technological summit"
    assert event_data["location"] == "Auditorium Maximum"
    assert event_data["event_category"]["id"] == cat["id"]
    assert event_data["organizer"]["id"] == org["id"]
    assert len(event_data["topic_categories"]) == 2

    # GET /events (compact list)
    list_res = client.get("/events")
    assert list_res.status_code == 200
    events = list_res.json()
    assert len(events) == 1
    assert events[0]["id"] == event_id

    # GET /events/{id} (full detail)
    detail_res = client.get(f"/events/{event_id}")
    assert detail_res.status_code == 200
    assert detail_res.json()["description"] == "Annual technological summit"


def test_create_event_minimal(client: TestClient):
    cat = client.post("/event-categories", json={"title": "Meetup"}).json()
    org = client.post("/organizers", json={"name": "John Doe", "type": "PERSON"}).json()
    top = client.post("/topic-categories", json={"title": "Python"}).json()

    event_payload = {
        "title": "Python Lightning Talks",
        "start_time": "2026-11-01T18:00:00Z",
        "event_category_id": cat["id"],
        "organizer_id": org["id"],
        "topic_category_ids": [top["id"]],
    }

    res = client.post("/events", json=event_payload)
    assert res.status_code == 201
    data = res.json()
    assert data["title"] == "Python Lightning Talks"
    assert data["location"] is None
    assert data["end_time"] is None
    assert data["description"] is None


def test_create_event_foreign_key_validations(client: TestClient):
    cat = client.post("/event-categories", json={"title": "Workshop"}).json()
    org = client.post("/organizers", json={"name": "Club", "type": "ORGANIZATION"}).json()
    top = client.post("/topic-categories", json={"title": "Security"}).json()

    base_payload = {
        "title": "Security Workshop",
        "start_time": "2026-11-01T10:00:00Z",
        "event_category_id": cat["id"],
        "organizer_id": org["id"],
        "topic_category_ids": [top["id"]],
    }

    # 1. Invalid event_category_id -> 404
    payload = {**base_payload, "event_category_id": 9999}
    res = client.post("/events", json=payload)
    assert res.status_code == 404
    assert "EventCategory with id 9999 not found" in res.json()["detail"]

    # 2. Invalid organizer_id -> 404
    payload = {**base_payload, "organizer_id": 9999}
    res = client.post("/events", json=payload)
    assert res.status_code == 404
    assert "Organizer with id 9999 not found" in res.json()["detail"]

    # 3. Invalid topic_category_ids -> 404
    payload = {**base_payload, "topic_category_ids": [top["id"], 9999]}
    res = client.post("/events", json=payload)
    assert res.status_code == 404
    assert "TopicCategory with ids [9999] not found" in res.json()["detail"]


def test_create_event_time_range_validation(client: TestClient):
    cat = client.post("/event-categories", json={"title": "Webinar"}).json()
    org = client.post("/organizers", json={"name": "Org", "type": "ORGANIZATION"}).json()
    top = client.post("/topic-categories", json={"title": "Cloud"}).json()

    payload = {
        "title": "Time Traveler Event",
        "start_time": "2026-11-01T14:00:00Z",
        "end_time": "2026-11-01T12:00:00Z",  # end earlier than start
        "event_category_id": cat["id"],
        "organizer_id": org["id"],
        "topic_category_ids": [top["id"]],
    }

    res = client.post("/events", json=payload)
    assert res.status_code == 422
    assert "end_time cannot be earlier than start_time" in res.json()["detail"]


def test_get_event_not_found(client: TestClient):
    res = client.get("/events/999")
    assert res.status_code == 404
    assert res.json()["detail"] == "Event not found"


def test_patch_event_and_associations(client: TestClient):
    cat1 = client.post("/event-categories", json={"title": "Category 1"}).json()
    cat2 = client.post("/event-categories", json={"title": "Category 2"}).json()
    org1 = client.post("/organizers", json={"name": "Org 1", "type": "ORGANIZATION"}).json()
    org2 = client.post("/organizers", json={"name": "Org 2", "type": "ORGANIZATION"}).json()
    top1 = client.post("/topic-categories", json={"title": "Topic 1"}).json()
    top2 = client.post("/topic-categories", json={"title": "Topic 2"}).json()

    created = client.post("/events", json={
        "title": "Initial Event",
        "start_time": "2026-12-01T10:00:00Z",
        "end_time": "2026-12-01T12:00:00Z",
        "event_category_id": cat1["id"],
        "organizer_id": org1["id"],
        "topic_category_ids": [top1["id"]],
    }).json()
    event_id = created["id"]

    # Patch title, category, organizer, and topics
    patch_payload = {
        "title": "Updated Event Title",
        "event_category_id": cat2["id"],
        "organizer_id": org2["id"],
        "topic_category_ids": [top2["id"]],
    }
    res = client.patch(f"/events/{event_id}", json=patch_payload)
    assert res.status_code == 200
    data = res.json()
    assert data["title"] == "Updated Event Title"
    assert data["event_category"]["id"] == cat2["id"]
    assert data["organizer"]["id"] == org2["id"]
    assert len(data["topic_categories"]) == 1
    assert data["topic_categories"][0]["id"] == top2["id"]


def test_patch_event_not_found(client: TestClient):
    res = client.patch("/events/999", json={"title": "Ghost"})
    assert res.status_code == 404


def test_patch_event_invalid_foreign_key(client: TestClient):
    cat = client.post("/event-categories", json={"title": "Cat"}).json()
    org = client.post("/organizers", json={"name": "Org", "type": "ORGANIZATION"}).json()
    top = client.post("/topic-categories", json={"title": "Top"}).json()

    created = client.post("/events", json={
        "title": "Event",
        "start_time": "2026-12-01T10:00:00Z",
        "event_category_id": cat["id"],
        "organizer_id": org["id"],
        "topic_category_ids": [top["id"]],
    }).json()

    res = client.patch(f"/events/{created['id']}", json={"event_category_id": 9999})
    assert res.status_code == 404


def test_patch_event_invalid_time_range(client: TestClient):
    cat = client.post("/event-categories", json={"title": "Cat"}).json()
    org = client.post("/organizers", json={"name": "Org", "type": "ORGANIZATION"}).json()
    top = client.post("/topic-categories", json={"title": "Top"}).json()

    created = client.post("/events", json={
        "title": "Event",
        "start_time": "2026-12-01T10:00:00Z",
        "end_time": "2026-12-01T12:00:00Z",
        "event_category_id": cat["id"],
        "organizer_id": org["id"],
        "topic_category_ids": [top["id"]],
    }).json()

    # Invalid end_time earlier than start_time
    res = client.patch(f"/events/{created['id']}", json={"end_time": "2026-12-01T09:00:00Z"})
    assert res.status_code == 422


def test_delete_event(client: TestClient):
    cat = client.post("/event-categories", json={"title": "Cat"}).json()
    org = client.post("/organizers", json={"name": "Org", "type": "ORGANIZATION"}).json()
    top = client.post("/topic-categories", json={"title": "Top"}).json()

    created = client.post("/events", json={
        "title": "Event to Delete",
        "start_time": "2026-12-01T10:00:00Z",
        "event_category_id": cat["id"],
        "organizer_id": org["id"],
        "topic_category_ids": [top["id"]],
    }).json()
    event_id = created["id"]

    res = client.delete(f"/events/{event_id}")
    assert res.status_code == 204

    # Verify deleted
    res = client.get(f"/events/{event_id}")
    assert res.status_code == 404


def test_delete_event_not_found(client: TestClient):
    res = client.delete("/events/999")
    assert res.status_code == 404
