export interface TopicCategory {
    id: string
    title: string
    icon_name: string
    created_at: string
}
export interface EventCategory {
    id: string
    title: string
    icon_name: string
    created_at: string
}
export interface Organizer {
   id: string;
   name: string;
   type: string;
   logo_url: string;
   website_url: string;
   description: string;
   created_at: string;
}
export interface Event {
    id: string
    title:  string
    description: string
    location: string
    start_time: string
    end_time: string
    topic_category_ids: string[]
    event_category_id: string
    organizer_id: string
    created_at: string
}