import { useState, useEffect } from 'react'

/**
 * Custom Hook: useDebounce
 * Retrasa la actualización de un valor hasta que haya transcurrido un periodo de inactividad.
 * 
 * @param {any} value - El valor a retrasar
 * @param {number} delay - Milisegundos de espera (por defecto 300ms)
 * @returns {any} - El valor debounced
 */
export const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    // Configura el temporizador para actualizar el valor debounced
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Cleanup: Se ejecuta al cambiar `value` o `delay`, o si el componente se desmonta.
    // Esto previene memory leaks y condiciones de carrera (race conditions).
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export default useDebounce
