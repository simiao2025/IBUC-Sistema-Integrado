import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  LogOut, 
  BookOpen, 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  Settings 
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { profile, signOut, isStaff } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const NavItem = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => (
    <Link
      to={to}
      onClick={() => setSidebarOpen(false)}
      className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
        isActive(to)
          ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-700'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      <Icon className="w-5 h-5 mr-3" />
      {label}
    </Link>
  );

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-200 lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <span className="text-xl font-bold text-blue-800">IBUC System</span>
          <button 
            className="lg:hidden text-gray-500"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-col justify-between h-[calc(100%-4rem)]">
          <nav className="mt-6 space-y-1">
            {isStaff ? (
              // Admin/Staff Menu
              <>
                <div className="px-6 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Administrativo
                </div>
                <NavItem to="/admin" icon={LayoutDashboard} label="Dashboard" />
                <NavItem to="/admin/courses" icon={BookOpen} label="Gerenciar Cursos" />
                <NavItem to="/admin/students" icon={Users} label="Gerenciar Alunos" />
              </>
            ) : (
              // Student Menu
              <>
                <div className="px-6 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Área do Aluno
                </div>
                <NavItem to="/student" icon={LayoutDashboard} label="Meu Painel" />
                <NavItem to="/student/catalog" icon={BookOpen} label="Catálogo de Cursos" />
              </>
            )}
          </nav>

          <div className="p-4 border-t">
             <div className="flex items-center mb-4 px-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                    {profile?.full_name?.charAt(0) || 'U'}
                </div>
                <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700 truncate w-32">{profile?.full_name}</p>
                    <p className="text-xs text-gray-500 capitalize">{profile?.role}</p>
                </div>
             </div>
            <button
              onClick={signOut}
              className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sair
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between h-16 px-6 bg-white shadow-sm lg:hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-500 hover:text-gray-700"
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="text-lg font-semibold text-gray-800">Portal</span>
            <div className="w-6" /> {/* Spacer */}
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;