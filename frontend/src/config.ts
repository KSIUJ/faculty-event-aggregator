import type { AgendaDateRange, AgendaEventStatus, EventLifecycleStatus } from '@/types/agenda'

function positiveNumberFromEnv(value: string | undefined, fallback: number) {
    const parsedValue = Number(value)
    return Number.isFinite(parsedValue) && parsedValue > 0
        ? parsedValue
        : fallback
}

export const API_URL =
    import.meta.env.VITE_API_URL
    || 'http://localhost:8000'

export const APP_LOCALE =
    import.meta.env.VITE_APP_LOCALE
    || 'pl-PL'
export const EVENTS_PER_PAGE = positiveNumberFromEnv(
    import.meta.env.VITE_EVENTS_PER_PAGE,
    4,
)
export const MAX_VISIBLE_EVENT_TOPICS = positiveNumberFromEnv(
    import.meta.env.VITE_MAX_VISIBLE_EVENT_TOPICS,
    2,
)
export const DEFAULT_EVENT_DURATION_MS = positiveNumberFromEnv(
    import.meta.env.VITE_DEFAULT_EVENT_DURATION_MS,
    60 * 60 * 1000,
)
export const TOAST_DURATION_MS = positiveNumberFromEnv(
    import.meta.env.VITE_TOAST_DURATION_MS,
    2800,
)
export const EVENT_STATUS_REFRESH_MS = 30 * 1000

export const PROJECT_REPOSITORY_URL =
    import.meta.env.VITE_PROJECT_REPOSITORY_URL ||
    'https://github.com/KSIUJ/faculty-event-aggregator'

export const GOOGLE_CALENDAR_EVENT_URL =
    import.meta.env.VITE_GOOGLE_CALENDAR_EVENT_URL ||
    'https://calendar.google.com/calendar/render'
export const OUTLOOK_CALENDAR_EVENT_URL =
    import.meta.env.VITE_OUTLOOK_CALENDAR_EVENT_URL ||
    'https://outlook.office.com/calendar/action/compose'
export const CALENDAR_FEED_PATH =
    import.meta.env.VITE_CALENDAR_FEED_PATH
    || '/events/calendar.ics'

export const EVENT_DATE_TIME_OPTIONS: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
}

export const EVENT_CATEGORY_KEYS = [
    'lecture',
    'workshop',
    'networking',
    'conference',
    'seminar',
] as const

export type EventCategoryKey = typeof EVENT_CATEGORY_KEYS[number]

export const EVENT_CATEGORY_ALIASES: Record<string, EventCategoryKey> = {
    lecture: 'lecture',
    wyklad: 'lecture',
    workshop: 'workshop',
    workshops: 'workshop',
    warsztaty: 'workshop',
    'warsztaty praktyczne': 'workshop',
    networking: 'networking',
    'spotkanie branzowe': 'networking',
    conference: 'conference',
    konferencja: 'conference',
    seminar: 'seminar',
    seminarium: 'seminar',
}

export const EVENT_CATEGORY_LABELS: Record<EventCategoryKey, string> = {
    lecture: 'Wykład',
    workshop: 'Warsztaty',
    networking: 'Spotkanie branżowe',
    conference: 'Konferencja',
    seminar: 'Seminarium',
}

export const EVENT_CARD_COLORS = [
    'blue',
    'yellow',
    'pink',
    'green',
    'orange',
] as const

export type EventCardColor = typeof EVENT_CARD_COLORS[number]

export const EVENT_CATEGORY_CARD_COLORS: Record<EventCategoryKey, EventCardColor> = {
    lecture: 'blue',
    workshop: 'yellow',
    networking: 'pink',
    conference: 'green',
    seminar: 'orange',
}

export const EVENT_CATEGORY_CHOICE_COLOR_CLASSES: Record<EventCategoryKey, string> = {
    lecture: 'choice-card--blue',
    workshop: 'choice-card--yellow',
    networking: 'choice-card--pink',
    conference: 'choice-card--green',
    seminar: 'choice-card--orange',
}

export const EVENT_CATEGORY_FILTER_COLOR_CLASSES: Record<EventCategoryKey, string> = {
    lecture: 'category-button--blue',
    workshop: 'category-button--yellow',
    networking: 'category-button--pink',
    conference: 'category-button--green',
    seminar: 'category-button--orange',
}

export const DATE_RANGE_OPTIONS: Array<{
    value: Exclude<AgendaDateRange, 'custom'>
    label: string
    description: string
    icon: string
}> = [
    { value: 'today', label: 'Dzisiaj', description: 'Tylko dzisiejsze wydarzenia', icon: '●' },
    { value: 'tomorrow', label: 'Jutro', description: 'Plan na kolejny dzień', icon: '→' },
    { value: 'week', label: 'Ten tydzień', description: 'Bieżący tydzień', icon: '▦' },
    { value: 'next7', label: 'Najbliższe 7 dni', description: 'Od dzisiaj przez tydzień', icon: '7' },
    { value: 'next30', label: 'Najbliższe 30 dni', description: 'Plan na miesiąc do przodu', icon: '30' },
    { value: 'all', label: 'Wszystkie terminy', description: 'Bez ograniczenia daty', icon: '∞' },
]

export const EVENT_STATUS_OPTIONS: Array<{
    value: AgendaEventStatus
    label: string
    description: string
    icon: string
}> = [
    { value: 'all', label: 'Wszystkie statusy', description: 'Bez ograniczeń', icon: '◇' },
    { value: 'not-started', label: 'Nie rozpoczęło się', description: 'Wydarzenia przed startem', icon: '○' },
    { value: 'ongoing', label: 'Trwa', description: 'Wydarzenia odbywające się teraz', icon: '...' },
    { value: 'ended', label: 'Zakończone', description: 'Wydarzenia po zakończeniu', icon: '■' },
]

export const EVENT_STATUS_LABELS: Record<EventLifecycleStatus, string> = {
    'not-started': 'Nie rozpoczęło się',
    ongoing: 'Trwa',
    ended: 'Zakończone',
}

export const EVENT_STATUS_HEADINGS: Record<AgendaEventStatus, string> = {
    all: 'Wszystkie wydarzenia',
    'not-started': 'Nadchodzące wydarzenia',
    ongoing: 'Trwające wydarzenia',
    ended: 'Zakończone wydarzenia',
}

export const CREATE_EVENT_STEPS = [
    { shortLabel: 'Podstawy', title: 'Tytuł i opis' },
    { shortLabel: 'Termin', title: 'Data i godzina' },
    { shortLabel: 'Klasyfikacja', title: 'Rodzaj i tematyka' },
    { shortLabel: 'Organizacja', title: 'Miejsce i organizator' },
] as const

export const CREATE_EVENT_INITIAL_FORM = {
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    categoryId: '',
    organizerId: '',
    description: '',
    topicIds: [] as number[],
}
