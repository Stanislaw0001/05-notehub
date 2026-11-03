import { useState } from 'react';
import css from './App.module.css';
import Modal from '../Modal/Modal';

export default function App() {
    const [isModalOpen, setIsModalOpen] = useState(true);

    return (
        <div className={css.app}>
            <header className={css.toolbar}>
		{/* Компонент SearchBox */}
		{/* Пагінація */}
		{/* Кнопка створення нотатки */}
            </header>
            <NoteList />
            <Pagination />
            {isModalOpen && <Modal onClose={() => setIsModalOpen(false)} />}
        </div>
    )
}