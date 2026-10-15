import { useState, useEffect, useCallback } from 'react'

/**
 * Custom Hook: useLocalStorage
 * Sincroniza un estado de React con localStorage de forma reactiva y segura.
 * 
 * @param {string} key - Clave con la que se guardará en localStorage
 * @param {any} defaultValue - Valor por defecto si no existe en localStorage
 * @returns {[any, Function]} - [storedValue, setValue]
 */
export const useLocalStorage = (key, defaultValue) => {
  // 1. Inicialización perezosa (lazy initialization) para evitar I/O síncrono en cada render
  const [storedValue, setStoredValue] = useState(() => {
    try {
      if (typeof window === 'undefined') {
        return defaultValue
      }
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.warn(`[useLocalStorage] Error al leer la clave "${key}":`, error)
      return defaultValue
    }
  })

  // 2. Sincronización con localStorage cuando cambia el valor o la clave
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(storedValue))
      }
    } catch (error) {
      console.error(`[useLocalStorage] Error al guardar la clave "${key}":`, error)
    }
  }, [key, storedValue])

  // 3. Sincronización entre pestañas / ventanas (Cross-tab sync) con CLEANUP
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === key && event.newValue !== null) {
        try {
          setStoredValue(JSON.parse(event.newValue))
        } catch (error) {
          console.warn(`[useLocalStorage] Error al sincronizar cambios externos para "${key}":`, error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)

    // Cleanup: Remueve el listener para evitar fugas de memoria (memory leaks)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [key])

  // 4. Setter memoizado con useCallback para evitar re-creación innecesaria
  const setValue = useCallback((value) => {
    setStoredValue((prevValue) => {
      const valueToStore = typeof value === 'function' ? value(prevValue) : value
      return valueToStore
    })
  }, [])

  return [storedValue, setValue]
}

export default useLocalStorage
