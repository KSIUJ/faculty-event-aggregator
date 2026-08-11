import { events } from "./mockData/events";

export async function getAllEvents() {
    return events;
}

export async function getEventById(id: string) {
    return events.find((event) => event.id === id);
}