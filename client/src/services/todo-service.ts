const API = import.meta.env.VITE_API_URL || 'http://localhost:5140/api/todo'

interface TodoItem {
  id: number
  title: string
  isDone: boolean
}

interface CreateTodoRequest {
  title: string
  isDone?: boolean
}

interface UpdateTodoRequest {
  Title?: string
  IsDone?: boolean
}

export async function fetchTodos(): Promise<TodoItem[]> {
  try {
    const response = await fetch(API)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching todos:', error)
    throw error
  }
}

export async function addTodo(data: CreateTodoRequest): Promise<TodoItem> {
  try {
    const response = await fetch(API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: data.title,
        isDone: data.isDone,
      }),
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error('Error adding todo:', error)
    throw error
  }
}

export async function updateTodo(id: number, data: UpdateTodoRequest): Promise<TodoItem> {
  try {
    // Ensure property names match the backend DTO
    const updateData = {
      Title: data.Title,
      IsDone: data.IsDone,
    }

    const response = await fetch(`${API}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('API - Update failed:', errorData)
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const updatedTodo = await response.json()
    return updatedTodo
  } catch (error) {
    console.error('Error updating todo:', error)
    throw error
  }
}

export async function deleteTodo(id: number): Promise<void> {
  try {
    const response = await fetch(`${API}/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    // DELETE typically returns 204 No Content, so we don't try to parse JSON
  } catch (error) {
    console.error('Error deleting todo:', error)
    throw error
  }
}
