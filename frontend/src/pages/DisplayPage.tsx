import { useEffect, useMemo, useState } from 'react'
import { EVENT_STATUS_HEADINGS, EVENT_STATUS_REFRESH_MS, PROJECT_REPOSITORY_URL, TOAST_DURATION_MS } from '@/config'
import { deleteEvent, getAllEventCategories, getAllEvents, getAllOrganizers, getAllTopicCategories, getEventById } from '@/services'
import type { Event, EventCategory, EventList, Organizer, TopicCategory } from '@/types'
import type { AgendaCategory, AgendaCustomDateRange, AgendaDateRange, AgendaEventStatus } from '@/types/agenda'
import { isInAgendaDateRange } from '@/utils/eventFormatters'
import { eventMatchesSearch } from '@/utils/eventSearch'
import { eventMatchesStatus } from '@/utils/eventStatus'
import { CreateEventModal, EventDetailsModal, EventsPanel, FilterSidebar, HeroBanner, SiteHeader } from '@/components/agenda'

interface AgendaResources {
    categories: EventCategory[]
    organizers: Organizer[]
    topics: TopicCategory[]
}

export default function DisplayPage() {
    const [events, setEvents] = useState<EventList[] | null>(null)
    const [resources, setResources] = useState<AgendaResources>({ categories: [], organizers: [], topics: [] })
    const [error, setError] = useState(false)
    const [activeCategory, setActiveCategory] = useState<AgendaCategory>('all')
    const [dateRange, setDateRange] = useState<AgendaDateRange>('all')
    const [customDateRange, setCustomDateRange] = useState<AgendaCustomDateRange>({ start: '', end: '' })
    const [eventStatus, setEventStatus] = useState<AgendaEventStatus>('not-started')
    const [statusClock, setStatusClock] = useState(() => Date.now())
    const [searchQuery, setSearchQuery] = useState('')
    const [notice, setNotice] = useState('')
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
    const [detailsLoading, setDetailsLoading] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

    useEffect(() => {
        async function loadEvents() {
            try {
                const [eventList, categories, organizers, topics] = await Promise.all([
                    getAllEvents(),
                    getAllEventCategories(),
                    getAllOrganizers(),
                    getAllTopicCategories(),
                ])
                setEvents(eventList)
                setResources({ categories, organizers, topics })
            } catch {
                setError(true)
            }
        }

        loadEvents()
    }, [])

    useEffect(() => {
        const timer = window.setInterval(() => setStatusClock(Date.now()), EVENT_STATUS_REFRESH_MS)
        return () => window.clearInterval(timer)
    }, [])

    const categories = useMemo<EventCategory[]>(() => {
        const fallbackCategories = events
            ? [...new Map(events.map((event) => [event.event_category.id, event.event_category])).values()]
            : []
        const uniqueCategories = new Map([...resources.categories, ...fallbackCategories].map((category) => [category.id, category]))
        return [...uniqueCategories.values()].sort((a, b) => a.title.localeCompare(b.title))
    }, [events, resources.categories])

    const visibleEvents = useMemo(() => {
        if (!events) return []
        return events
            .filter((event) => eventMatchesSearch(event, searchQuery))
            .filter((event) => activeCategory === 'all' || event.event_category.id === activeCategory)
            .filter((event) => isInAgendaDateRange(event.start_time, dateRange, customDateRange))
            .filter((event) => eventMatchesStatus(event, eventStatus, statusClock))
            .sort((a, b) => {
                const difference = new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
                return eventStatus === 'ended' ? -difference : difference
            })
    }, [activeCategory, customDateRange, dateRange, eventStatus, events, searchQuery, statusClock])

    const showNotice = (message: string) => {
        setNotice(message)
        window.setTimeout(() => setNotice(''), TOAST_DURATION_MS)
    }

    const handleOpenEvent = async (event: EventList) => {
        setSelectedEvent(event)
        setDetailsLoading(true)
        try {
            const details = await getEventById(event.id)
            if (details) setSelectedEvent(details)
        } catch {
            // Dane z listy wystarczają do wyświetlenia podstawowych informacji.
        } finally {
            setDetailsLoading(false)
        }
    }

    const handleCreatedEvent = (event: Event) => {
        setEvents((current) => current ? [...current.filter((item) => item.id !== event.id), event] : [event])
        setIsCreateModalOpen(false)
        showNotice('Wydarzenie zostało zapisane w bazie danych.')
    }

    const handleDeleteEvent = async () => {
        if (!selectedEvent) return

        const confirmed = window.confirm(
            `Czy na pewno usunąć wydarzenie „${selectedEvent.title}”? Tej operacji nie można cofnąć.`,
        )
        if (!confirmed) return

        setIsDeleting(true)
        try {
            await deleteEvent(selectedEvent.id)
            setEvents((current) => current?.filter((event) => event.id !== selectedEvent.id) ?? null)
            setSelectedEvent(null)
            showNotice('Wydarzenie zostało usunięte z bazy danych.')
        } catch {
            showNotice('Nie udało się usunąć wydarzenia.')
        } finally {
            setIsDeleting(false)
        }
    }

    if (error) {
        return (
            <div className="app-shell app-shell--message">
                <p className="eyebrow">Wydział // Wydarzenia</p>
                <h1>Nie udało się pobrać wydarzeń.</h1>
                <p>Sprawdź, czy serwer aplikacji jest uruchomiony, a następnie odśwież stronę.</p>
            </div>
        )
    }

    if (!events) {
        return (
            <div className="app-shell app-shell--message">
                <p className="eyebrow">Wydział // Wydarzenia</p>
                <h1>Wczytywanie wydarzeń…</h1>
            </div>
        )
    }

    return (
        <div className="app-shell">
            <SiteHeader onSubmitEvent={() => setIsCreateModalOpen(true)} />
            <main id="agenda">
                <HeroBanner />
                <div className="agenda-layout">
                    <FilterSidebar
                        categories={categories}
                        activeCategory={activeCategory}
                        dateRange={dateRange}
                        customDateRange={customDateRange}
                        eventStatus={eventStatus}
                        searchQuery={searchQuery}
                        onCategoryChange={setActiveCategory}
                        onCustomDateRangeChange={setCustomDateRange}
                        onDateRangeChange={setDateRange}
                        onEventStatusChange={setEventStatus}
                        onSearchChange={setSearchQuery}
                    />
                    <EventsPanel
                        events={visibleEvents}
                        heading={EVENT_STATUS_HEADINGS[eventStatus]}
                        onOpenEvent={handleOpenEvent}
                    />
                </div>
            </main>
            <footer className="site-footer" id="about">
                <span>Wydział // Wydarzenia</span>
                <a
                    className="site-footer__github"
                    href={PROJECT_REPOSITORY_URL}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Repozytorium projektu na GitHubie (otwiera się w nowej karcie)"
                >
                    <img src="/git-pixel.png" alt="" aria-hidden="true" />
                    <span>GitHub</span>
                    <span aria-hidden="true">↗</span>
                </a>
                <span>Kalendarz wydarzeń akademickich i wydziałowych.</span>
            </footer>
            <div className={`toast ${notice ? 'is-visible' : ''}`} role="status" aria-live="polite">{notice}</div>
            {selectedEvent && <EventDetailsModal event={selectedEvent} loading={detailsLoading} deleting={isDeleting} onClose={() => setSelectedEvent(null)} onDelete={handleDeleteEvent} />}
            {isCreateModalOpen && <CreateEventModal categories={categories} organizers={resources.organizers} topics={resources.topics} onClose={() => setIsCreateModalOpen(false)} onCreated={handleCreatedEvent} />}
        </div>
    )
}
