<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <h2>Notes</h2>
      <button class="add-btn" @click="onCreate" aria-label="Add note">
        +
      </button>
    </div>
    <div class="search-box">
      <input
        type="text"
        placeholder="Search notes..."
        v-model="searchQuery"
        @input="onSearchInput"
      />
    </div>
    <div class="notes-list">
      <div
        v-for="note in filteredNotes"
        :key="note.id"
        :class="['note-item', {active: note.id === selectedId}]"
        @click="onSelect(note.id)"
        @keydown.enter="onSelect(note.id)"
        tabindex="0"
        :aria-selected="note.id === selectedId"
      >
        <div class="note-title">{{ note.title || 'Untitled Note' }}</div>
        <span
          class="delete-btn"
          title="Delete note"
          @click.stop="onDelete(note.id)"
          >🗑️</span
        >
      </div>
      <div v-if="filteredNotes.length === 0" class="empty-msg">
        No notes found.
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Note {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

const props = defineProps<{
  notes: Note[]
  selectedId: string | null
}>()
const emits = defineEmits(['select', 'create', 'delete', 'search'])

const searchQuery = ref('')
const filteredNotes = computed(() => {
  if (!searchQuery.value) return props.notes
  return props.notes.filter(
    n =>
      n.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const onSelect = (id: string) => emits('select', id)
const onCreate = () => emits('create')
const onDelete = (id: string) => emits('delete', id)
const onSearchInput = () => emits('search', searchQuery.value)

watch(
  () => props.notes,
  () => {
    if (!filteredNotes.value.some(n => n.id === props.selectedId) && filteredNotes.value.length) {
      emits('select', filteredNotes.value[0].id)
    }
  }
)
</script>

<style scoped>
.sidebar {
  width: 100%;
  max-width: 320px;
  background: #fff;
  border-right: 1.5px solid #eee;
  display: flex;
  flex-direction: column;
  height: 100%;
}
.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1.5px solid #f0f0f0;
  background: var(--primary-color, #42b983);
  color: #fff;
}
.sidebar-header h2 {
  font-size: 1.25rem;
  margin: 0;
  font-weight: bold;
  letter-spacing: .5px;
}
.add-btn {
  background: var(--accent-color, #ffeb3b);
  border: none;
  color: var(--secondary-color, #35495e);
  font-size: 1.35rem;
  font-weight: bold;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  cursor: pointer;
  transition: background 0.18s;
  outline: none;
}
.add-btn:hover {
  background: #ffe040;
}
.search-box {
  padding: .7rem 1rem .2rem 1rem;
  border-bottom: 1px solid #f5f5f5;
}
.search-box input {
  width: 100%;
  border: 1px solid #e0e0e0;
  background: #fafafa;
  border-radius: 7px;
  padding: 8px 11px;
  font-size: 1rem;
  outline: none;
}
.notes-list {
  flex: 1 1 auto;
  overflow-y: auto;
  padding: .66rem 0;
}
.note-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: .75rem 1.1rem .75rem 1.25rem;
  cursor: pointer;
  font-size: 1rem;
  border-left: 4px solid transparent;
  transition: background .11s;
}
.note-item.active {
  background: var(--primary-light, #eafaf3);
  border-left: 4px solid var(--primary-color, #42b983);
  color: var(--primary-color, #42b983);
}
.note-item:hover {
  background: #f7f9fb;
}
.note-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1 1 auto;
}
.delete-btn {
  margin-left: 7px;
  color: #ce1d2a;
  font-size: 1.06rem;
  cursor: pointer;
  opacity: .63;
  transition: opacity .16s;
}
.delete-btn:hover {
  opacity: 1;
}
.empty-msg {
  padding: 1rem 1rem 1.5rem 1.2rem;
  color: #999;
  font-style: italic;
  text-align: left;
  font-size: 0.98rem;
}

@media (max-width: 800px) {
  .sidebar {
    max-width: 100vw;
    min-width: 0;
    border-right: none;
    border-bottom: 1.5px solid #eee;
    height: auto;
  }
}
</style>
