export interface EventList {
    id: number
    title: string
    location: string | null
    start_time: string
    end_time: string | null
    created_at: string
    event_category: EventCategory
    organizer: Organizer
    topic_category: TopicCategory
}

export interface Event extends EventList {
    description: string | null
}