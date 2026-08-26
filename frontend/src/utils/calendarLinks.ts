import {
    API_URL,
    CALENDAR_FEED_PATH,
    DEFAULT_EVENT_DURATION_MS,
    GOOGLE_CALENDAR_EVENT_URL,
    OUTLOOK_CALENDAR_EVENT_URL,
} from '@/config'
import type { Event } from '@/types'

function absoluteApiUrl(path: string) {
    const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL
    return new URL(`${baseUrl}${path}`, window.location.origin).toString()
}

function eventEndTime(event: Event) {
    if (event.end_time) return new Date(event.end_time)
    return new Date(new Date(event.start_time).getTime() + DEFAULT_EVENT_DURATION_MS)
}

function googleDate(value: Date) {
    return value.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}

function eventDetails(event: Event) {
    return [
        event.description,
        `Organizator: ${event.organizer.name}`,
    ].filter(Boolean).join('\n\n')
}

export interface CalendarLinks {
    google: string
    outlook: string
    apple: string
    subscription: string
}

export function getCalendarLinks(event: Event): CalendarLinks {
    const startTime = new Date(event.start_time)
    const endTime = eventEndTime(event)
    const details = eventDetails(event)

    const google = new URL(GOOGLE_CALENDAR_EVENT_URL)
    google.search = new URLSearchParams({
        action: 'TEMPLATE',
        text: event.title,
        dates: `${googleDate(startTime)}/${googleDate(endTime)}`,
        details,
        location: event.location ?? '',
    }).toString()

    const outlook = new URL(OUTLOOK_CALENDAR_EVENT_URL)
    outlook.search = new URLSearchParams({
        rru: 'addevent',
        subject: event.title,
        startdt: startTime.toISOString(),
        enddt: endTime.toISOString(),
        body: details,
        location: event.location ?? '',
    }).toString()

    const feedUrl = absoluteApiUrl(CALENDAR_FEED_PATH)

    return {
        google: google.toString(),
        outlook: outlook.toString(),
        apple: absoluteApiUrl(`/events/${event.id}/calendar.ics`),
        subscription: feedUrl.replace(/^https?:/, 'webcal:'),
    }
}
