import { useEffect, useState } from 'react'
import { getAllEventCategories, getAllEvents, getAllOrganizers, getAllTopicCategories } from '../services/index'
import { addEventDetails } from '../util/eventData'
import RenderEvent from '../components/RenderEvent'
import { Event } from '../types';


export default function DisplayPage() {
    const [events, setEvents] = useState<Event[] | null>(null)
    const [error, setError] = useState(false)

    useEffect(() => {
        async function loadEvents() {
            try {
                const data = await Promise.all([
                    getAllEvents(),
                    getAllEventCategories(),
                    getAllTopicCategories(),
                    getAllOrganizers(),
                ])

                setEvents(addEventDetails(...data) as Event[])
            } catch {
                setError(true)
            }
        }

        loadEvents()
    }, [])

    if (error) return <p>Events could not be loaded.</p>
    if (!events) return <p>Loading events...</p>

    return (
        <main>
            <h1>Available events</h1>

            {events.length === 0 ? (
                <p>No events are available.</p>
            ) : (
                <ul>
                    {events.map((event) => (
                        <li key={event.id}>
                            <RenderEvent event={event} />
                        </li>
                    ))}
                </ul>
            )}
        </main>
    )
}
