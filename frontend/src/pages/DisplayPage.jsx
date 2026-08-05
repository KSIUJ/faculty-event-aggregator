import { useEffect, useState } from 'react'
import { getAllEventCategories, getAllEvents, getAllOrganizers, getAllTopicCategories } from '../services/index.js'
import { addEventDetails } from '../util/eventData.js'
import RenderEvent from '../components/RenderEvent.jsx'



export default function DisplayPage() {
    const [events, setEvents] = useState(null)
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

                setEvents(addEventDetails(...data))
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
