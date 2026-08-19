import { useEffect, useState } from 'react'
import { getAllEvents } from '@/services'
import type { EventList } from '@/types'

import RenderEvent from '@/components/RenderEvent'

export default function DisplayPage() {
    const [events, setEvents] = useState<EventList[] | null>(null)
    const [error, setError] = useState(false)

    useEffect(() => {
        async function loadEvents() {
            try {
                const eventList = await getAllEvents()
                setEvents(eventList)
            } catch {
                setError(true)
            }
        }

        loadEvents()
    }, [])

    if (error) return <p>Events could not be loaded.</p>
    if (!events) return <p>Loading events...</p>
    if (events.length === 0) return <p>No events available.</p>

    return (
        <main>
            <h1>Available events</h1>
            {events.map((event) => (
                <RenderEvent key={event.id} event={event} />
            ))}
        </main>
    )
}
