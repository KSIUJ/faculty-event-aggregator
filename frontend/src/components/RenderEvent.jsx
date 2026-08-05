import RenderTopic from './RenderTopic.jsx'

export default function RenderEvent({ event }) {
    return (
        <article>
            <h2>{event.title}</h2>
            <p>{event.description}</p>
            <p>
                <strong>Date:</strong>{' '}
                <time dateTime={event.start_time}>
                    {new Date(event.start_time).toLocaleString()}
                </time>
            </p>
            <p>
                <strong>Location:</strong> {event.location ?? 'Not specified'}
            </p>
            <p>
                <strong>Category:</strong>{' '}
                {event.eventCategory?.title ?? 'Not specified'}
            </p>
            <p><strong>Topics:</strong></p>
            {event.topicCategories.length === 0 ? (
                <p>Not specified</p>
            ) : (
                <ul>
                    {event.topicCategories.map((topic) => (
                        <li key={topic.id}>
                            <RenderTopic topic={topic} />
                        </li>
                    ))}
                </ul>
            )}
            <p>
                <strong>Organizer:</strong>{' '}
                {event.organizer?.name ?? 'Not specified'}
            </p>
        </article>
    )
}
