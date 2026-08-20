import type { Organizer } from '@/types'
import { API_URL } from '@/config'


export async function getAllOrganizers(): Promise<Organizer[]> {
   const response = await fetch(`${API_URL}/organizers`)
   if(!response.ok) {
      throw new Error(`Failed to fetch organizers: ${response.statusText}`)
   }
   const organizers = await response.json()
   return organizers
}

export async function getOrganizerById(id: number): Promise<Organizer | undefined> {
   const response = await fetch(`${API_URL}/organizers/${id}`)
   if(!response.ok) {
      throw new Error(`Failed to fetch organizer with ID ${id}: ${response.statusText}`)
   }
   const organizer = await response.json()
   return organizer
}

