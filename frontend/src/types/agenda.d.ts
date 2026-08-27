export type AgendaCategory = number | 'all'
export type AgendaDateRange = 'all' | 'today' | 'tomorrow' | 'week' | 'next7' | 'next30' | 'custom'

export interface AgendaCustomDateRange {
    start: string
    end: string
}

export type AgendaEventStatus = 'all' | 'not-started' | 'ongoing' | 'ended'
export type EventLifecycleStatus = Exclude<AgendaEventStatus, 'all'>
