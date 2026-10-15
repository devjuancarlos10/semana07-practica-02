import { useState, useRef, useEffect } from 'react'
import { PlusCircle, Truck, FileText, Flag, Sparkles, MapPin } from 'lucide-react'

/**
 * TaskForm Component (Registro de Despacho de Carga)
 * Demuestra:
 * - useState para el estado local del formulario (UI local)
 * - useRef para auto-focus en el input de título/código al desplegar o enviar
 */
const TaskForm = ({
  onAddTask,
  categories = ['Terrestre', 'Aéreo', 'Marítimo', 'Última Milla', 'Almacén']
}) => {
  // useState para UI local
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('medium')
  const [category, setCategory] = useState(categories[0] || 'Terrestre')
  const [isExpanded, setIsExpanded] = useState(false)
  const [error, setError] = useState('')

  // useRef para manipular el nodo DOM del input sin provocar re-renders
  const titleInputRef = useRef(null)

  // Auto-focus en el input cuando se despliega el formulario
  useEffect(() => {
    if (isExpanded && titleInputRef.current) {
      titleInputRef.current.focus()
    }
  }, [isExpanded])

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!title.trim()) {
      setError('La descripción o código de carga es obligatorio.')
      if (titleInputRef.current) {
        titleInputRef.current.focus()
      }
      return
    }

    onAddTask({
      title: title.trim(),
      description: description.trim(),
      priority,
      category
    })

    // Limpieza de estado local
    setTitle('')
    setDescription('')
    setPriority('medium')
    setError('')
    setIsExpanded(false)

    // Re-enfocar el input con useRef
    if (titleInputRef.current) {
      titleInputRef.current.focus()
    }
  }

  return (
    <div className="card task-form-card">
      <div className="card-header-action" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="card-title-group">
          <Sparkles className="text-accent" size={20} />
          <h3 className="card-title">Programar Nuevo Despacho</h3>
        </div>
        <button
          type="button"
          className="btn-toggle-expand"
          aria-expanded={isExpanded}
        >
          {isExpanded ? 'Contraer' : '+ Desplegar Registro'}
        </button>
      </div>

      {isExpanded && (
        <form onSubmit={handleSubmit} className="task-form animate-fade-in">
          {error && <div className="form-error-alert">{error}</div>}

          <div className="form-group">
            <label htmlFor="task-title" className="form-label">
              <FileText size={16} /> Identificador o Manifiesto de Carga *
            </label>
            <input
              id="task-title"
              ref={titleInputRef}
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                if (error) setError('')
              }}
              placeholder="Ej. Despacho #LT-9410: Lote de Paneles Solares..."
              className={`form-input ${error ? 'input-error' : ''}`}
            />
          </div>

          <div className="form-group">
            <label htmlFor="task-desc" className="form-label">
              <MapPin size={16} /> Ruta de Envío y Especificaciones (Opcional)
            </label>
            <textarea
              id="task-desc"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ej. Ruta Lima - Huancayo | Unidad Frigorífica #12 | Conductor: Carlos M."
              className="form-textarea"
            />
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label htmlFor="task-priority" className="form-label">
                <Flag size={16} /> Nivel de Urgencia
              </label>
              <select
                id="task-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="form-select"
              >
                <option value="low">Económico (🟢)</option>
                <option value="medium">Estándar (🟡)</option>
                <option value="high">Urgente Express (🔴)</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="task-category" className="form-label">
                <Truck size={16} /> Modalidad de Transporte
              </label>
              <select
                id="task-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="form-select"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => {
                setIsExpanded(false)
                setError('')
              }}
              className="btn btn-secondary"
            >
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              <PlusCircle size={18} />
              <span>Programar Despacho</span>
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default TaskForm
