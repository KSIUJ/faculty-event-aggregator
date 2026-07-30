import { organizers } from "./mockData/organizers";

export async function getAllOrganizers() {
    return organizers;
}

export async function getOrganizerById(id) {
    return organizers.find(
        (organizer) => organizer.id === id
    );
}