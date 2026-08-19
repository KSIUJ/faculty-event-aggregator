export interface EventList {
    id: number
    title: string
    location: string | null
    start_time: string
    end_time: string | null
    created_at: string
    event_category: EventCategory
    topic_categories: TopicCategory[]
    organizer: Organizer
}

export interface Event extends EventList {
    description: string | null
}

export interface EventFilterParams {
    event_category?: number
    topic_category?: number
}