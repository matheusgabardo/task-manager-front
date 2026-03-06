import { useProjectStore } from '@/stores/projectStore'
import api from '@/services/api'
import type { PaginatedResponse, Project } from '@/types'

export function useProjects() {
  const store = useProjectStore()

  async function fetchProjects() {
    store.setLoading(true)
    store.setError(null)
    try {
      const { data } = await api.get<PaginatedResponse<Project>>('/projects')
      store.setProjects(data.data)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load projects'
      store.setError(message)
    } finally {
      store.setLoading(false)
    }
  }

  async function createProject(payload: { name: string; description?: string; status?: string }) {
    store.setError(null)
    try {
      const { data } = await api.post<{ data: Project }>('/projects', payload)
      store.addProject(data.data)
      return data.data
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create project'
      store.setError(message)
      throw err
    }
  }

  return {
    projects: store.projects,
    loading: store.loading,
    error: store.error,
    fetchProjects,
    createProject,
  }
}
