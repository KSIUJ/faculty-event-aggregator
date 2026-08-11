import type { Organizer } from '@/types'
import { organizers } from "@/services/mockData/organizers"


export async function getAllOrganizers(): Promise<Organizer[]> {
    return organizers
}

export async function getOrganizerById(id: number): Promise<Organizer | undefined> {
    return organizers.find(
        (organizer) => organizer.id === id
    )
}