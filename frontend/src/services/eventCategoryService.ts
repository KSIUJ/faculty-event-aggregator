import type { EventCategory } from '@/types/eventCategory'
import { eventCategories } from "@/services/mockData/eventCategories"


export async function getAllEventCategories(): Promise<EventCategory[]> {
    return eventCategories
}

export async function getEventCategoryById(id: number): Promise<EventCategory | undefined> {
    return eventCategories.find(
        (category) => category.id === id
    )
}