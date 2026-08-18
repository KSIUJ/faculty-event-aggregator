import { useEffect, useState } from 'react'
import { getAllEvents } from '@/services'
import type { EventList } from '@/types'

import RenderEvent from '@/components/RenderEvent'

export default function DisplayPage() {
    const [events, setEvents] = useState<EventList | null>(null)
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

    return (
        <main>
            <h1>Available event</h1>
            <RenderEvent event={events} />
        </main>
    )
}
