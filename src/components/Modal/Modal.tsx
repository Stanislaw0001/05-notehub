import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { MouseEvent, ReactNode } from 'react';
import css from './Modal.module.css';

interface ModalProps {
    onClose: () => void;
    children: ReactNode;
}

export default function Modal({ onClose, children }: ModalProps) {
    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                onClose();
            }
        }

        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = 'hidden';

        document.addEventListener('keydown', handleKeyDown);
        
        return () => {
            document.body.style.overflow = originalStyle;
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    return createPortal(
        <div
            className={css.backdrop}
            role="dialog"
            aria-modal="true"
            onClick={onClose}
        >
            <div
                className={css.modal}
                onClick={(event: MouseEvent<HTMLDivElement>) => event.stopPropagation()}
            >
                {children}
            </div>
        </div>,
        document.body
    );
}