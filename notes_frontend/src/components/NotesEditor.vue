<template>
  <section class="editor-container" v-if="note">
    <input
      class="note-title-input"
      v-model="editable.title"
      placeholder="Title"
      @input="emitChange"
      :readonly="!isEditing"
      maxlength="64"
      aria-label="Note title"
    />

    <textarea
      class="note-content-input"
      v-model="editable.content"
      placeholder="Your note here..."
      @input="emitChange"
      :readonly="!isEditing"
      aria-label="Note content"
    ></textarea>

    <div class="note-meta">
      <span v-if="note.createdAt">Created: {{ formatDatetime(note.createdAt) }}</span>
      <span v-if="note.updatedAt">Last updated: {{ formatDatetime(note.updatedAt) }}</span>
    </div>
    <div class="editor-actions">
      <button v-if="!isEditing" @click="startEdit" class="action-btn edit-btn" aria-label="Edit note">Edit</button>
      <button v-if="isEditing" @click="onSave" class="action-btn save-btn" aria-label="Save note">Save</button>
      <button v-if="isEditing" @click="onCancel" class="action-btn cancel-btn" aria-label="Cancel edit">Cancel</button>
    </div>
  </section>
  <section class="editor-empty" v-else>
    <div>
      <span class="hint-emoji">📝</span>
      <p>Select or create a note to get started.</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'

interface Note {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

const props = defineProps<{
  note: Note | null
}>()
const emits = defineEmits(['save', 'update', 'editStart', 'cancelEdit'])

const isEditing = reactive({ value: false })
const editable = reactive({ title: '', content: '' })

watch(
  () => props.note,
  note => {
    if (note) {
      editable.title = note.title
      editable.content = note.content
      isEditing.value = false
    } else {
      editable.title = ''
      editable.content = ''
      isEditing.value = false
    }
  },
  { immediate: true }
)

function emitChange() {
  emits('update', { ...editable })
}

function startEdit() {
  isEditing.value = true
  emits('editStart')
}

function onSave() {
  if (!editable.title.trim() && !editable.content.trim()) return
  emits('save', { ...editable })
  isEditing.value = false
}
function onCancel() {
  if (props.note) {
    editable.title = props.note.title
    editable.content = props.note.content
  }
  isEditing.value = false
  emits('cancelEdit')
}

function formatDatetime(dt: string) {
  const date = new Date(dt)
  return date.toLocaleString()
}
</script>

<style scoped>
.editor-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1.8rem 2rem 2.2rem 1.2rem;
  background: #fafbff;
  min-width: 0;
  box-sizing: border-box;
}
.note-title-input {
  font-size: 1.6rem;
  font-weight: bold;
  border: none;
  background: transparent;
  margin-bottom: .7rem;
  color: var(--secondary-color, #35495e);
  outline: none;
  width: 100%;
  max-width: 100%;
  resize: none;
}
.note-title-input:read-only {
  color: #a2a3ac;
}
.note-content-input {
  border: 1.5px solid #e4e8ee;
  border-radius: 9px;
  padding: 1rem;
  font-size: 1.06rem;
  min-height: 200px;
  width: 100%;
  background: #fff;
  margin-bottom: 1.2rem;
  color: var(--secondary-color, #35495e);
  resize: vertical;
}
.note-content-input:read-only {
  background: #f7f8fc;
  color: #a2a3ac;
}
.note-meta {
  font-size: .85rem;
  color: #aaa;
  display: flex;
  gap: 1.2rem;
  margin-top: .12rem;
  margin-bottom: .8rem;
}
.editor-actions {
  margin-top: auto;
  display: flex;
  gap: .7rem;
}
.action-btn {
  padding: .5rem 1.15rem;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background .16s, color .15s;
}
.edit-btn {
  background: var(--primary-color, #42b983);
  color: #fff;
}
.edit-btn:hover {
  background: #36a575;
}
.save-btn {
  background: var(--primary-color, #42b983);
  color: #fff;
}
.save-btn:hover {
  background: #278a60;
}
.cancel-btn {
  background: #eee;
  color: var(--secondary-color, #35495e);
}
.cancel-btn:hover {
  background: #e2e2e2;
}
/* Empty state */
.editor-empty {
  height: 100%;
  width: 100%;
  min-height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #b2b2b2;
  background: #f7f7fa;
  font-size: 1.2rem;
}
.hint-emoji {
  display: block;
  font-size: 2.4rem;
  margin-bottom: .7rem;
  text-align: center;
}
@media (max-width: 800px) {
  .editor-container, .editor-empty {
    padding: 1rem .8rem;
  }
  .note-title-input {
    font-size: 1.2rem;
  }
  .note-content-input {
    font-size: .95rem;
  }
}
</style>
