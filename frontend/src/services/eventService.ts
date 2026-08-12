import type { EventList, Event } from '@/types'


const API_URL = "http://localhost:8000"
export async function getAllEvents(): Promise<EventList> {

const response = await fetch(`${API_URL}/events`)
if (!response.ok) {
    throw new Error(`Failed to fetch event: ${response.statusText}`)
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