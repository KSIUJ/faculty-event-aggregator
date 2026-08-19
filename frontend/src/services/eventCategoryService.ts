import type { EventCategory } from '@/types/eventCategory'
import { API_URL } from '@/config'


export async function getAllEventCategories(): Promise<EventCategory[]> {
    const response = await fetch(`${API_URL}/event-categories`)
    if (!response.ok) {
        throw new Error(`Failed to fetch event categories: ${response.statusText}`)
    }
    const eventCategories = await response.json()
    return eventCategories
}  

export async function getEventCategoryById(id: number): Promise<EventCategory | undefined> {
    const response = await fetch(`${API_URL}/event-categories/${id}`)
    if (!response.ok) {
        throw new Error(`Failed to fetch event category: ${response.statusText}`)
    }
    const eventCategory = await response.json()
    return eventCategory
}