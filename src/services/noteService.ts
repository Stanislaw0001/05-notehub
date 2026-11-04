import axios from 'axios';
import type { Note, NoteTag } from '../types/note';

const NOTES_API_URL = 'https://notehub-public.goit.study/api/notes';

export interface FetchNotesParams {
    page: number;
    perPage: number;
    search?: string;
}

export interface FetchNotesResponse {
    notes: Note[];
    totalPages: number;
}

export interface CreateNoteInput {
    title: string;
    content: string;
    tag: NoteTag;
}

function getAuthHeaders() {
    const token = import.meta.env.VITE_NOTEHUB_TOKEN
        ?.trim()
        .replace(/^Bearer\s+/i, '')
        .trim();

    if (!token) {
        throw new Error('VITE_NOTEHUB_TOKEN is not configured.');
    }

    return {
        Authorization: `Bearer ${token}`,
    };
}

export async function fetchNotes({
    page,
    perPage,
    search,
}: FetchNotesParams): Promise<FetchNotesResponse> {
    const { data } = await axios.get<FetchNotesResponse>(NOTES_API_URL, {
        headers: getAuthHeaders(),
        params: {
            page,
            perPage,
            ...(search ? { search } : {}),
        }
    });

    return data;
}

export async function createNote(note: CreateNoteInput): Promise<Note> {
    const { data } = await axios.post<Note>(NOTES_API_URL, note, {
        headers: getAuthHeaders(),
    });

    return data;
}

export async function deleteNote(noteId: string): Promise<Note> {
    const { data } = await axios.delete<Note>(`${NOTES_API_URL}/${noteId}`, {
        headers: getAuthHeaders(),
    });

    return data;
}