import type { EventList, Event, EventFilterParams } from '@/types'
import { API_URL } from '@/config'

export async function getAllEvents(params?: EventFilterParams): Promise<EventList[]> {
    const query = new URLSearchParams()
    if (params?.event_category !== undefined) {
        query.set('event_category', params.event_category.toString())
    }
    if (params?.topic_category !== undefined) {
        query.set('topic_category', params.topic_category.toString())
    }
  
    const queryString = query.toString() ? `?${query.toString()}` : ''
    const response = await fetch(`${API_URL}/events${queryString}`)
    if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.statusText}`)
    }
    const events = await response.json()
    return events
}

export async function getEventById(id: number): Promise<Event | undefined> {
    const response = await fetch(`${API_URL}/events/${id}`)
    if (!response.ok) {
        throw new Error(`Failed to fetch event with ID ${id}: ${response.statusText}`)
    }
    const event = await response.json()
    return event
}