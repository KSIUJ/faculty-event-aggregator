import {
    EVENT_CARD_COLORS,
    EVENT_CATEGORY_CARD_COLORS,
    MAX_VISIBLE_EVENT_TOPICS,
    type EventCardColor,
} from '@/config'
import type { EventList } from '@/types'
import { getEventCategoryKey, localizeEventCategory } from '@/utils/eventCategories'
import { formatEventDate, formatEventDuration, formatEventTime } from '@/utils/eventFormatters'

function getCardColor(event: EventList): EventCardColor {
    const categoryKey = getEventCategoryKey(event.event_category.title)

    return (
        categoryKey ? EVENT_CATEGORY_CARD_COLORS[categoryKey] : undefined)
        ?? EVENT_CARD_COLORS[(event.event_category.id - 1) % EVENT_CARD_COLORS.length]
}

interface EventCardProps {
    event: EventList
    onOpen: (event: EventList) => void
}

export default function EventCard({ event, onOpen }: EventCardProps) {
    return (
        <article
            className={`event-card event-card--${getCardColor(event)}`}
            role="button"
            tabIndex={0}
            aria-label={`Wyświetl szczegóły wydarzenia: ${event.title}`}
            onClick={() => onOpen(event)}
            onKeyDown={(keyboardEvent) => {
                if (keyboardEvent.key === 'Enter' || keyboardEvent.key === ' ') {
                    keyboardEvent.preventDefault()
                    onOpen(event)
                }
            }}
        >
            <div className="event-card__time">
                <strong>{formatEventTime(event.start_time)}</strong>
                <span>{formatEventDuration(event)}</span>
            </div>
            <div className="event-card__content">
                <div className="event-card__date">{formatEventDate(event.start_time)}</div>
                <h3>{event.title}</h3>
                <p>{event.location ?? 'Miejsce zostanie podane'} · {event.organizer.name}</p>
            </div>
            <div className="tag-list event-card__tags" aria-label="Kategorie wydarzenia">
                <span className="tag tag--category">{localizeEventCategory(event.event_category.title)}</span>
                {event.topic_categories.slice(0, MAX_VISIBLE_EVENT_TOPICS).map((topic) => <span className="tag tag--topic" key={topic.id}>{topic.title}</span>)}
            </div>
            <span className="event-card__arrow" aria-hidden="true">
                →
            </span>
        </article>
    )
}
