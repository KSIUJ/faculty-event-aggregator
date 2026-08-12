import { TopicCategory } from '@/types'


const API_URL = "http://localhost:8000"
export async function getAllTopicCategories(): Promise<TopicCategory[]> {
    const response = await fetch(`${API_URL}/topic-categories`)
    if(!response.ok){
        throw new Error(`Failed to fetch topic categories: ${response.statusText}`)
    }
    const topicCategories = await response.json()
    return topicCategories
}

export async function getTopicCategoryById(id: number): Promise<TopicCategory | undefined> {
    const response = await fetch(`${API_URL}/topic-categories/${id}`)
    if(!response.ok){
        throw new Error(`Failed to fetch topic category with ID ${id}: ${response.statusText}`)
    }
    const topicCategory = await response.json()
    return topicCategory
}