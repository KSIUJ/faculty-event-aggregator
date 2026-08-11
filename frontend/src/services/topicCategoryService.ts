import { topicCategories } from "./mockData/topicCategories";

export async function getAllTopicCategories() {
    return topicCategories;
}

export async function getTopicCategoryById(id) {
    return topicCategories.find(
        (category) => category.id === id
    );
}