export type TopicCategoryIcon =
    | "web"
    | "robot"

export interface TopicCategory {
    id: number
    title: string
    icon_name?: TopicIcon
    created_at: string
}