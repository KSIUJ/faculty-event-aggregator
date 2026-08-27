import { APP_LOCALE, DATE_RANGE_OPTIONS, EVENT_DATE_TIME_OPTIONS } from '@/config'
import type { EventList } from '@/types'
import type { AgendaCustomDateRange, AgendaDateRange } from '@/types/agenda'

export function formatEventTime(startTime: string) {
    return new Intl.DateTimeFormat(APP_LOCALE, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    }).format(new Date(startTime))
}

export function formatEventDate(startTime: string) {
    return new Intl.DateTimeFormat(APP_LOCALE, EVENT_DATE_TIME_OPTIONS)
        .format(new Date(startTime))
        .replace(/,/g, '')
        .toUpperCase()
}

export function formatEventDuration(event: EventList) {
    if (!event.end_time) return 'czas do ustalenia'

    const durationMinutes = Math.max(
        0,
        Math.round((new Date(event.end_time).getTime() - new Date(event.start_time).getTime()) / 60000),
    )

    if (durationMinutes < 60) return `${durationMinutes} min`
    const hours = durationMinutes / 60
    return Number.isInteger(hours) ? `${hours} godz.` : `${hours.toFixed(1).replace('.', ',')} godz.`
}

export function formatToday() {
    const now = new Date()
    return {
        weekday: new Intl.DateTimeFormat(APP_LOCALE, { weekday: 'short' }).format(now).toUpperCase(),
        date: new Intl.DateTimeFormat(APP_LOCALE, { day: '2-digit', month: 'short' }).format(now).toUpperCase(),
    }
}

export function formatWeekRange() {
    const now = new Date()
    const start = new Date(now)
    start.setHours(12, 0, 0, 0)
    start.setDate(start.getDate() - ((start.getDay() + 6) % 7))
    const end = new Date(start)
    end.setDate(start.getDate() + 6)

    const month = new Intl.DateTimeFormat(APP_LOCALE, { month: 'short' }).format(end).toUpperCase()
    return `${start.getDate()}–${end.getDate()} ${month}`
}

export function isUpcoming(startTime: string) {
    return new Date(startTime).getTime() >= Date.now()
}

function startOfDay(date: Date) {
    const result = new Date(date)
    result.setHours(0, 0, 0, 0)
    return result
}

function parseLocalDate(value: string) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
    if (!match) return null

    const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
    if (
        date.getFullYear() !== Number(match[1])
        || date.getMonth() !== Number(match[2]) - 1
        || date.getDate() !== Number(match[3])
    ) return null

    return date
}

export function formatDateInputValue(date = new Date()) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

export function isValidAgendaCustomDateRange(range: AgendaCustomDateRange) {
    const start = parseLocalDate(range.start)
    const end = parseLocalDate(range.end)
    return Boolean(start && end && start <= end)
}

export function formatAgendaDateRangeLabel(
    range: AgendaDateRange,
    customRange: AgendaCustomDateRange,
) {
    if (range === 'custom') {
        const start = parseLocalDate(customRange.start)
        const end = parseLocalDate(customRange.end)
        if (!start || !end) return 'Własny zakres'

        const formatter = new Intl.DateTimeFormat(APP_LOCALE, { day: '2-digit', month: 'short' })
        return `${formatter.format(start)} – ${formatter.format(end)}`
    }

    return DATE_RANGE_OPTIONS.find((option) => option.value === range)?.label ?? 'Wybierz termin'
}

export function formatAgendaDateRangeOptionDescription(
    range: Exclude<AgendaDateRange, 'custom'>,
    description: string,
) {
    return range === 'week' ? formatWeekRange() : description
}

export function isInAgendaDateRange(
    startTime: string,
    range: AgendaDateRange,
    customRange: AgendaCustomDateRange,
) {
    if (range === 'upcoming') return true

    const eventDate = new Date(startTime)
    const today = startOfDay(new Date())
    let start = new Date(today)
    let end = new Date(today)

    switch (range) {
        case 'today':
            end.setDate(end.getDate() + 1)
            break
        case 'tomorrow':
            start.setDate(start.getDate() + 1)
            end.setDate(end.getDate() + 2)
            break
        case 'week':
            start.setDate(start.getDate() - ((start.getDay() + 6) % 7))
            end = new Date(start)
            end.setDate(end.getDate() + 7)
            break
        case 'next7':
            end.setDate(end.getDate() + 7)
            break
        case 'next30':
            end.setDate(end.getDate() + 30)
            break
        case 'custom': {
            const customStart = parseLocalDate(customRange.start)
            const customEnd = parseLocalDate(customRange.end)
            if (!customStart || !customEnd) return false
            start = customStart
            end = customEnd
            end.setDate(end.getDate() + 1)
            break
        }
    }

    return eventDate >= start && eventDate < end
}
