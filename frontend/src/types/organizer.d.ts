export type OrganizerType =
    | "PERSON"
    | "ORGANIZATION"

export interface Organizer {
    id: number
    name: string
    type: OrganizerType
    logo_url?: string
    website_url?: string
    description?: string
    created_at: string
}
