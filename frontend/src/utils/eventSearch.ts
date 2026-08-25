import type { EventList } from '@/types'

function normalizeSearchText(value: string) {
    return value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLocaleLowerCase('pl-PL')
        .replace(/ł/g, 'l')
}

export function eventMatchesSearch(event: EventList, query: string) {
    const tokens = normalizeSearchText(query).trim().split(/\s+/).filter(Boolean)
    if (tokens.length === 0) return true

    const searchableText = normalizeSearchText(`${event.title} ${event.description ?? ''}`)
    return tokens.every((token) => searchableText.includes(token))
}
