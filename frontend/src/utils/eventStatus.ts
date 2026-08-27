import { DEFAULT_EVENT_DURATION_MS, EVENT_STATUS_LABELS } from '@/config'
import type { EventList } from '@/types'
import type { AgendaEventStatus, EventLifecycleStatus } from '@/types/agenda'

function getEventEndTime(event: EventList) {
    if (event.end_time) return new Date(event.end_time).getTime()
    return new Date(event.start_time).getTime() + DEFAULT_EVENT_DURATION_MS
}

export function getEventLifecycleStatus(
    event: EventList,
    currentTime = Date.now(),
): EventLifecycleStatus {
    const startTime = new Date(event.start_time).getTime()
    if (currentTime < startTime) return 'not-started'
    if (currentTime < getEventEndTime(event)) return 'ongoing'
    return 'ended'
}

export function eventMatchesStatus(
    event: EventList,
    status: AgendaEventStatus,
    currentTime = Date.now(),
) {
    return status === 'all' || getEventLifecycleStatus(event, currentTime) === status
}

export function getEventLifecycleStatusLabel(status: EventLifecycleStatus) {
    return EVENT_STATUS_LABELS[status]
}
