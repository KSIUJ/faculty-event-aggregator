interface SiteHeaderProps {
    onSubmitEvent: () => void
}

export default function SiteHeader({ onSubmitEvent }: SiteHeaderProps) {
    return (
        <header className="site-header">
            <a className="brand-lockup" href="#agenda" aria-label="Strona główna kalendarza wydarzeń wydziałowych">
                <span className="brand-logo-frame" aria-hidden="true">
                    <img className="brand-logo" src="/faculty-agenda-symbol.png" alt="" />
                </span>
                <span>Wydział // Wydarzenia</span>
            </a>
            <nav className="site-nav" aria-label="Nawigacja główna">
                <a href="#agenda">Wydarzenia</a>
                <button className="button button--yellow" type="button" onClick={onSubmitEvent}>
                    <span aria-hidden="true">+</span> Dodaj wydarzenie
                </button>
            </nav>
        </header>
    )
}
