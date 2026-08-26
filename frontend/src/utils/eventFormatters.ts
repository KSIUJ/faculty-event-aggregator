import { APP_LOCALE, EVENT_DATE_TIME_OPTIONS } from '@/config'
import type { EventList } from '@/types'

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

export function isInCurrentWeek(startTime: string) {
    const eventDate = new Date(startTime)
    const now = new Date()
    const start = new Date(now)
    start.setHours(0, 0, 0, 0)
    start.setDate(start.getDate() - ((start.getDay() + 6) % 7))
    const end = new Date(start)
    end.setDate(start.getDate() + 7)
    return eventDate >= start && eventDate < end
}

export function isUpcoming(startTime: string) {
    return new Date(startTime).getTime() >= Date.now()
}
