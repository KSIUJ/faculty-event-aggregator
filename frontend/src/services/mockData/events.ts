import { Event, EventList } from '@/types'

import { eventCategories } from './eventCategories'
import { topicCategories } from './topicCategories'
import { organizers } from './organizers'

export const events: Event[] = [
    {
        id: 1,
        title: "Introduction to React",
        description: "Learn the basics of React development.",
        location: "Siedziba KSI UJ",

        start_time: "2026-08-10T10:00:00Z",
        end_time: "2026-08-10T14:00:00Z",
        created_at: "2026-07-01T10:00:00Z",
        event_category: eventCategories[0],
        topic_categories: topicCategories,
        organizer: organizers[0]
    },
    {
        id: 2,
        title: "AI Workshop",
        description: "Hands-on workshop about artificial intelligence.",
        location: "Online",

        start_time: "2026-09-01T09:00:00Z",
        end_time: "2026-09-01T12:00:00Z",
        created_at: "2026-07-05T10:00:00Z",
        event_category: eventCategories[1],
        topic_categories: topicCategories,
        organizer: organizers[0]
    }
]

export const eventList: EventList = {
    id: 1,
    title: "Introduction to React",
    location: "Siedziba KSI UJ",
    start_time: "2026-08-10T10:00:00Z",
    end_time: "2026-08-10T14:00:00Z",
    created_at: "2026-07-01T10:00:00Z",
    event_category: eventCategories[0],
    topic_categories: topicCategories,
    organizer: organizers[0]
}
