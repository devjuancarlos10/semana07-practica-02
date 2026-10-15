import { useState, useEffect } from 'react'
import { Search, Filter, ArrowUpDown, Trash, RotateCcw } from 'lucide-react'
import { useDebounce } from '../hooks/useDebounce'

/**
 * TaskFilters Component (Filtros y Búsqueda de LogiTrack)
 * Controla el filtrado por estado de tránsito, modalidad, orden y búsqueda textual con debounce.
 */
const TaskFilters = ({
  filter,
  sort,
  selectedCategory,
  categories = [],
  onFilterChange,
  onSortChange,
  onCategoryChange,
  onSearchChange,
  onClearCompleted,
  onResetTasks,
  hasCompletedTasks = false
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  // Custom hook useDebounce con 250ms para optimizar la entrada del usuario
  const debouncedSearch = useDebounce(searchTerm, 250)

  useEffect(() => {
    onSearchChange(debouncedSearch)
  }, [debouncedSearch, onSearchChange])

  return (
    <div className="card filters-card">
      <div className="filters-top-row">
        {/* Barra de búsqueda con icono y custom hook useDebounce */}
        <div className="search-bar-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por ID (#LT-...), carga o ruta..."
            className="search-input"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="btn-clear-search"
              title="Limpiar búsqueda"
            >
              ✕
            </button>
          )}
        </div>

        {/* Selector de ordenamiento */}
        <div className="sort-selector-wrapper">
          <ArrowUpDown size={16} className="select-icon" />
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="sort-select"
            aria-label="Ordenar despachos"
          >
            <option value="newest">Más Recientes</option>
            <option value="priority">Mayor Urgencia (Express primero)</option>
            <option value="asc">Guía de Remisión (A - Z)</option>
            <option value="desc">Guía de Remisión (Z - A)</option>
            <option value="oldest">Más Antiguos en Tránsito</option>
          </select>
        </div>
      </div>

      <div className="filters-bottom-row">
        {/* Botones de Filtro por Estado Logístico */}
        <div className="status-filter-group">
          <Filter size={16} className="filter-icon" />
          <div className="tab-pills">
            <button
              type="button"
              className={`pill-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => onFilterChange('all')}
            >
              Todos
            </button>
            <button
              type="button"
              className={`pill-btn ${filter === 'pending' ? 'active' : ''}`}
              onClick={() => onFilterChange('pending')}
            >
              🚚 En Tránsito
            </button>
            <button
              type="button"
              className={`pill-btn ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => onFilterChange('completed')}
            >
              ✓ Entregados
            </button>
          </div>
        </div>

        {/* Filtro por Modalidades de Transporte */}
        <div className="category-chips">
          <button
            type="button"
            className={`chip-btn ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => onCategoryChange('all')}
          >
            Todas las Modalidades
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`chip-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => onCategoryChange(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Acciones de gestión masiva de despachos */}
        <div className="filters-actions">
          {hasCompletedTasks && (
            <button
              type="button"
              onClick={onClearCompleted}
              className="btn-action-ghost text-danger"
              title="Archivar todos los despachos entregados"
            >
              <Trash size={14} />
              <span>Archivar Entregados</span>
            </button>
          )}

          <button
            type="button"
            onClick={onResetTasks}
            className="btn-action-ghost"
            title="Restablecer flota al estado de prueba inicial"
          >
            <RotateCcw size={14} />
            <span>Restablecer Flota Demo</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default TaskFilters
