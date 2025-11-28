import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  Home, 
  CheckSquare, 
  Repeat, 
  BookOpen, 
  Heart, 
  DollarSign, 
  Briefcase, 
  Trophy, 
  Settings,
  LogOut
} from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/tasks', icon: CheckSquare, label: 'Tarefas' },
    { path: '/habits', icon: Repeat, label: 'Hábitos' },
    { path: '/journal', icon: BookOpen, label: 'Diário' },
    { path: '/health', icon: Heart, label: 'Saúde' },
    { path: '/finances', icon: DollarSign, label: 'Finanças' },
    { path: '/projects', icon: Briefcase, label: 'Projetos' },
    { path: '/rewards', icon: Trophy, label: 'Recompensas' },
    { path: '/settings', icon: Settings, label: 'Configurações' },
  ]

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-gray-800 border-r border-green-500/30 p-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-green-400 font-mono">LIFE OS</h1>
          <p className="text-sm text-gray-400 mt-1">{user?.name}</p>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-md transition-colors ${
                  isActive
                    ? 'bg-green-500/20 text-green-400 border-l-2 border-green-400'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <Icon size={18} />
                <span className="font-mono text-sm">{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-left rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
          >
            <LogOut size={18} />
            <span className="font-mono text-sm">Sair</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="ml-64 min-h-screen">
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout