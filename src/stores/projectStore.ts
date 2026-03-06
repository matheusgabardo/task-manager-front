import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Project } from '@/types'

export const useProjectStore = defineStore('projects', () => {
  const projects = ref<Project[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  function setProjects(data: Project[]) {
    projects.value = data
  }

  function addProject(project: Project) {
    projects.value.unshift(project)
  }

  function setLoading(value: boolean) {
    loading.value = value
  }

  function setError(value: string | null) {
    error.value = value
  }

  return { projects, loading, error, setProjects, addProject, setLoading, setError }
})
