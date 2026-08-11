export type EventCategoryIcon =
    | "tools"
    | "web"
    | "computer"
    // ...

export interface EventCategory {
    id: number
    title: string
    icon_name?: EventCategoryIcon
    created_at: string
}