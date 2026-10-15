import { useMemo, useCallback, useRef, useEffect, useState } from 'react'
import TaskItem from './TaskItem'
import { PlusCircle, SearchX, CheckSquare, ListOrdered, Sparkles, Navigation } from 'lucide-react'

/**
 * TaskList Component (Manifiesto de Despachos - LogiTrack)
 * Refactorizado según Guía Práctica Semana 07:
 * 
 * 1. useMemo para filtrar y ordenar despachos sin recalcular en renders ajenos.
 * 2. useCallback para estabilizar handlers pasados a componentes hijos (TaskItem).
 * 3. useRef para auto-focus en el input y acceso directo al nodo DOM sin provocar re-renders.
 * 4. useEffect para enfocar el input cuando cambia la lista de despachos.
 */
const TaskList = ({
  tasks = [],
  filter = 'all',
  sort = 'asc',
  search = '',
  selectedCategory = 'all',
  onRemove,
  onToggle,
  onAddQuickTask
}) => {
  const inputRef = useRef(null)
  const [quickTitle, setQuickTitle] = useState('')

  // 1. useMemo para procesar filtrado y ordenamiento de forma eficiente
  const processedTasks = useMemo(() => {
    let result = [...tasks]

    // Filtro por estado logístico (Todos, En Tránsito [pending], Entregados [completed])
    if (filter === 'pending') {
      result = result.filter((task) => !task.completed)
    } else if (filter === 'completed') {
      result = result.filter((task) => task.completed)
    }

    // Filtro por modalidad de transporte
    if (selectedCategory && selectedCategory !== 'all') {
      result = result.filter((task) => task.category === selectedCategory)
    }

    // Filtro por búsqueda de tracking ID, destino o título
    if (search && search.trim() !== '') {
      const query = search.toLowerCase().trim()
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.id.toLowerCase().includes(query) ||
          (task.description && task.description.toLowerCase().includes(query))
      )
    }

    // Ordenamiento
    const priorityWeights = { high: 3, medium: 2, low: 1 }

    result.sort((a, b) => {
      switch (sort) {
        case 'asc':
          return a.title.localeCompare(b.title)
        case 'desc':
          return b.title.localeCompare(a.title)
        case 'priority':
          return (priorityWeights[b.priority] || 0) - (priorityWeights[a.priority] || 0)
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt)
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt)
        default:
          return 0
      }
    })

    return result
  }, [tasks, filter, sort, search, selectedCategory])

  // 2. useCallback para estabilizar los handlers pasados a los hijos (TaskItem memoizado)
  const handleRemove = useCallback(
    (id) => {
      if (typeof onRemove === 'function') {
        onRemove(id)
      }
    },
    [onRemove]
  )

  const handleToggle = useCallback(
    (id) => {
      if (typeof onToggle === 'function') {
        onToggle(id)
      }
    },
    [onToggle]
  )

  // 3. useEffect con useRef para hacer auto-focus al input tras añadir o alterar despachos
  useEffect(() => {
    if (inputRef.current && document.activeElement !== inputRef.current) {
      inputRef.current.focus()
    }
  }, [tasks.length])

  // Manejo del formulario de creación rápida de despacho
  const handleQuickSubmit = (e) => {
    e.preventDefault()
    if (!quickTitle.trim()) return

    if (typeof onAddQuickTask === 'function') {
      onAddQuickTask({
        title: quickTitle.trim(),
        priority: 'medium',
        category: selectedCategory !== 'all' ? selectedCategory : 'Terrestre'
      })
    }

    setQuickTitle('')
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  return (
    <div className="task-list-container">
      <div className="task-list-header">
        <div className="task-list-header-title">
          <ListOrdered size={20} className="header-icon" />
          <h3>Manifiesto de Despachos Activos ({processedTasks.length} {processedTasks.length === 1 ? 'envío' : 'envíos'})</h3>
        </div>
        <div className="task-list-memo-tag">
          <Sparkles size={14} />
          <span>useMemo & React.memo Activos</span>
        </div>
      </div>

      {/* Formulario de Input Rápido con useRef */}
      <form onSubmit={handleQuickSubmit} className="quick-add-form">
        <div className="quick-add-input-wrapper">
          <Navigation size={18} className="text-accent input-inner-icon" />
          <input
            ref={inputRef}
            type="text"
            value={quickTitle}
            onChange={(e) => setQuickTitle(e.target.value)}
            placeholder="Añadir despacho rápido de carga (auto-focus con useRef)... presiona Enter"
            className="quick-add-input"
          />
          <button
            type="submit"
            className="btn-quick-add"
            disabled={!quickTitle.trim()}
            title="Registrar despacho"
          >
            <PlusCircle size={18} />
            <span>Despachar</span>
          </button>
        </div>
      </form>

      {/* Renderizado de la lista con componentes memoizados */}
      {processedTasks.length > 0 ? (
        <ul className="tasks-grid">
          {processedTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onRemove={handleRemove}
              onToggle={handleToggle}
            />
          ))}
        </ul>
      ) : (
        <div className="empty-state">
          {search || filter !== 'all' || selectedCategory !== 'all' ? (
            <>
              <SearchX size={48} className="empty-icon" />
              <h4>No se encontraron envíos</h4>
              <p>No existen despachos registrados que coincidan con los filtros o código buscado.</p>
            </>
          ) : (
            <>
              <CheckSquare size={48} className="empty-icon" />
              <h4>¡Flota en base sin despachos pendientes!</h4>
              <p>No hay carga activa en ruta. Utiliza el input superior para programar un nuevo despacho.</p>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default TaskList
