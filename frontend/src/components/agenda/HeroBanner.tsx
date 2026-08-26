import { formatToday } from '@/utils/eventFormatters'

export default function HeroBanner() {
    const today = formatToday()

    return (
        <section className="hero-banner" aria-labelledby="page-title">
            <div className="hero-banner__copy">
                <p className="eyebrow">Kalendarz wydziałowy <span>/</span> Informacje</p>
                <h1 id="page-title">Wydarzenia akademickie i wydziałowe</h1>
                <p className="hero-banner__lede">
                    Informacje o wykładach, warsztatach, spotkaniach oraz pozostałych wydarzeniach organizowanych na wydziale.
                </p>
            </div>
            <div className="date-badge" aria-label={`Dzisiaj, ${today.weekday} ${today.date}`}>
                <span>Dzisiaj</span>
                <strong>{today.weekday}</strong>
                <strong>{today.date}</strong>
            </div>
        </section>
    )
}
