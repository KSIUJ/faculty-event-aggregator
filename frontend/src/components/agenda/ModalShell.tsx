import type { ReactNode } from 'react'

interface ModalShellProps {
    eyebrow: ReactNode
    title: string
    children: ReactNode
    onClose: () => void
    className?: string
}

export default function ModalShell({ eyebrow, title, children, onClose, className = '' }: ModalShellProps) {
    return (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose()
        }}>
            <section className={`modal ${className}`} role="dialog" aria-modal="true" aria-labelledby="modal-title">
                <div className="modal__header">
                    <div>
                        <div className="modal__eyebrow">{eyebrow}</div>
                        <h2 id="modal-title">{title}</h2>
                    </div>
                    <button className="modal__close" type="button" aria-label="Zamknij okno" onClick={onClose}>×</button>
                </div>
                {children}
            </section>
        </div>
    )
}
