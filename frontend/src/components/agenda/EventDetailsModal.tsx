import type { Event } from '@/types'
import { getCalendarLinks } from '@/utils/calendarLinks'
import { localizeEventCategory } from '@/utils/eventCategories'
import { formatEventDate, formatEventDuration, formatEventTime } from '@/utils/eventFormatters'
import ModalShell from './ModalShell'

interface EventDetailsModalProps {
    event: Event
    loading: boolean
    deleting: boolean
    onClose: () => void
    onDelete: () => void
}

export default function EventDetailsModal({ event, loading, deleting, onClose, onDelete }: EventDetailsModalProps) {
    const calendarLinks = getCalendarLinks(event)

    return (
        <ModalShell eyebrow={localizeEventCategory(event.event_category.title)} title={event.title} onClose={onClose} className="modal--details">
            <div className="details-hero">
                <div className="details-facts">
                    <p><span aria-hidden="true">▣</span>{formatEventDate(event.start_time)}</p>
                    <p><span aria-hidden="true">◷</span>{formatEventTime(event.start_time)} – {event.end_time ? formatEventTime(event.end_time) : 'do ustalenia'} <small>({formatEventDuration(event)})</small></p>
                    <p><span aria-hidden="true">⌖</span>{event.location ?? 'Miejsce zostanie podane'}</p>
                    <p><span aria-hidden="true">♙</span>{event.organizer.name}</p>
                </div>
                <div className="details-date-mark" aria-hidden="true">
                    <strong>{new Intl.DateTimeFormat('pl-PL', { day: '2-digit' }).format(new Date(event.start_time))}</strong>
                    <span>{new Intl.DateTimeFormat('pl-PL', { month: 'short' }).format(new Date(event.start_time)).toUpperCase()}</span>
                </div>
            </div>
            <div className="details-body">
                {loading ? <p className="modal-muted">Wczytywanie pełnego opisu wydarzenia…</p> : <p>{event.description ?? 'Opis wydarzenia nie został jeszcze dodany.'}</p>}
                <div className="tag-list" aria-label="Kategorie wydarzenia">
                    <span className="tag tag--category">{localizeEventCategory(event.event_category.title)}</span>
                    {event.topic_categories.map((topic) => <span className="tag tag--topic" key={topic.id}>{topic.title}</span>)}
                </div>
                <div className="modal-actions modal-actions--calendar">
                    <div className="calendar-actions">
                        <a className="button calendar-action calendar-action--google" href={calendarLinks.google} target="_blank" rel="noreferrer">
                            <img src="/calendar-icons/google-calendar-8bit.png" alt="" aria-hidden="true" />
                            <span>Google</span>
                        </a>
                        <a className="button calendar-action calendar-action--outlook" href={calendarLinks.outlook} target="_blank" rel="noreferrer">
                            <img src="/calendar-icons/outlook-calendar-8bit.png" alt="" aria-hidden="true" />
                            <span>Outlook</span>
                        </a>
                        <a className="button calendar-action calendar-action--apple" href={calendarLinks.apple} target="_blank" rel="noreferrer">
                            <img src="/calendar-icons/reminders-8bit.png" alt="" aria-hidden="true" />
                            <span>Apple / inny</span>
                        </a>
                    </div>
                    <button className="button button--danger" type="button" onClick={onDelete} disabled={deleting}>{deleting ? 'Usuwanie…' : 'Usuń'}</button>
                </div>
            </div>
        </ModalShell>
    )
}
