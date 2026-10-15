import { useMemo } from 'react'
import { CheckCircle2, Truck, AlertTriangle, BarChart3, Navigation } from 'lucide-react'

/**
 * StatsOverview Component (KPIs de Flota LogiTrack)
 * Utiliza useMemo para calcular métricas operativas de despachos únicamente cuando cambia el listado.
 */
const StatsOverview = ({ items = [] }) => {
  const stats = useMemo(() => {
    const total = items.length
    const completed = items.filter((item) => item.completed).length
    const pending = total - completed
    const highPriority = items.filter((item) => item.priority === 'high' && !item.completed).length
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

    return {
      total,
      completed,
      pending,
      highPriority,
      percentage
    }
  }, [items])

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-header">
          <span className="stat-label">Carga Total en Sistema</span>
          <div className="stat-icon-wrapper icon-total">
            <BarChart3 size={20} />
          </div>
        </div>
        <div className="stat-value">{stats.total}</div>
        <div className="stat-footer text-muted">Despachos registrados</div>
      </div>

      <div className="stat-card">
        <div className="stat-header">
          <span className="stat-label">En Tránsito Activo</span>
          <div className="stat-icon-wrapper icon-pending">
            <Truck size={20} />
          </div>
        </div>
        <div className="stat-value text-warning">{stats.pending}</div>
        <div className="stat-footer text-muted">Unidades navegando en ruta</div>
      </div>

      <div className="stat-card">
        <div className="stat-header">
          <span className="stat-label">Entregas Completadas</span>
          <div className="stat-icon-wrapper icon-completed">
            <CheckCircle2 size={20} />
          </div>
        </div>
        <div className="stat-value text-success">{stats.completed}</div>
        <div className="stat-footer text-muted">{stats.percentage}% de efectividad</div>
      </div>

      <div className="stat-card">
        <div className="stat-header">
          <span className="stat-label">Cargas Urgentes Express</span>
          <div className="stat-icon-wrapper icon-alert">
            <AlertTriangle size={20} />
          </div>
        </div>
        <div className="stat-value text-danger">{stats.highPriority}</div>
        <div className="stat-footer text-muted">Prioridad crítica en monitoreo</div>
      </div>

      {/* Barra de progreso de entregas logísticas */}
      <div className="stat-progress-bar-card">
        <div className="progress-info">
          <span className="progress-title-flex">
            <Navigation size={16} className="text-accent" />
            Tasa de Cumplimiento Logístico Global (SLA)
          </span>
          <span className="progress-percentage">{stats.percentage}%</span>
        </div>
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${stats.percentage}%` }}
          />
        </div>
      </div>
    </div>
  )
}

export default StatsOverview
