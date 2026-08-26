import { useState } from 'react'
import type { FormEvent } from 'react'
import {
    CREATE_EVENT_INITIAL_FORM,
    CREATE_EVENT_STEPS,
    EVENT_CATEGORY_CHOICE_COLOR_CLASSES,
} from '@/config'
import type { CreateEventPayload, Event, EventCategory, Organizer, TopicCategory } from '@/types'
import { createEvent } from '@/services'
import { getEventCategoryKey, localizeEventCategory } from '@/utils/eventCategories'
import ModalShell from './ModalShell'

interface CreateEventModalProps {
    categories: EventCategory[]
    organizers: Organizer[]
    topics: TopicCategory[]
    onClose: () => void
    onCreated: (event: Event) => void
}

interface FormState {
    title: string
    date: string
    startTime: string
    endTime: string
    location: string
    categoryId: string
    organizerId: string
    description: string
    topicIds: number[]
}

function normalizeDateInput(value: string) {
    const parts = value.trim().split(/[^0-9]+/).filter(Boolean)
    if (parts.length !== 3) return value
    return `${parts[0].padStart(2, '0')}.${parts[1].padStart(2, '0')}.${parts[2]}`
}

function normalizeTimeInput(value: string) {
    const parts = value.trim().split(/[^0-9]+/).filter(Boolean)
    if (parts.length !== 2) return value
    return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`
}

function parseDate(value: string) {
    const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(value)
    if (!match) return null
    const day = Number(match[1])
    const month = Number(match[2])
    const year = Number(match[3])
    const parsed = new Date(year, month - 1, day)
    if (parsed.getFullYear() !== year || parsed.getMonth() !== month - 1 || parsed.getDate() !== day) return null
    return { day, month, year }
}

function parseTime(value: string) {
    const match = /^(\d{2}):(\d{2})$/.exec(value)
    if (!match) return null
    const hours = Number(match[1])
    const minutes = Number(match[2])
    if (hours > 23 || minutes > 59) return null
    return { hours, minutes }
}

function toLocalDateTime(date: string, time: string) {
    const dateParts = parseDate(date)
    const timeParts = parseTime(time)
    if (!dateParts || !timeParts) return null
    return new Date(dateParts.year, dateParts.month - 1, dateParts.day, timeParts.hours, timeParts.minutes, 0, 0)
}

function OrganizerTypeIcon({ type }: { type: Organizer['type'] }) {
    const commonProps = {
        className: 'organizer-type-icon',
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 2,
        shapeRendering: 'crispEdges' as const,
        'aria-hidden': true,
    }

    if (type === 'PERSON') {
        return (
            <svg {...commonProps}>
                <path d="M9 3h6v2h2v4h-2v2H9V9H7V5h2V3Z" />
                <path d="M8 13h8v2h2v2h2v4H4v-4h2v-2h2v-2Z" />
            </svg>
        )
    }

    return (
        <svg {...commonProps}>
            <path d="M8 4h8v2h2v2h2v13H4V8h2V6h2V4Z" />
            <path d="M8 10h2v2H8zM14 10h2v2h-2zM8 14h2v2H8zM14 14h2v2h-2zM10 17h4v4h-4z" />
        </svg>
    )
}

export default function CreateEventModal({ categories, organizers, topics, onClose, onCreated }: CreateEventModalProps) {
    const [form, setForm] = useState<FormState>(CREATE_EVENT_INITIAL_FORM)
    const [step, setStep] = useState(0)
    const [visitedSteps, setVisitedSteps] = useState<number[]>([0])
    const [completedSteps, setCompletedSteps] = useState<number[]>([])
    const [error, setError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const selectedCategory = categories.find((category) => category.id === Number(form.categoryId))
    const selectedOrganizer = organizers.find((organizer) => organizer.id === Number(form.organizerId))
    const selectedTopics = topics.filter((topic) => form.topicIds.includes(topic.id))
    const reviewStart = toLocalDateTime(form.date, form.startTime)

    const update = (field: keyof FormState, value: string) => {
        setError('')
        setCompletedSteps((completed) => completed.filter((completedStep) => completedStep !== step))
        setForm((current) => ({ ...current, [field]: value }))
    }

    const toggleTopic = (topicId: number) => {
        setError('')
        setCompletedSteps((completed) => completed.filter((completedStep) => completedStep !== step))
        setForm((current) => ({
            ...current,
            topicIds: current.topicIds.includes(topicId)
                ? current.topicIds.filter((id) => id !== topicId)
                : [...current.topicIds, topicId],
        }))
    }

    const validateStep = (stepIndex: number) => {
        if (stepIndex === 0 && form.title.trim().length < 3) return 'Tytuł wydarzenia powinien zawierać co najmniej 3 znaki.'
        if (stepIndex === 1) {
            if (!parseDate(form.date)) return 'Wprowadź poprawną datę w formacie DD.MM.RRRR.'
            const start = toLocalDateTime(form.date, form.startTime)
            if (!start) return 'Wprowadź poprawną godzinę rozpoczęcia w formacie GG:MM.'
            if (start.getTime() <= Date.now()) return 'Termin rozpoczęcia wydarzenia musi przypadać w przyszłości.'
            if (form.endTime) {
                const end = toLocalDateTime(form.date, form.endTime)
                if (!end) return 'Wprowadź poprawną godzinę zakończenia w formacie GG:MM.'
                if (end <= start) return 'Godzina zakończenia musi być późniejsza niż rozpoczęcia.'
            }
        }
        if (stepIndex === 2 && !form.categoryId) return 'Wybierz rodzaj wydarzenia.'
        if (stepIndex === 3 && !form.organizerId) return 'Wybierz organizatora wydarzenia.'
        return ''
    }

    const navigateToStep = (nextStep: number) => {
        setError('')
        setVisitedSteps((visited) => visited.includes(nextStep) ? visited : [...visited, nextStep])
        setStep(nextStep)
    }

    const goToNextStep = () => {
        const validationError = validateStep(step)
        if (validationError) {
            setError(validationError)
            return
        }
        setCompletedSteps((completed) => completed.includes(step) ? completed : [...completed, step])
        navigateToStep(Math.min(step + 1, CREATE_EVENT_STEPS.length - 1))
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (step < CREATE_EVENT_STEPS.length - 1) {
            goToNextStep()
            return
        }

        const firstInvalidStep = CREATE_EVENT_STEPS.findIndex((_, index) => validateStep(index))
        if (firstInvalidStep >= 0) {
            const validationError = validateStep(firstInvalidStep)
            setVisitedSteps((visited) => visited.includes(firstInvalidStep) ? visited : [...visited, firstInvalidStep])
            setStep(firstInvalidStep)
            setError(`Nie można zapisać wydarzenia. ${validationError}`)
            return
        }

        const startTime = toLocalDateTime(form.date, form.startTime)
        const endTime = form.endTime ? toLocalDateTime(form.date, form.endTime) : null
        if (!startTime) return

        setError('')
        setIsSubmitting(true)
        const payload: CreateEventPayload = {
            title: form.title.trim(),
            description: form.description.trim() || undefined,
            location: form.location.trim() || undefined,
            start_time: startTime.toISOString(),
            end_time: endTime?.toISOString(),
            event_category_id: Number(form.categoryId),
            organizer_id: Number(form.organizerId),
            topic_category_ids: form.topicIds,
        }

        try {
            const created = await createEvent(payload)
            onCreated(created)
        } catch {
            setError('Nie udało się dodać wydarzenia. Sprawdź poprawność danych formularza.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <ModalShell
            eyebrow={(
                <div
                    className="wizard-header-progress"
                    role="progressbar"
                    aria-label="Postęp dodawania wydarzenia"
                    aria-valuemin={1}
                    aria-valuemax={CREATE_EVENT_STEPS.length}
                    aria-valuenow={step + 1}
                >
                    <span style={{ width: `${((step + 1) / CREATE_EVENT_STEPS.length) * 100}%` }} />
                </div>
            )}
            title="Dodaj wydarzenie"
            onClose={onClose}
            className="modal--form"
        >
            <form className="event-form event-wizard" onSubmit={handleSubmit}>
                <nav className="wizard-progress" aria-label="Postęp dodawania wydarzenia">
                    {CREATE_EVENT_STEPS.map((wizardStep, index) => (
                        <button
                            className={`wizard-progress__item ${index === step ? 'is-current' : ''} ${index !== step && completedSteps.includes(index) ? 'is-complete' : ''} ${index !== step && visitedSteps.includes(index) && !completedSteps.includes(index) ? 'is-visited' : ''}`}
                            key={wizardStep.shortLabel}
                            type="button"
                            aria-current={index === step ? 'step' : undefined}
                            onClick={() => navigateToStep(index)}
                        >
                            <span>{String(index + 1).padStart(2, '0')}</span>
                            <strong>{wizardStep.shortLabel}</strong>
                        </button>
                    ))}
                </nav>

                <section className="wizard-step" aria-labelledby="wizard-step-title">
                    <div className="wizard-step__header">
                        <p>Krok {step + 1} / {CREATE_EVENT_STEPS.length}</p>
                        <h3 id="wizard-step-title">{CREATE_EVENT_STEPS[step].title}</h3>
                    </div>

                    {step === 0 && (
                        <div className="wizard-step__content">
                            <label className="field">
                                <span>Tytuł wydarzenia*</span>
                                <input autoFocus value={form.title} onChange={(event) => update('title', event.target.value)} placeholder="Np. Seminarium z analizy danych" />
                                <small>Nazwa widoczna na liście i w kalendarzu.</small>
                            </label>
                            <label className="field">
                                <span>Opis</span>
                                <textarea rows={6} value={form.description} onChange={(event) => update('description', event.target.value)} placeholder="Zakres wydarzenia, program oraz informacje organizacyjne" />
                            </label>
                        </div>
                    )}

                    {step === 1 && (
                        <div className="wizard-step__content">
                            <div className="date-time-grid">
                                <label className="field field--date"><span>Data*</span><input inputMode="numeric" value={form.date} onBlur={() => update('date', normalizeDateInput(form.date))} onChange={(event) => update('date', event.target.value)} placeholder="DD.MM.RRRR" /></label>
                                <label className="field"><span>Rozpoczęcie*</span><input inputMode="numeric" value={form.startTime} onBlur={() => update('startTime', normalizeTimeInput(form.startTime))} onChange={(event) => update('startTime', event.target.value)} placeholder="GG:MM" /></label>
                                <label className="field"><span>Zakończenie</span><input inputMode="numeric" value={form.endTime} onBlur={() => update('endTime', normalizeTimeInput(form.endTime))} onChange={(event) => update('endTime', event.target.value)} placeholder="GG:MM" /></label>
                            </div>
                            <div className="wizard-note"><span aria-hidden="true">◷</span><p>Godziny są zapisywane zgodnie ze strefą czasową urządzenia. Godzina zakończenia jest opcjonalna.</p></div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="wizard-step__content">
                            <fieldset className="field-group">
                                <legend>Rodzaj wydarzenia*</legend>
                                <div className="choice-grid">
                                    {categories.map((category) => {
                                        const categoryKey = getEventCategoryKey(category.title)
                                        const colorClass = categoryKey ? EVENT_CATEGORY_CHOICE_COLOR_CLASSES[categoryKey] : 'choice-card--blue'
                                        const isSelected = form.categoryId === String(category.id)
                                        return <button className={`choice-card ${colorClass} ${isSelected ? 'is-selected' : ''}`} key={category.id} type="button" aria-pressed={isSelected} onClick={() => update('categoryId', String(category.id))}><span aria-hidden="true">{isSelected ? '■' : '□'}</span><strong>{localizeEventCategory(category.title)}</strong></button>
                                    })}
                                </div>
                            </fieldset>
                            {topics.length > 0 && (
                                <fieldset className="field-group">
                                    <legend>Tematyka</legend>
                                    <div className="topic-options">
                                        {topics.map((topic) => {
                                            const isSelected = form.topicIds.includes(topic.id)
                                            return <button className={`topic-option ${isSelected ? 'is-selected' : ''}`} key={topic.id} type="button" aria-pressed={isSelected} onClick={() => toggleTopic(topic.id)}><span aria-hidden="true">{isSelected ? '■' : '＋'}</span>{topic.title}</button>
                                        })}
                                    </div>
                                </fieldset>
                            )}
                        </div>
                    )}

                    {step === 3 && (
                        <div className="wizard-step__content">
                            <fieldset className="field-group">
                                <legend>Organizator*</legend>
                                <div className="organizer-options">
                                    {organizers.map((organizer) => {
                                        const isSelected = form.organizerId === String(organizer.id)
                                        return <button className={`organizer-option ${isSelected ? 'is-selected' : ''}`} key={organizer.id} type="button" aria-pressed={isSelected} aria-label={`${organizer.name}, ${organizer.type === 'PERSON' ? 'osoba' : 'organizacja'}`} onClick={() => update('organizerId', String(organizer.id))}><OrganizerTypeIcon type={organizer.type} /><strong>{organizer.name}</strong></button>
                                    })}
                                </div>
                            </fieldset>
                            <label className="field"><span>Miejsce</span><input value={form.location} onChange={(event) => update('location', event.target.value)} placeholder="Budynek i numer sali" /></label>
                            <div className="event-review" aria-label="Podsumowanie wydarzenia">
                                <p>Podsumowanie</p>
                                <h4>{form.title || 'Brak tytułu'}</h4>
                                <dl>
                                    <div><dt>Termin</dt><dd>{reviewStart ? new Intl.DateTimeFormat('pl-PL', { dateStyle: 'long', timeStyle: 'short' }).format(reviewStart) : 'Nie podano'}</dd></div>
                                    <div><dt>Rodzaj</dt><dd>{selectedCategory ? localizeEventCategory(selectedCategory.title) : 'Nie wybrano'}</dd></div>
                                    <div><dt>Organizator</dt><dd>{selectedOrganizer?.name ?? 'Nie wybrano'}</dd></div>
                                    <div><dt>Tematyka</dt><dd>{selectedTopics.length > 0 ? selectedTopics.map((topic) => topic.title).join(', ') : 'Nie wybrano'}</dd></div>
                                </dl>
                            </div>
                        </div>
                    )}
                </section>

                {error && <p className="form-error" role="alert">{error}</p>}
                <p className="wizard-required-note"><span aria-hidden="true">*</span> Pole obowiązkowe</p>
                <div className="wizard-actions">
                    <div>{step > 0 && <button className="button button--outline" type="button" onClick={() => navigateToStep(step - 1)}>← Wstecz</button>}</div>
                    <div>
                        <button className="button button--outline" type="button" onClick={onClose}>Anuluj</button>
                        <button className="button button--yellow" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Zapisywanie…' : step === CREATE_EVENT_STEPS.length - 1 ? 'Zapisz wydarzenie' : 'Dalej →'}</button>
                    </div>
                </div>
            </form>
        </ModalShell>
    )
}
