export interface Project {
  id: number
  name: string
  description: string | null
  status: 'active' | 'archived'
  tasks_count: number
  created_at: string
}

export interface Task {
  id: number
  project_id: number
  title: string
  description: string | null
  status: 'todo' | 'in_progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  due_date: string | null
  is_overdue: boolean
  created_at: string
}

export interface TaskFilters {
  status?: Task['status']
  priority?: Task['priority']
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    next_cursor: string | null
    prev_cursor: string | null
  }
}
