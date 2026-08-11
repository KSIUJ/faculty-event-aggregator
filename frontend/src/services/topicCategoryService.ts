import { TopicCategory } from '@/types'
import { topicCategories } from "@/services/mockData/topicCategories"


export async function getAllTopicCategories(): Promise<TopicCategory[]> {
    return topicCategories
}

export async function getTopicCategoryById(id: number): Promise<TopicCategory | undefined> {
    return topicCategories.find(
        (category) => category.id === id
    )
}