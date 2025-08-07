export interface Note {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

const NOTES_KEY = 'vue-notes-app-v2'

export function listNotes(): Note[] {
  const notes = localStorage.getItem(NOTES_KEY)
  if (!notes) return []
  try {
    return JSON.parse(notes)
  } catch {
    return []
  }
}

export function saveNotes(notes: Note[]) {
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes))
}

export function getNote(id: string): Note | null {
  return listNotes().find(n => n.id === id) || null
}

// PUBLIC_INTERFACE
export function createNote(): Note {
  const now = new Date().toISOString()
  return {
    id: uuidv4(),
    title: '',
    content: '',
    createdAt: now,
    updatedAt: now,
  }
}

// PUBLIC_INTERFACE
export function updateNote(id: string, data: {title: string, content: string}) {
  let notes = listNotes()
  notes = notes.map(n =>
    n.id === id
      ? { ...n, ...data, updatedAt: new Date().toISOString() }
      : n
  )
  saveNotes(notes)
}

// PUBLIC_INTERFACE
export function addNote(note: Note) {
  const notes = [note, ...listNotes()]
  saveNotes(notes)
}

// PUBLIC_INTERFACE
export function deleteNote(id: string) {
  const notes = listNotes().filter(n => n.id !== id)
  saveNotes(notes)
}

// Simple UUID generator (v4)
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
