import type { Note } from '../../types/note';
import css from './NoteList.module.css';

interface NoteListProps {
    notes: Note[];
    onDelete: (noteId: string) => void;
    deleting: boolean;
    deletingNoteId?: string;
}

export default function NoteList({
    notes,
    onDelete,
    deleting,
    deletingNoteId,
}: NoteListProps) {
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
                            disabled={deleting}
                            onClick={() => onDelete(note.id)}
                        >
                            {deleting && deletingNoteId === note.id
                                ? 'Deleting...'
                                : 'Delete'}
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    );
}
