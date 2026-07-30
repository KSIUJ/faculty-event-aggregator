import { eventCategories } from "./mockData/eventCategories";

export async function getAllEventCategories() {
    return eventCategories;
}

export async function getEventCategoryById(id) {
    return eventCategories.find(
        (category) => category.id === id
    );
}