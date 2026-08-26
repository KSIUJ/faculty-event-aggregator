export interface EventList {
    id: number
    title: string
    description: string | null
    location: string | null
    start_time: string
    end_time: string | null
    created_at: string
    event_category: EventCategory
    topic_categories: TopicCategory[]
    organizer: Organizer
}

export type Event = EventList

export interface EventFilterParams {
    event_category?: number
    topic_category?: number
}

export interface CreateEventPayload {
    title: string
    description?: string
    location?: string
    start_time: string
    end_time?: string
    event_category_id: number
    organizer_id: number
    topic_category_ids: number[]
}
