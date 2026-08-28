import { useEffect, useId, useRef, useState } from 'react'
import { DATE_RANGE_OPTIONS, EVENT_STATUS_OPTIONS } from '@/config'
import type { EventCategory } from '@/types'
import type { AgendaCategory, AgendaCustomDateRange, AgendaDateRange, AgendaEventStatus } from '@/types/agenda'
import { getEventCategoryFilterColorClass, localizeEventCategory } from '@/utils/eventCategories'
import {
    formatAgendaDateRangeLabel,
    formatAgendaDateRangeOptionDescription,
    isValidAgendaCustomDateRange,
} from '@/utils/eventFormatters'

interface FilterSidebarProps {
    categories: EventCategory[]
    activeCategory: AgendaCategory
    dateRange: AgendaDateRange
    customDateRange: AgendaCustomDateRange
    eventStatus: AgendaEventStatus
    searchQuery: string
    onCategoryChange: (category: AgendaCategory) => void
    onCustomDateRangeChange: (range: AgendaCustomDateRange) => void
    onDateRangeChange: (range: AgendaDateRange) => void
    onEventStatusChange: (status: AgendaEventStatus) => void
    onSearchChange: (query: string) => void
}

export default function FilterSidebar({
    categories,
    activeCategory,
    dateRange,
    customDateRange,
    eventStatus,
    searchQuery,
    onCategoryChange,
    onCustomDateRangeChange,
    onDateRangeChange,
    onEventStatusChange,
    onSearchChange,
}: FilterSidebarProps) {
    const [isDateMenuOpen, setIsDateMenuOpen] = useState(false)
    const [draftCustomRange, setDraftCustomRange] = useState(customDateRange)
    const dateMenuRef = useRef<HTMLDivElement>(null)
    const dateMenuId = useId()
    const customRangeIsValid = isValidAgendaCustomDateRange(draftCustomRange)

    useEffect(() => {
        if (!isDateMenuOpen) return

        const closeOnOutsideClick = (event: MouseEvent) => {
            if (!dateMenuRef.current?.contains(event.target as Node)) setIsDateMenuOpen(false)
        }
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setIsDateMenuOpen(false)
        }

        document.addEventListener('mousedown', closeOnOutsideClick)
        document.addEventListener('keydown', closeOnEscape)
        return () => {
            document.removeEventListener('mousedown', closeOnOutsideClick)
            document.removeEventListener('keydown', closeOnEscape)
        }
    }, [isDateMenuOpen])

    const selectRange = (range: AgendaDateRange) => {
        onDateRangeChange(range)
        setIsDateMenuOpen(false)
    }

    const applyCustomRange = () => {
        if (!customRangeIsValid) return
        onCustomDateRangeChange(draftCustomRange)
        onDateRangeChange('custom')
        setIsDateMenuOpen(false)
    }

    return (
        <aside className="filter-sidebar" aria-label="Filtry wydarzeń">
            <div className="filter-sidebar__heading">
                <p className="eyebrow">Kryteria wyszukiwania</p>
                <h2>Filtrowanie wydarzeń</h2>
            </div>

            <div className="event-search">
                <label htmlFor="event-search-input">Wyszukiwanie</label>
                <div className="event-search__control">
                    <input
                        id="event-search-input"
                        type="search"
                        value={searchQuery}
                        onChange={(event) => onSearchChange(event.target.value)}
                        placeholder="Wyszukaj..."
                    />
                    {searchQuery && (
                        <button type="button" aria-label="Wyczyść wyszukiwanie" onClick={() => onSearchChange('')}>×</button>
                    )}
                </div>
            </div>

            <div className="filter-group">
                <h3>Termin</h3>
                <div className="date-picker" ref={dateMenuRef}>
                    <button
                        className={`date-picker__trigger ${dateRange !== 'all' ? 'is-active' : ''}`}
                        type="button"
                        aria-expanded={isDateMenuOpen}
                        aria-haspopup="dialog"
                        aria-controls={dateMenuId}
                        onClick={() => setIsDateMenuOpen((current) => !current)}
                    >
                        <span className="date-picker__calendar" aria-hidden="true">
                            <svg viewBox="0 0 24 24" focusable="false">
                                <path d="M4 6h16v15H4zM4 10h16M8 3v5M16 3v5" />
                                <path className="date-picker__calendar-days" d="M7 13h3v3H7zM14 13h3v3h-3zM7 17h3v2H7zM14 17h3v2h-3z" />
                            </svg>
                        </span>
                        <span className="date-picker__trigger-copy">
                            <small>Wybrany termin</small>
                            <strong>{formatAgendaDateRangeLabel(dateRange, customDateRange)}</strong>
                        </span>
                        <span className="date-picker__chevron" aria-hidden="true">
                            <span className="date-picker__chevron-closed">▼</span>
                            <span className="date-picker__chevron-open">-</span>
                        </span>
                    </button>

                    {isDateMenuOpen && (
                        <div className="date-picker__menu" id={dateMenuId} role="dialog" aria-label="Wybierz zakres dat">
                            <div className="date-picker__menu-heading">
                                <div>
                                    <span className="eyebrow">Zakres dat</span>
                                    <strong>Wybierz termin</strong>
                                </div>
                                <button type="button" aria-label="Zamknij wybór terminu" onClick={() => setIsDateMenuOpen(false)}>×</button>
                            </div>

                            <div className="date-range-options" role="group" aria-label="Szybki wybór terminu">
                                {DATE_RANGE_OPTIONS.map((option) => (
                                    <button
                                        className={`date-range-option ${dateRange === option.value ? 'is-selected' : ''}`}
                                        key={option.value}
                                        type="button"
                                        aria-pressed={dateRange === option.value}
                                        onClick={() => selectRange(option.value)}
                                    >
                                        <span className="date-range-option__icon" aria-hidden="true">{option.icon}</span>
                                        <span><strong>{option.label}</strong><small>{formatAgendaDateRangeOptionDescription(option.value, option.description)}</small></span>
                                        <span className="date-range-option__check" aria-hidden="true">{dateRange === option.value ? '■' : '□'}</span>
                                    </button>
                                ))}
                            </div>

                            <div className={`custom-date-range ${dateRange === 'custom' ? 'is-selected' : ''}`}>
                                <div className="custom-date-range__heading">
                                    <span aria-hidden="true">◇</span>
                                    <div><strong>Własny zakres</strong><small>Wybierz datę początkową i końcową</small></div>
                                </div>
                                <div className="custom-date-range__fields">
                                    <label><span>Od</span><input type="date" value={draftCustomRange.start} max={draftCustomRange.end || undefined} onChange={(event) => setDraftCustomRange((current) => ({ ...current, start: event.target.value }))} /></label>
                                    <span aria-hidden="true">→</span>
                                    <label><span>Do</span><input type="date" value={draftCustomRange.end} min={draftCustomRange.start || undefined} onChange={(event) => setDraftCustomRange((current) => ({ ...current, end: event.target.value }))} /></label>
                                </div>
                                <button className="custom-date-range__apply" type="button" disabled={!customRangeIsValid} onClick={applyCustomRange}>Zastosuj zakres <span aria-hidden="true">→</span></button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="filter-group">
                <h3>Status wydarzenia</h3>
                <div className="status-filter-list" role="group" aria-label="Status wydarzenia">
                    {EVENT_STATUS_OPTIONS.map((statusOption) => (
                        <button
                            className={`status-filter status-filter--${statusOption.value} ${eventStatus === statusOption.value ? 'is-active' : ''}`}
                            key={statusOption.value}
                            type="button"
                            aria-pressed={eventStatus === statusOption.value}
                            onClick={() => onEventStatusChange(statusOption.value)}
                        >
                            <span className="status-filter__icon" aria-hidden="true">{statusOption.icon}</span>
                            <span><strong>{statusOption.label}</strong><small>{statusOption.description}</small></span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="filter-group">
                <h3>Rodzaj wydarzenia</h3>
                <div className="category-list" role="group" aria-label="Kategoria wydarzenia">
                    <button
                        className={`category-button category-button--all ${activeCategory === 'all' ? 'is-active' : ''}`}
                        type="button"
                        aria-pressed={activeCategory === 'all'}
                        onClick={() => onCategoryChange('all')}
                    >
                        Wszystkie wydarzenia
                    </button>
                    {categories.map((category) => (
                        <button
                            className={`category-button ${getEventCategoryFilterColorClass(category.title)} ${activeCategory === category.id ? 'is-active' : ''}`}
                            key={category.id}
                            type="button"
                            aria-pressed={activeCategory === category.id}
                            onClick={() => onCategoryChange(category.id)}
                        >
                            {localizeEventCategory(category.title)}
                        </button>
                    ))}
                </div>
            </div>
        </aside>
    )
}
