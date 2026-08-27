export type AgendaCategory = number | 'all'
export type AgendaDateRange = 'upcoming' | 'today' | 'tomorrow' | 'week' | 'next7' | 'next30' | 'custom'

export interface AgendaCustomDateRange {
    start: string
    end: string
}
