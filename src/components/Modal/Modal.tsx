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