<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useProjectStore } from '@/stores/projectStore'
import { useProjects } from '@/composables/useProjects'
import ProjectCard from '@/components/ProjectCard.vue'
import CreateProjectModal from '@/components/CreateProjectModal.vue'

const store = useProjectStore()
const { projects, loading, error } = storeToRefs(store)
const { fetchProjects, createProject } = useProjects()

const showModal = ref(false)
const successMessage = ref('')

onMounted(() => {
  fetchProjects()
})

async function handleCreate(data: { name: string; description: string; status: string }) {
  await createProject(data)
  successMessage.value = 'Project created successfully!'
  setTimeout(() => {
    successMessage.value = ''
  }, 3000)
}
</script>

<template>
  <div>
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Projects</h1>
        <p class="mt-1 text-sm text-gray-500">Manage your projects and tasks</p>
      </div>
      <button
        class="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        @click="showModal = true"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        New Project
      </button>
    </div>

    <!-- Success toast -->
    <Transition name="toast">
      <div
        v-if="successMessage"
        class="mt-4 rounded-md bg-green-50 border border-green-200 p-3 text-sm text-green-700"
      >
        {{ successMessage }}
      </div>
    </Transition>

    <!-- Error state -->
    <div
      v-if="error"
      class="mt-6 rounded-md bg-red-50 border border-red-200 p-4 text-sm text-red-700"
    >
      <p class="font-medium">Error loading projects</p>
      <p class="mt-1">{{ error }}</p>
      <button
        class="mt-2 text-sm font-medium text-red-700 underline hover:text-red-800"
        @click="fetchProjects()"
      >
        Try again
      </button>
    </div>

    <!-- Loading state -->
    <div v-else-if="loading" class="mt-8 flex justify-center">
      <div class="flex items-center gap-2 text-gray-500">
        <svg class="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        Loading projects...
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-else-if="projects.length === 0"
      class="mt-8 flex flex-col items-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center"
    >
      <svg class="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
        />
      </svg>
      <h3 class="mt-4 text-sm font-medium text-gray-900">No projects yet</h3>
      <p class="mt-1 text-sm text-gray-500">Get started by creating your first project.</p>
      <button
        class="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        @click="showModal = true"
      >
        Create Project
      </button>
    </div>

    <!-- Projects grid -->
    <div v-else class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <ProjectCard v-for="project in projects" :key="project.id" :project="project" />
    </div>

    <CreateProjectModal
      :open="showModal"
      :on-submit="handleCreate"
      @close="showModal = false"
    />
  </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
