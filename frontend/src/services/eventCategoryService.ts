import { eventCategories } from "./mockData/eventCategories";

export async function getAllEventCategories() {
    return eventCategories;
}

export async function getEventCategoryById(id: string) {
    return eventCategories.find(
        (category) => category.id === id
    );
}