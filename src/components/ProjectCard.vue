<script setup lang="ts">
import type { Project } from '@/types'

defineProps<{
  project: Project
}>()
</script>

<template>
  <router-link
    :to="`/projects/${project.id}`"
    class="block rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
  >
    <div class="flex items-start justify-between gap-3">
      <h3 class="text-lg font-semibold text-gray-900 truncate">{{ project.name }}</h3>
      <span
        class="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium"
        :class="
          project.status === 'active'
            ? 'bg-green-100 text-green-700'
            : 'bg-gray-100 text-gray-600'
        "
      >
        {{ project.status }}
      </span>
    </div>

    <p v-if="project.description" class="mt-2 text-sm text-gray-500 line-clamp-2">
      {{ project.description }}
    </p>

    <div class="mt-4 flex items-center gap-4 text-xs text-gray-400">
      <span class="flex items-center gap-1">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        {{ project.tasks_count }} {{ project.tasks_count === 1 ? 'task' : 'tasks' }}
      </span>
      <span>
        {{ new Date(project.created_at).toLocaleDateString() }}
      </span>
    </div>
  </router-link>
</template>
