<template>
  <div class="main-app-layout">
    <NotesSidebar
      :notes="filteredNotes"
      :selectedId="selectedId"
      @select="onSelect"
      @create="onCreate"
      @delete="onDelete"
      @search="onSearch"
    />
    <div class="main-content">
      <NotesEditor
        :note="selectedNote"
        @save="onSave"
        @update="onEditorUpdate"
        @editStart="onEditStart"
        @cancelEdit="onCancelEdit"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import NotesSidebar from '@/components/NotesSidebar.vue'
import NotesEditor from '@/components/NotesEditor.vue'
import {
  listNotes,
  createNote,
  addNote,
  updateNote,
  deleteNote as lsDeleteNote,
} from '@/utils/notesStorage'
import type { Note } from '@/utils/notesStorage'

const notes = ref<Note[]>([])
const selectedId = ref<string | null>(null)
const selectedNote = computed(() => notes.value.find(n => n.id === selectedId.value) || null)
const searchText = ref('')
const isDirty = ref(false)

function refreshNotes() {
  notes.value = listNotes()
}
refreshNotes()

// preserve selected note if possible, else pick first note
watch(
  notes,
  () => {
    if (notes.value.length === 0) {
      selectedId.value = null
    } else if (!notes.value.some(n => n.id === selectedId.value)) {
      selectedId.value = notes.value[0].id
    }
  },
  { immediate: true }
)

// Search
const filteredNotes = computed(() => {
  if (!searchText.value) return notes.value
  const text = searchText.value.toLowerCase()
  return notes.value.filter(
    n =>
      n.title.toLowerCase().includes(text) ||
      n.content.toLowerCase().includes(text)
  )
})
function onSearch(val: string) {
  searchText.value = val
}

// Sidebar actions
function onSelect(id: string) {
  // If editing, confirm change
  if (isDirty.value) {
    if (!window.confirm('You have unsaved changes. Switch note and discard them?')) return
  }
  selectedId.value = id
  isDirty.value = false
}
function onCreate() {
  // If editing, confirm
  if (isDirty.value) {
    if (!window.confirm('You have unsaved changes. Create new note anyway?')) return
  }
  const n = createNote()
  addNote(n)
  refreshNotes()
  selectedId.value = n.id
  isDirty.value = false
}
// Editor actions
function onDelete(id: string) {
  if (window.confirm('Do you really want to delete this note?')) {
    lsDeleteNote(id)
    refreshNotes()
    if (!notes.value.some(n => n.id === selectedId.value)) {
      selectedId.value = notes.value.length ? notes.value[0].id : null
    }
    isDirty.value = false
  }
}
function onSave(data: { title: string; content: string }) {
  if (!selectedNote.value) return
  updateNote(selectedNote.value.id, data)
  refreshNotes()
  isDirty.value = false
}
function onEditorUpdate() {
  isDirty.value = true
}
function onEditStart() {
  isDirty.value = true
}
function onCancelEdit() {
  isDirty.value = false
}

</script>

<style scoped>
.main-app-layout {
  display: flex;
  min-height: 90vh;
  height: 80vh;
  background: #f5faff;
  border-radius: 17px;
  box-shadow: 0 1.5px 18px rgba(53, 73, 94, 0.08);
  overflow: hidden;
  margin: 1.6rem 0 2.4rem 0;
}
.main-content {
  flex: 1 1 0;
  display: flex;
  width: 100%;
  height: 100%;
  background: #fafbff;
}
@media (max-width: 800px) {
  .main-app-layout {
    flex-direction: column;
    min-height: 0;
    height: auto;
    margin: .6rem 0;
    border-radius: 0;
  }
  .main-content {
    padding: 0;
    min-height: 340px;
  }
}
</style>
