import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import css from './Modal.module.css';

export default function Modal({ onClose }) {
    useEffect(() => {
        function handleKeyDown(event) {
            if (event.key === 'Escape') {
                onClose();
            }
        }

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    return createPortal(
        <div
            className={css.backdrop}
            role="dialog"
            aria-modal="true"
            onClick={onClose}
        >
            <div className={css.modal} onClick={event => event.stopPropagation()}>
                {/* */}
            </div>
        </div>,
        document.body
    );
}