import { Event, EventCategory, TopicCategory, Organizer } from '../types';

export function addEventDetails(events: Event[], eventCategories: EventCategory[], topicCategories: TopicCategory[], organizers: Organizer[]) {
    return events.map((event) => ({
        ...event,
        eventCategory: eventCategories.find(
            (category) => category.id === event.event_category_id,
        ),
        organizer: organizers.find(
            (organizer) => organizer.id === event.organizer_id,
        ),
        topicCategories: event.topic_category_ids
            .map((topicId) =>
                topicCategories.find((category) => category.id === topicId),
            )
            .filter(Boolean)
    }))
}
    