import { useContext } from 'react'
import { ThemeContext } from '../contexts/ThemeContext'

/**
 * Custom Hook: useTheme
 * Facilita el acceso seguro al contexto de tema.
 */
export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme debe ser utilizado dentro de un ThemeProvider')
  }
  return context
}

export default useTheme
