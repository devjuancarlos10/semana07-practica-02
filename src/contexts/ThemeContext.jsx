/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useCallback } from 'react'

export const ThemeContext = createContext(null)

const STORAGE_KEY = 'app_theme'

export const ThemeProvider = ({ children }) => {
  // 1. Inicializar estado con localStorage o preferencia del sistema
  const [theme, setTheme] = useState(() => {
    try {
      const savedTheme = localStorage.getItem(STORAGE_KEY)
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme
      }
      if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark'
      }
    } catch (e) {
      console.warn('Error al leer el tema inicial de localStorage:', e)
    }
    return 'light'
  })

  // 2. Función toggleTheme con useCallback para estabilizar la referencia
  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'))
  }, [])

  // 3. useEffect para aplicar clase al <body>, atributo data-theme y persistir en localStorage con CLEANUP
  useEffect(() => {
    const bodyClass = theme === 'dark' ? 'dark' : 'light'
    document.body.classList.remove('light', 'dark')
    document.body.classList.add(bodyClass)
    document.documentElement.setAttribute('data-theme', theme)

    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch (e) {
      console.error('Error al persistir el tema en localStorage:', e)
    }

    // Cleanup: Remueve las clases añadidas si el tema cambia o el componente se desmonta
    return () => {
      document.body.classList.remove(bodyClass)
    }
  }, [theme])

  // 4. useEffect con listener del sistema operativo y CLEANUP
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = (e) => {
      const savedTheme = localStorage.getItem(STORAGE_KEY)
      if (!savedTheme) {
        setTheme(e.matches ? 'dark' : 'light')
      }
    }

    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export { useTheme } from '../hooks/useTheme'
export default ThemeContext
