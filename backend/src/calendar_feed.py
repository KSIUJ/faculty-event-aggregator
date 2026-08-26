from collections.abc import Iterable
from datetime import datetime, timedelta, timezone

from models import Event


def _as_utc(value: datetime) -> datetime:
    if value.tzinfo is None:
        return value.replace(tzinfo=timezone.utc)
    return value.astimezone(timezone.utc)


def _ical_datetime(value: datetime) -> str:
    return _as_utc(value).strftime("%Y%m%dT%H%M%SZ")


def _escape_text(value: str) -> str:
    return (
        value.replace("\\", "\\\\")
        .replace("\r\n", "\\n")
        .replace("\n", "\\n")
        .replace("\r", "\\n")
        .replace(";", "\\;")
        .replace(",", "\\,")
    )


def _fold_line(line: str) -> str:
    """Fold iCalendar lines to a maximum of 75 UTF-8 octets."""
    parts: list[str] = []
    current = ""

    for character in line:
        candidate = f"{current}{character}"
        if current and len(candidate.encode("utf-8")) > 75:
            parts.append(current)
            current = f" {character}"
        else:
            current = candidate

    parts.append(current)
    return "\r\n".join(parts)


def _event_lines(event: Event) -> list[str]:
    start_time = _as_utc(event.start_time)
    end_time = _as_utc(event.end_time) if event.end_time else start_time + timedelta(hours=1)
    created_at = _as_utc(event.created_at) if event.created_at else start_time
    categories = [event.event_category.title]
    categories.extend(topic.title for topic in event.topic_categories)

    lines = [
        "BEGIN:VEVENT",
        f"UID:event-{event.id}@faculty-event-aggregator",
        f"DTSTAMP:{_ical_datetime(created_at)}",
        f"DTSTART:{_ical_datetime(start_time)}",
        f"DTEND:{_ical_datetime(end_time)}",
        f"SUMMARY:{_escape_text(event.title)}",
    ]

    if event.description:
        lines.append(f"DESCRIPTION:{_escape_text(event.description)}")
    if event.location:
        lines.append(f"LOCATION:{_escape_text(event.location)}")
    if categories:
        lines.append(f"CATEGORIES:{','.join(_escape_text(category) for category in categories)}")

    lines.extend(("STATUS:CONFIRMED", "TRANSP:OPAQUE", "END:VEVENT"))
    return lines


def build_calendar(events: Iterable[Event], name: str = "Wydział // Wydarzenia") -> str:
    lines = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        "PRODID:-//KSI UJ//Faculty Event Aggregator//PL",
        f"X-WR-CALNAME:{_escape_text(name)}",
    ]

    for event in sorted(events, key=lambda item: _as_utc(item.start_time)):
        lines.extend(_event_lines(event))

    lines.append("END:VCALENDAR")
    return "\r\n".join(_fold_line(line) for line in lines) + "\r\n"
