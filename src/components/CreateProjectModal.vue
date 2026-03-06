<script setup lang="ts">
import { ref, reactive } from 'vue'

const emit = defineEmits<{
  close: []
  created: []
}>()

const props = defineProps<{
  open: boolean
  onSubmit: (data: { name: string; description: string; status: string }) => Promise<void>
}>()

const form = reactive({
  name: '',
  description: '',
  status: 'active',
})

const submitting = ref(false)
const errors = ref<Record<string, string[]>>({})

async function handleSubmit() {
  errors.value = {}
  if (!form.name.trim()) {
    errors.value.name = ['Project name is required']
    return
  }

  submitting.value = true
  try {
    await props.onSubmit({ ...form })
    form.name = ''
    form.description = ''
    form.status = 'active'
    emit('created')
    emit('close')
  } catch (err: unknown) {
    if (
      err &&
      typeof err === 'object' &&
      'response' in err &&
      (err as { response?: { data?: { errors?: Record<string, string[]> } } }).response?.data
        ?.errors
    ) {
      errors.value = (
        err as { response: { data: { errors: Record<string, string[]> } } }
      ).response.data.errors
    }
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        @click.self="emit('close')"
      >
        <div class="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
          <h2 class="text-lg font-semibold text-gray-900">New Project</h2>

          <form class="mt-4 space-y-4" @submit.prevent="handleSubmit">
            <div>
              <label for="project-name" class="block text-sm font-medium text-gray-700">
                Name *
              </label>
              <input
                id="project-name"
                v-model="form.name"
                type="text"
                class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                placeholder="My Project"
                autofocus
              />
              <p v-if="errors.name" class="mt-1 text-xs text-red-600">{{ errors.name[0] }}</p>
            </div>

            <div>
              <label for="project-description" class="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="project-description"
                v-model="form.description"
                rows="3"
                class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                placeholder="Brief description..."
              />
              <p v-if="errors.description" class="mt-1 text-xs text-red-600">
                {{ errors.description[0] }}
              </p>
            </div>

            <div>
              <label for="project-status" class="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="project-status"
                v-model="form.status"
                class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div class="flex justify-end gap-3 pt-2">
              <button
                type="button"
                class="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                @click="emit('close')"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="submitting"
                class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {{ submitting ? 'Creating...' : 'Create Project' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
