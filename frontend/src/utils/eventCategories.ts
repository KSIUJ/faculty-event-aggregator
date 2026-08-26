import {
    EVENT_CATEGORY_ALIASES,
    EVENT_CATEGORY_LABELS,
    type EventCategoryKey,
} from '@/config'

export type { EventCategoryKey } from '@/config'

function normalizeCategoryTitle(title: string) {
    return title
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .toLowerCase()
        .replace(/ł/g, 'l')
}

export function getEventCategoryKey(title: string): EventCategoryKey | undefined {
    return EVENT_CATEGORY_ALIASES[normalizeCategoryTitle(title)]
}

export function localizeEventCategory(title: string) {
    const categoryKey = getEventCategoryKey(title)
    return categoryKey ? EVENT_CATEGORY_LABELS[categoryKey] : title
}
