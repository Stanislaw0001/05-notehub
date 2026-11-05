import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Note } from '../../types/note';
import { deleteNote } from '../../services/noteService';
import css from './NoteList.module.css';

interface NoteListProps {
    notes: Note[];
    page: number;
    setPage: (page: number) => void;
}

export default function NoteList({ notes, page, setPage }: NoteListProps) {
    const queryClient = useQueryClient();

    const { mutate, isPending, variables } = useMutation({
        mutationFn: (noteId: string) => deleteNote(noteId),
        onSuccess: async () => {
            if (notes.length === 1 && page > 1) {
                setPage(page - 1);
            }
            await queryClient.invalidateQueries({ queryKey: ['notes'] });
        },
        onError: (error) => {
            console.error('Помилка при видаленні нотатки:', error);
        },
    });

    return (
        <ul className={css.list}>
            {notes.map(note => (
                <li className={css.listItem} key={note.id}>
                    <h2 className={css.title}>{note.title}</h2>
                    <p className={css.content}>{note.content}</p>
                    <div className={css.footer}>
                        <span className={css.tag}>{note.tag}</span>
                        <button
                            className={css.button}
                            type="button"
                            disabled={isPending}
                            onClick={() => mutate(note.id)}
                        >
                            {isPending && variables === note.id
                                ? 'Deleting...'
                                : 'Delete'}
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    );
}