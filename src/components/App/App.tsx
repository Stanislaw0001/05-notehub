import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import css from './App.module.css';
import Modal from '../Modal/Modal';
import NoteList from '../NoteList/NoteList';
import NoteForm from '../NoteForm/NoteForm';
import SearchBox from '../SearchBox/SearchBox';
import Pagination from '../Pagination/Pagination';
import { createNote, deleteNote, fetchNotes } from '../../services/noteService';
import type { CreateNoteInput } from '../../services/noteService';

const NOTES_PER_PAGE = 12;

export default function App() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const queryClient = useQueryClient();
    const debouncedSearch = useDebouncedCallback((value: string) => {
        setSearch(value.trim());
        setPage(1);
    }, 400);
    const {
        data,
        isPending,
        isError,
        error,
        isFetching,
    } = useQuery({
        queryKey: ['notes', { page, perPage: NOTES_PER_PAGE, search }],
        queryFn: () => fetchNotes({ page, perPage: NOTES_PER_PAGE, search }),
    });
    const createNoteMutation = useMutation({
        mutationFn: createNote,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notes'] }),
    });
    const deleteNoteMutation = useMutation({
        mutationFn: deleteNote,
        onSuccess: async () => {
            if (data?.notes.length === 1 && page > 1) {
                setPage(page - 1);
            }
            await queryClient.invalidateQueries({ queryKey: ['notes'] });
        },
    });

    function handleSearchChange(value: string) {
        setSearchInput(value);
        debouncedSearch(value);
    }

    async function handleCreateNote(values: CreateNoteInput) {
        await createNoteMutation.mutateAsync(values);
        debouncedSearch.cancel();
        setSearchInput('');
        setSearch('');
        setPage(1);
        setIsModalOpen(false);
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
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                >
                    Create note +
                </button>
            </header>
            {isPending && <p>Loading notes...</p>}
            {isFetching && !isPending && <p>Updating notes...</p>}
            {isError && <p role="alert">Could not load notes: {error.message}</p>}
            {data && data.notes.length === 0 && <p>No notes found.</p>}
            {data && data.notes.length > 0 && (
                <>
                    {deleteNoteMutation.isError && (
                        <p role="alert">
                            Could not delete note: {deleteNoteMutation.error.message}
                        </p>
                    )}
                    <NoteList
                        notes={data.notes}
                        onDelete={noteId => deleteNoteMutation.mutate(noteId)}
                        deleting={deleteNoteMutation.isPending}
                        deletingNoteId={deleteNoteMutation.variables}
                    />
                </>
            )}
            {isModalOpen && (
                <Modal onClose={() => setIsModalOpen(false)}>
                    <NoteForm
                        onCancel={() => setIsModalOpen(false)}
                        onSubmit={handleCreateNote}
                    />
                </Modal>
            )}
        </div>
    );
}