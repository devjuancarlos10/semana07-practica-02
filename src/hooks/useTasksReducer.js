/**
 * Tipos de acción para el reducer de despachos/envíos (Arquitecto de Estado)
 */
export const TASK_ACTIONS = {
  ADD: 'ADD',
  REMOVE: 'REMOVE',
  TOGGLE: 'TOGGLE',
  EDIT: 'EDIT',
  FILTER: 'FILTER',
  SORT: 'SORT',
  SEARCH: 'SEARCH',
  CATEGORY: 'CATEGORY',
  CLEAR_COMPLETED: 'CLEAR_COMPLETED',
  SET_TASKS: 'SET_TASKS',
  RESET: 'RESET'
}

/**
 * Estado inicial con despachos y envíos logísticos representativos
 */
export const initialTasksState = {
  items: [
    {
      id: 'LT-9021',
      title: 'Despacho #LT-9021: Lote de Vacunas y Equipos Médicos',
      description: 'Ruta Lima - Huancayo | Transporte refrigerado con monitoreo térmico a 4°C.',
      completed: false, // En Tránsito
      priority: 'high',  // Urgente
      category: 'Terrestre',
      createdAt: new Date().toISOString()
    },
    {
      id: 'LT-8842',
      title: 'Despacho #LT-8842: Repuestos Críticos para Maquinaria Minera',
      description: 'Envío Aéreo Express a terminal Jauja. Entrega prioritaria en menos de 24 horas.',
      completed: false, // En Tránsito
      priority: 'high',  // Urgente
      category: 'Aéreo',
      createdAt: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 'LT-7320',
      title: 'Despacho #LT-7320: Contenedor de Granos y Materias Primas',
      description: 'Carga marítima consolidada proveniente de Callao. En descarga de almacén central.',
      completed: true,  // Entregado
      priority: 'medium',
      category: 'Marítimo',
      createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 'LT-6415',
      title: 'Despacho #LT-6415: Distribución de Paquetería Última Milla',
      description: 'Ruta urbana distrital (El Tambo - Chilca). 42 paquetes residenciales en curso.',
      completed: false, // En Tránsito
      priority: 'medium',
      category: 'Última Milla',
      createdAt: new Date(Date.now() - 7200000).toISOString()
    },
    {
      id: 'LT-5108',
      title: 'Despacho #LT-5108: Transferencia entre Hubs Logísticos',
      description: 'Reabastecimiento de insumos operativos en Almacén Periférico #3.',
      completed: true,  // Entregado
      priority: 'low',
      category: 'Almacén',
      createdAt: new Date(Date.now() - 172800000).toISOString()
    }
  ],
  filter: 'all', // 'all' (Todos) | 'pending' (En Tránsito) | 'completed' (Entregados)
  sort: 'asc',   // 'asc' | 'desc' | 'priority' | 'newest' | 'oldest'
  search: '',
  selectedCategory: 'all'
}

/**
 * Reducer de Despachos Logísticos (Función Pura con Inmutabilidad Estricta)
 * @param {typeof initialTasksState} state 
 * @param {{ type: string, payload?: any }} action 
 */
export function tasksReducer(state, action) {
  switch (action.type) {
    case TASK_ACTIONS.ADD: {
      const randomCode = Math.floor(1000 + Math.random() * 9000)
      const newTask = {
        id: action.payload.id || `LT-${randomCode}`,
        title: action.payload.title.trim(),
        description: action.payload.description?.trim() || '',
        priority: action.payload.priority || 'medium',
        category: action.payload.category || 'Terrestre',
        completed: false, // Nuevo despacho inicia en tránsito
        createdAt: new Date().toISOString()
      }
      return {
        ...state,
        items: [newTask, ...state.items]
      }
    }

    case TASK_ACTIONS.REMOVE: {
      return {
        ...state,
        items: state.items.filter((task) => task.id !== action.payload)
      }
    }

    case TASK_ACTIONS.TOGGLE: {
      return {
        ...state,
        items: state.items.map((task) =>
          task.id === action.payload
            ? { ...task, completed: !task.completed }
            : task
        )
      }
    }

    case TASK_ACTIONS.EDIT: {
      return {
        ...state,
        items: state.items.map((task) =>
          task.id === action.payload.id
            ? { ...task, ...action.payload }
            : task
        )
      }
    }

    case TASK_ACTIONS.FILTER: {
      return {
        ...state,
        filter: action.payload
      }
    }

    case TASK_ACTIONS.SORT: {
      return {
        ...state,
        sort: action.payload
      }
    }

    case TASK_ACTIONS.SEARCH: {
      return {
        ...state,
        search: action.payload
      }
    }

    case TASK_ACTIONS.CATEGORY: {
      return {
        ...state,
        selectedCategory: action.payload
      }
    }

    case TASK_ACTIONS.CLEAR_COMPLETED: {
      return {
        ...state,
        items: state.items.filter((task) => !task.completed)
      }
    }

    case TASK_ACTIONS.SET_TASKS: {
      return {
        ...state,
        items: Array.isArray(action.payload) ? action.payload : state.items
      }
    }

    case TASK_ACTIONS.RESET: {
      return {
        ...initialTasksState,
        items: initialTasksState.items
      }
    }

    default:
      return state
  }
}

export default tasksReducer
