import React from 'react'
import {
  Trash2,
  CheckCircle2,
  Truck,
  Plane,
  Ship,
  Package,
  Warehouse,
  AlertTriangle,
  Clock,
  MapPin
} from 'lucide-react'

/**
 * TaskItem Component (Despacho / Envío Logístico)
 * Optimizado con React.memo para evitar re-renderizados innecesarios al actualizar otros despachos.
 * Solo se re-renderizará si sus props (task, onRemove, onToggle) cambian de valor o referencia.
 */
const TaskItem = ({ task, onRemove, onToggle }) => {
  // Configuración de modalidad de transporte
  const categoryIcons = {
    Terrestre: Truck,
    Aéreo: Plane,
    Marítimo: Ship,
    'Última Milla': Package,
    Almacén: Warehouse
  }

  const CategoryIcon = categoryIcons[task.category] || Truck

  // Configuración de urgencia/prioridad
  const priorityConfig = {
    high: { label: 'Urgente Express', className: 'badge-priority-high', icon: AlertTriangle },
    medium: { label: 'Estándar', className: 'badge-priority-medium', icon: Clock },
    low: { label: 'Económico', className: 'badge-priority-low', icon: CheckCircle2 }
  }

  const priority = priorityConfig[task.priority] || priorityConfig.medium
  const PriorityIcon = priority.icon

  const formattedDate = new Date(task.createdAt).toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <li className={`task-card ${task.completed ? 'completed' : ''}`}>
      <div className="task-header-row">
        {/* Botón de toggle (Cambiar estado: En Tránsito <-> Entregado) */}
        <button
          type="button"
          onClick={() => onToggle(task.id)}
          className="btn-toggle"
          title={task.completed ? 'Marcar despacho En Tránsito' : 'Confirmar Entrega de Carga'}
          aria-label={task.completed ? 'Entregado' : 'En Tránsito'}
        >
          {task.completed ? (
            <CheckCircle2 className="icon-completed" size={24} />
          ) : (
            <div className="transit-indicator-wrapper" title="En Tránsito">
              <span className="transit-pulse"></span>
              <Truck className="icon-transit" size={20} />
            </div>
          )}
        </button>

        <div className="task-content">
          <div className="task-title-line">
            <span className={`task-title ${task.completed ? 'line-through' : ''}`}>
              {task.title}
            </span>

            {/* Badges de Metadatos Logísticos */}
            <div className="task-badges">
              <span className={`badge ${priority.className}`}>
                <PriorityIcon size={12} />
                {priority.label}
              </span>
              <span className="badge badge-category">
                <CategoryIcon size={12} />
                {task.category}
              </span>
              <span className={`badge ${task.completed ? 'badge-delivered' : 'badge-in-transit'}`}>
                {task.completed ? '✓ Entregado' : '🚚 En Tránsito'}
              </span>
            </div>
          </div>

          {task.description && (
            <p className="task-desc">
              <MapPin size={13} className="desc-pin-icon" />
              {task.description}
            </p>
          )}

          <div className="task-footer">
            <span className="task-date">
              <Clock size={12} />
              Registro: {formattedDate}
            </span>
            <span className="tracking-id-pill">ID: {task.id}</span>
          </div>
        </div>

        {/* Botón de cancelación / eliminación de despacho */}
        <button
          type="button"
          onClick={() => onRemove(task.id)}
          className="btn-remove"
          title="Eliminar registro de despacho"
          aria-label="Eliminar despacho"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </li>
  )
}

// React.memo asegura que TaskItem solo re-renderice si cambian task, onRemove o onToggle.
// En combinación con useCallback en el componente padre, evita re-renders innecesarios.
export default React.memo(TaskItem)
