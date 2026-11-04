import { useFormik } from 'formik';
import * as Yup from 'yup';
import type { CreateNoteInput } from '../../services/noteService';
import { NOTE_TAGS } from '../../types/note';
import css from './NoteForm.module.css';

interface NoteFormProps {
    onCancel: () => void;
    onSubmit: (values: CreateNoteInput) => Promise<void>;
}

const validationSchema = Yup.object({
    title: Yup.string()
        .trim()
        .min(3, 'Title must be at least 3 characters')
        .max(50, 'Title must be at most 50 characters')
        .required('Title is required'),
    content: Yup.string().max(500, 'Content must be at most 500 characters'),
    tag: Yup.string().oneOf(NOTE_TAGS).required('Tag is required'),
});

export default function NoteForm({ onCancel, onSubmit }: NoteFormProps) {
    const formik = useFormik<CreateNoteInput>({
        initialValues: {
            title: '',
            content: '',
            tag: 'Todo',
        },
        validationSchema,
        onSubmit: async (values, { setStatus }) => {
            setStatus(undefined);
            try {
                await onSubmit(values);
            } catch (error) {
                setStatus(
                    error instanceof Error
                        ? `Could not create the note: ${error.message}`
                        : 'Could not create the note. Please try again.'
                );
            }
        },
    });

    return (
        <form className={css.form} onSubmit={formik.handleSubmit}>
            <div className={css.formGroup}>
                <label htmlFor="title">Title</label>
                <input
                    id="title"
                    type="text"
                    name="title"
                    className={css.input}
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                <span className={css.error}>
                    {formik.touched.title ? formik.errors.title : ''}
                </span>
            </div>

            <div className={css.formGroup}>
                <label htmlFor="content">Content</label>
                <textarea
                    id="content"
                    name="content"
                    rows={8}
                    className={css.textarea}
                    value={formik.values.content}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                <span className={css.error}>
                    {formik.touched.content ? formik.errors.content : ''}
                </span>
            </div>

            <div className={css.formGroup}>
                <label htmlFor="tag">Tag</label>
                <select
                    id="tag"
                    name="tag"
                    className={css.select}
                    value={formik.values.tag}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                >
                    {NOTE_TAGS.map(tag => (
                        <option key={tag} value={tag}>
                            {tag}
                        </option>
                    ))}
                </select>
                <span className={css.error}>
                    {formik.touched.tag ? formik.errors.tag : ''}
                </span>
            </div>

            {formik.status && <p className={css.error} role="alert">{formik.status}</p>}

            <div className={css.actions}>
                <button type="button" className={css.cancelButton} onClick={onCancel}>
                    Cancel
                </button>
                <button
                    type="submit"
                    className={css.submitButton}
                    disabled={formik.isSubmitting}
                >
                    Create note
                </button>
            </div>
        </form>
    );
}