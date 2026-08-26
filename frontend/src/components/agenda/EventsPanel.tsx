import { useEffect, useMemo, useState } from 'react'
import { EVENTS_PER_PAGE } from '@/config'
import type { EventList } from '@/types'
import EventCard from './EventCard'

interface EventsPanelProps {
    events: EventList[]
    onOpenEvent: (event: EventList) => void
}

function getEventCountLabel(count: number) {
    if (count === 1) return 'wydarzenie'
    const lastDigit = count % 10
    const lastTwoDigits = count % 100
    if (lastDigit >= 2 && lastDigit <= 4 && (lastTwoDigits < 12 || lastTwoDigits > 14)) return 'wydarzenia'
    return 'wydarzeń'
}

export default function EventsPanel({ events, onOpenEvent }: EventsPanelProps) {
    const [currentPage, setCurrentPage] = useState(1)
    const eventCountLabel = getEventCountLabel(events.length)
    const totalPages = Math.max(1, Math.ceil(events.length / EVENTS_PER_PAGE))
    const pageEvents = useMemo(() => {
        const firstEventIndex = (currentPage - 1) * EVENTS_PER_PAGE
        return events.slice(firstEventIndex, firstEventIndex + EVENTS_PER_PAGE)
    }, [currentPage, events])

    useEffect(() => {
        setCurrentPage(1)
    }, [events])

    const changePage = (nextPage: number) => {
        setCurrentPage(Math.min(Math.max(nextPage, 1), totalPages))
    }

    return (
        <section className="events-panel" aria-labelledby="events-heading">
            <div className="events-toolbar">
                <div>
                    <p className="eyebrow">Kalendarz</p>
                    <h2 id="events-heading">Nadchodzące wydarzenia</h2>
                </div>
                <span className="event-count">{String(events.length).padStart(2, '0')} {eventCountLabel}</span>
            </div>

            {events.length > 0 ? (
                <div className="event-list">
                    {pageEvents.map((event) => (
                        <EventCard key={event.id} event={event} onOpen={onOpenEvent} />
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <span className="empty-state__mark" aria-hidden="true">∅</span>
                    <h3>Brak wydarzeń spełniających wybrane kryteria.</h3>
                    <p>Wybierz inną kategorię lub wyświetl wszystkie nadchodzące wydarzenia.</p>
                </div>
            )}

            {events.length > EVENTS_PER_PAGE && (
                <nav className="events-pagination" aria-label="Strony listy wydarzeń">
                    <button className="button button--outline" type="button" disabled={currentPage === 1} onClick={() => changePage(currentPage - 1)}>
                        ← Poprzednia
                    </button>
                    <span aria-live="polite">Strona {String(currentPage).padStart(2, '0')} / {String(totalPages).padStart(2, '0')}</span>
                    <button className="button button--outline" type="button" disabled={currentPage === totalPages} onClick={() => changePage(currentPage + 1)}>
                        Następna →
                    </button>
                </nav>
            )}
        </section>
    )
}
