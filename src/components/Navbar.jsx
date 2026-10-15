import { Sun, Moon, Truck, Radio } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'

/**
 * Navbar Component (LogiTrack Pro)
 * Cabecera corporativa de operaciones logísticas con alternancia de temas mediante useContext
 */
const Navbar = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="app-navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <div className="brand-logo">
            <Truck size={26} className="logo-icon" />
          </div>
          <div className="brand-text">
            <div className="brand-tag-row">
              <span className="brand-institution">LOGITRACK PRO™ • GLOBAL FLEET OPS</span>
              <span className="live-status-badge">
                <Radio size={12} className="live-pulse-icon" /> En Línea
              </span>
            </div>
            <h1 className="brand-title">Centro de Gestión Logística y Despachos</h1>
            <span className="brand-sub">Monitoreo de Flota, Rutas y Control de Cargas en Tiempo Real</span>
          </div>
        </div>

        <div className="navbar-actions">
          {/* Botón de alternancia de tema consumiendo useContext */}
          <button
            type="button"
            onClick={toggleTheme}
            className="theme-toggle-btn"
            title={`Cambiar a ${theme === 'light' ? 'Modo Nocturno (Cabina)' : 'Modo Diurno'}`}
            aria-label="Alternar tema de cabina"
          >
            {theme === 'light' ? (
              <>
                <Moon size={18} className="theme-icon moon-icon" />
                <span className="theme-toggle-label">Modo Nocturno</span>
              </>
            ) : (
              <>
                <Sun size={18} className="theme-icon sun-icon" />
                <span className="theme-toggle-label">Modo Diurno</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar
