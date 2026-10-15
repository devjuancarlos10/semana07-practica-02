import { useReducer, useContext, useEffect, useCallback, useState } from 'react'
import tasksReducer, { initialTasksState, TASK_ACTIONS } from './hooks/useTasksReducer'
import { ThemeProvider, ThemeContext } from './contexts/ThemeContext'
import Navbar from './components/Navbar'
import StatsOverview from './components/StatsOverview'
import TaskForm from './components/TaskForm'
import TaskFilters from './components/TaskFilters'
import TaskList from './components/TaskList'
import ProfilerMonitor from './components/ProfilerMonitor'
import { Truck, ShieldCheck, Activity } from 'lucide-react'

const STORAGE_TASKS_KEY = 'logitrack_fleet_tasks'

/**
 * Inicializador perezoso para useReducer:
 * Lee de localStorage de forma segura al inicio, evitando re-renders o efectos con dependencias faltantes.
 */
const initTasksState = (initial) => {
  try {
    if (typeof window !== 'undefined') {
      const saved = window.localStorage.getItem(STORAGE_TASKS_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          return { ...initial, items: parsed }
        }
      }
    }
  } catch (error) {
    console.warn('Error al recuperar despachos desde localStorage:', error)
  }
  return initial
}

/**
 * Dashboard Component
 * Maneja el estado complejo mediante useReducer y el contexto de temas mediante useContext.
 */
const Dashboard = () => {
  // 1. Estado Complejo con useReducer e inicialización perezosa
  const [state, dispatch] = useReducer(tasksReducer, initialTasksState, initTasksState)

  // 2. useContext para el tema claro/oscuro
  const { theme } = useContext(ThemeContext)

  // 3. useState para UI local (pestaña activa del panel)
  const [activeTab, setActiveTab] = useState('tasks') // 'tasks' | 'audit'

  // 4. useEffect para persistir los despachos en localStorage con cada cambio de state.items
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_TASKS_KEY, JSON.stringify(state.items))
      }
    } catch (error) {
      console.error('Error al guardar despachos en localStorage:', error)
    }
  }, [state.items])

  // ========================================================
  // Handlers estabilizados con useCallback (Optimizador)
  // ========================================================
  const handleAddTask = useCallback((taskData) => {
    dispatch({ type: TASK_ACTIONS.ADD, payload: taskData })
  }, [])

  const handleRemoveTask = useCallback((id) => {
    dispatch({ type: TASK_ACTIONS.REMOVE, payload: id })
  }, [])

  const handleToggleTask = useCallback((id) => {
    dispatch({ type: TASK_ACTIONS.TOGGLE, payload: id })
  }, [])

  const handleFilterChange = useCallback((filter) => {
    dispatch({ type: TASK_ACTIONS.FILTER, payload: filter })
  }, [])

  const handleSortChange = useCallback((sort) => {
    dispatch({ type: TASK_ACTIONS.SORT, payload: sort })
  }, [])

  const handleCategoryChange = useCallback((category) => {
    dispatch({ type: TASK_ACTIONS.CATEGORY, payload: category })
  }, [])

  const handleSearchChange = useCallback((search) => {
    dispatch({ type: TASK_ACTIONS.SEARCH, payload: search })
  }, [])

  const handleClearCompleted = useCallback(() => {
    dispatch({ type: TASK_ACTIONS.CLEAR_COMPLETED })
  }, [])

  const handleResetTasks = useCallback(() => {
    dispatch({ type: TASK_ACTIONS.RESET })
  }, [])

  // Modalidades de transporte para la flota
  const availableCategories = ['Terrestre', 'Aéreo', 'Marítimo', 'Última Milla', 'Almacén']

  return (
    <div className={`dashboard-root ${theme}`}>
      <Navbar />

      <main className="dashboard-content">
        {/* Barra de navegación de pestañas (Estado UI Local con useState) */}
        <div className="tab-navigation-bar">
          <div className="tab-buttons">
            <button
              type="button"
              className={`nav-tab-btn ${activeTab === 'tasks' ? 'active' : ''}`}
              onClick={() => setActiveTab('tasks')}
            >
              <Truck size={18} />
              <span>Flota & Despachos en Ruta</span>
            </button>
            <button
              type="button"
              className={`nav-tab-btn ${activeTab === 'audit' ? 'active' : ''}`}
              onClick={() => setActiveTab('audit')}
            >
              <ShieldCheck size={18} />
              <span>Auditoría de Hooks & Profiler (Entregable 2)</span>
            </button>
          </div>

          <div className="tab-hint">
            <Activity size={14} className="text-accent" />
            <span>Sistema Operativo Logístico Activo</span>
          </div>
        </div>

        {/* Resumen de Métricas Operativas (optimizado con useMemo) */}
        <StatsOverview items={state.items} />

        {activeTab === 'tasks' ? (
          <div className="dashboard-main-grid">
            {/* Columna Izquierda: Programar Despacho y Filtros */}
            <aside className="dashboard-sidebar">
              <TaskForm onAddTask={handleAddTask} categories={availableCategories} />
              <TaskFilters
                filter={state.filter}
                sort={state.sort}
                selectedCategory={state.selectedCategory}
                categories={availableCategories}
                onFilterChange={handleFilterChange}
                onSortChange={handleSortChange}
                onCategoryChange={handleCategoryChange}
                onSearchChange={handleSearchChange}
                onClearCompleted={handleClearCompleted}
                onResetTasks={handleResetTasks}
                hasCompletedTasks={state.items.some((t) => t.completed)}
              />
            </aside>

            {/* Columna Derecha: Manifiesto de Despachos (useMemo, useCallback, useRef) */}
            <section className="dashboard-list-section">
              <TaskList
                tasks={state.items}
                filter={state.filter}
                sort={state.sort}
                search={state.search}
                selectedCategory={state.selectedCategory}
                onRemove={handleRemoveTask}
                onToggle={handleToggleTask}
                onAddQuickTask={handleAddTask}
              />
            </section>
          </div>
        ) : (
          <div className="dashboard-audit-section animate-fade-in">
            <ProfilerMonitor />
          </div>
        )}
      </main>

      <footer className="dashboard-footer">
        <div className="footer-content">
          <p>
            © {new Date().getFullYear()} LogiTrack Pro™ — Centro de Operaciones y Logística Global.
          </p>
          <p className="footer-sub">
            Arquitectura de Estado Complejo con React Hooks (useReducer, useContext, useMemo, useCallback, useRef, custom hooks).
          </p>
        </div>
      </footer>
    </div>
  )
}

/**
 * Componente Raíz envuelto con ThemeProvider
 */
export default function App() {
  return (
    <ThemeProvider>
      <Dashboard />
    </ThemeProvider>
  )
}
