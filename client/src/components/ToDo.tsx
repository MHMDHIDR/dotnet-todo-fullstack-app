import { useState, useEffect } from 'react'
import { Check, Plus, Edit2, Trash2, Loader2 } from 'lucide-react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { fetchTodos, addTodo, updateTodo, deleteTodo } from '../services/todo-service'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './ui/drawer'

interface Task {
  id: number
  text: string
  completed: boolean
}

export default function ToDo() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState('')
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const completedCount = tasks.filter(task => task.completed).length
  const totalCount = tasks.length

  useEffect(() => {
    loadTodos()
  }, [])

  const loadTodos = async () => {
    try {
      setLoading(true)
      setError(null)
      const todos = await fetchTodos()
      const mappedTasks: Task[] = todos.map(todo => ({
        id: todo.id,
        text: todo.title,
        completed: todo.isDone,
      }))
      setTasks(mappedTasks)
    } catch (err) {
      setError('Failed to load todos. Please try again.')
      console.error('Error loading todos:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddTask = async () => {
    if (newTask.trim()) {
      try {
        setError(null)
        const todo = await addTodo({
          title: newTask.trim(),
          isDone: false,
        })
        const newTaskItem: Task = {
          id: todo.id,
          text: todo.title,
          completed: todo.isDone,
        }
        setTasks([...tasks, newTaskItem])
        setNewTask('')
        setDrawerOpen(false)
      } catch (err) {
        setError('Failed to add task. Please try again.')
        console.error('Error adding task:', err)
      }
    }
  }

  const toggleTask = async (id: number) => {
    const task = tasks.find(t => t.id === id)
    if (!task) return

    try {
      setError(null)
      const updatedTodo = await updateTodo(id, {
        IsDone: !task.completed,
      })

      const updatedTasks = tasks.map(task =>
        task.id === id
          ? {
              ...task,
              completed: updatedTodo.isDone,
              text: updatedTodo.title,
            }
          : task
      )
      setTasks(updatedTasks)
    } catch (err) {
      setError('Failed to update task. Please try again.')
      console.error('Error updating task:', err)
    }
  }

  const handleEditTask = async () => {
    if (editingTask && editingTask.text.trim()) {
      try {
        setError(null)
        const updatedTodo = await updateTodo(editingTask.id, {
          Title: editingTask.text.trim(),
        })
        setTasks(
          tasks.map(task =>
            task.id === editingTask.id
              ? {
                  ...task,
                  text: updatedTodo.title,
                  completed: updatedTodo.isDone,
                }
              : task
          )
        )
        setEditingTask(null)
        setDrawerOpen(false)
      } catch (err) {
        setError('Failed to update task. Please try again.')
        console.error('Error updating task:', err)
      }
    }
  }

  const deleteTask = async (id: number) => {
    try {
      setError(null)
      await deleteTodo(id)
      setTasks(tasks.filter(task => task.id !== id))
    } catch (err) {
      setError('Failed to delete task. Please try again.')
      console.error('Error deleting task:', err)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6 w-full'>
      <div className='max-w-screen-md mx-auto'>
        <h1 className='text-3xl font-bold text-center my-10'>To Do List</h1>
        <div className='flex items-center justify-between mb-8 backdrop-blur-lg bg-white/10 p-6 rounded-2xl border border-white/20'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 bg-white/20 backdrop-blur-lg rounded-xl flex items-center justify-center'>
              <Check className='w-6 h-6 text-white' />
            </div>
            <h1 className='text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent'>
              Tasks
            </h1>
          </div>
          <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
            <DrawerTrigger asChild>
              <Button
                onClick={() => {
                  setEditingTask(null)
                  setNewTask('')
                }}
                className='bg-white/20 hover:bg-white/30 backdrop-blur-lg rounded-xl w-10 h-10 p-0'
              >
                <Plus className='w-5 h-5' />
              </Button>
            </DrawerTrigger>
            <DrawerContent className='bg-gray-900/95 backdrop-blur-xl border-t border-white/20'>
              <div className='mx-auto w-full max-w-sm'>
                <DrawerHeader>
                  <DrawerTitle className='text-white text-xl'>
                    {editingTask ? 'Edit Task' : 'Add New Task'}
                  </DrawerTitle>
                  <DrawerDescription className='text-gray-400'>
                    {editingTask
                      ? 'Update your task details below'
                      : 'Enter your new task details below'}
                  </DrawerDescription>
                </DrawerHeader>
                <div className='p-4'>
                  <Input
                    value={editingTask ? editingTask.text : newTask}
                    onChange={e =>
                      editingTask
                        ? setEditingTask({ ...editingTask, text: e.target.value })
                        : setNewTask(e.target.value)
                    }
                    placeholder='Enter task description'
                    className='bg-white/10 border-white/20 text-white placeholder-gray-400'
                  />
                </div>
                <DrawerFooter>
                  <Button
                    onClick={editingTask ? handleEditTask : handleAddTask}
                    className='bg-white/20 hover:bg-white/30 text-white'
                  >
                    {editingTask ? 'Save Changes' : 'Add Task'}
                  </Button>
                  <DrawerClose asChild>
                    <Button
                      variant='outline'
                      className='border-white/20 text-white hover:bg-white/10'
                    >
                      Cancel
                    </Button>
                  </DrawerClose>
                </DrawerFooter>
              </div>
            </DrawerContent>
          </Drawer>
        </div>

        {error && (
          <div className='backdrop-blur-lg bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6'>
            <p className='text-red-400'>{error}</p>
            <Button
              onClick={loadTodos}
              className='mt-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 text-sm px-3 py-1 h-auto'
            >
              Retry
            </Button>
          </div>
        )}

        <div className='backdrop-blur-lg bg-white/10 rounded-2xl p-6 mb-6 border border-white/20'>
          <div className='flex items-center justify-between'>
            <div>
              <h2 className='text-xl font-semibold mb-1'>Progress</h2>
              <p className='text-gray-400'>Keep it up!</p>
            </div>
            <div className='w-16 h-16 bg-white/20 backdrop-blur-lg rounded-xl flex items-center justify-center'>
              {loading ? (
                <Loader2 className='w-6 h-6 text-white animate-spin' />
              ) : (
                <span className='text-white font-bold text-lg'>
                  {completedCount}/{totalCount}
                </span>
              )}
            </div>
          </div>
        </div>

        {loading && tasks.length === 0 ? (
          <div className='text-center text-gray-400 py-12'>
            <Loader2 className='w-8 h-8 animate-spin mx-auto mb-4' />
            <p>Loading your tasks...</p>
          </div>
        ) : (
          <div className='space-y-3'>
            {tasks.map(task => (
              <div
                key={task.id}
                className='backdrop-blur-lg bg-white/10 rounded-xl p-4 border border-white/20 flex items-center gap-4 group hover:bg-white/[0.15] transition-all duration-200'
              >
                <button
                  onClick={() => toggleTask(task.id)}
                  disabled={loading}
                  className={`w-6 h-6 cursor-pointer rounded-lg border-2 flex items-center justify-center transition-colors ${
                    task.completed
                      ? 'bg-white/20 border-white/20'
                      : 'border-white/20 hover:border-white/40'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {task.completed && <Check className='w-4 h-4 text-white' />}
                </button>

                <span
                  className={`flex-1 transition-all duration-200 ${
                    task.completed
                      ? 'line-through text-gray-400 opacity-75'
                      : 'text-white'
                  }`}
                >
                  {task.text}
                </span>

                <div className='flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity'>
                  <Button
                    onClick={() => {
                      setEditingTask(task)
                      setDrawerOpen(true)
                    }}
                    variant='ghost'
                    size='sm'
                    className='text-white/60 hover:text-white hover:bg-white/10 p-1 h-8 w-8'
                    disabled={loading}
                  >
                    <Edit2 className='w-4 h-4' />
                  </Button>
                  <Button
                    onClick={() => deleteTask(task.id)}
                    variant='ghost'
                    size='sm'
                    className='text-white/60 hover:text-red-400 hover:bg-red-500/10 p-1 h-8 w-8'
                    disabled={loading}
                  >
                    <Trash2 className='w-4 h-4' />
                  </Button>
                </div>
              </div>
            ))}

            {tasks.length === 0 && !loading && (
              <div className='text-center text-gray-400 py-12 backdrop-blur-lg bg-white/10 rounded-xl border border-white/20'>
                <p>No tasks yet. Add one to get started!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
