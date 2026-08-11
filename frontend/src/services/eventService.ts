import type { EventList, Event } from '@/types'
import { events, eventList } from "@/services/mockData/events"


export async function getAllEvents(): Promise<EventList> {
    return eventList
}

export async function getEventById(id: number): Promise<Event | undefined> {
    return events.find(
        (event: Event) => event.id === id
    )
}