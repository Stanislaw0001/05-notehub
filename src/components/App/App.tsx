import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import css from './App.module.css';
import Modal from '../Modal/Modal';
import NoteList from '../NoteList/NoteList';
import NoteForm from '../NoteForm/NoteForm';
import SearchBox from '../SearchBox/SearchBox';
import Pagination from '../Pagination/Pagination';
import { fetchNotes } from '../../services/noteService';

const NOTES_PER_PAGE = 12;

export default function App() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    
    const debouncedSearch = useDebouncedCallback((value: string) => {
        setSearch(value.trim());
        setPage(1);
    }, 400);
    
    const {
        data,
        isPending,
        isError,
        error,
    } = useQuery({
        queryKey: ['notes', { page, perPage: NOTES_PER_PAGE, search }],
        queryFn: () => fetchNotes({ page, perPage: NOTES_PER_PAGE, search }),
        placeholderData: keepPreviousData,
    });

    function handleSearchChange(value: string) {
        setSearchInput(value);
        debouncedSearch(value);
    }

    return (
        <div className={css.app}>
            <header className={css.toolbar}>
                <SearchBox
                    value={searchInput}
                    onChange={handleSearchChange}
                />
                {data && data.totalPages > 1 && (
                    <Pagination
                        totalPages={data.totalPages}
                        page={page}
                        setPage={setPage}
                    />
                )}
                <button 
                    className={css.button} 
                    onClick={() => setIsModalOpen(true)}
                >
                    Create note +
                </button>
            </header>

            {isPending && <p>Завантаження...</p>}
            {isError && <p>Помилка: {error?.message}</p>}
            
            
            {data && (
                <NoteList
                    notes={data.notes}
                    page={page}
                    setPage={setPage}
                />
            )}

            {isModalOpen && (
                <Modal onClose={() => setIsModalOpen(false)}>
                    <NoteForm onCancel={() => setIsModalOpen(false)} />
                </Modal>
            )}
        </div>
    );
}