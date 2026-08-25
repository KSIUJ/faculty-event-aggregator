import { EVENT_CATEGORY_FILTER_COLOR_CLASSES } from '@/config'
import type { EventCategory } from '@/types'
import type { AgendaCategory, AgendaDateRange } from '@/types/agenda'
import { getEventCategoryKey, localizeEventCategory } from '@/utils/eventCategories'
import { formatWeekRange } from '@/utils/eventFormatters'

function getCategoryColorClass(title: string) {
    const categoryKey = getEventCategoryKey(title)
    return categoryKey
        ? EVENT_CATEGORY_FILTER_COLOR_CLASSES[categoryKey]
        : 'category-button--blue'
}

interface FilterSidebarProps {
    categories: EventCategory[]
    activeCategory: AgendaCategory
    dateRange: AgendaDateRange
    searchQuery: string
    onCategoryChange: (category: AgendaCategory) => void
    onDateRangeChange: (range: AgendaDateRange) => void
    onSearchChange: (query: string) => void
}

export default function FilterSidebar({
    categories,
    activeCategory,
    dateRange,
    searchQuery,
    onCategoryChange,
    onDateRangeChange,
    onSearchChange,
}: FilterSidebarProps) {
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
                <button
                    className={`week-selector ${dateRange === 'week' ? 'is-active' : ''}`}
                    type="button"
                    aria-pressed={dateRange === 'week'}
                    onClick={() => onDateRangeChange(dateRange === 'week' ? 'upcoming' : 'week')}
                >
                    <strong>{dateRange === 'week' ? formatWeekRange() : 'WSZYSTKIE NADCHODZĄCE'}</strong>
                    <span>{dateRange === 'week' ? 'Bieżący tydzień' : 'Dowolny przyszły termin'} <span aria-hidden="true">↗</span></span>
                </button>
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
                            className={`category-button ${getCategoryColorClass(category.title)} ${activeCategory === category.id ? 'is-active' : ''}`}
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
