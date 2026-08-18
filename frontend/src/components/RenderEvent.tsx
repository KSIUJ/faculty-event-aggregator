import type { EventList } from '@/types'
import RenderTopic from './RenderTopic'

interface EventItemProps {
    event: EventList
}

export default function EventItem({ event }: EventItemProps) {
    return (
        <article>
            <h2>{event.title}</h2>
            <p>{event.location ?? 'Location not specified'}</p>
            <p>Category: {event.event_category.title}</p>
            <p>Organizer: {event.organizer.name}</p>
            <p>Topics:</p>
            <RenderTopic topics={event.topic_categories} />
        </article>
    )
}
