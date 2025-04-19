import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Permission } from '@/types';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { isAuthenticated, user, logout, hasPermission } = useAuth();
  const location = useLocation();
  
  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
      {/* Верхний заголовок */}
      <header className="sce-header">
        <div className="sce-container flex justify-between items-center py-2">
          <Link to="/" className="sce-logo">
            SCE Foundation
          </Link>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <span className="text-sm hidden md:inline">
                  {user?.username} ({user?.role})
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={logout}
                  className="text-white border-white hover:bg-white hover:text-black"
                >
                  Выйти
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-white border-white hover:bg-white hover:text-black"
                  >
                    Вход
                  </Button>
                </Link>
                <Link to="/register">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-white border-white hover:bg-white hover:text-black"
                  >
                    Регистрация
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>
      
      {/* Навигационное меню */}
      <nav className="sce-navbar">
        <div className="sce-container">
          <ul className="flex flex-wrap gap-1 py-1">
            <li>
              <Link 
                to="/" 
                className={`px-4 py-2 block hover:bg-black/20 transition-colors ${
                  location.pathname === '/' ? 'bg-black/20' : ''
                }`}
              >
                Главная
              </Link>
            </li>
            <li>
              <Link 
                to="/objects" 
                className={`px-4 py-2 block hover:bg-black/20 transition-colors ${
                  location.pathname.startsWith('/objects') ? 'bg-black/20' : ''
                }`}
              >
                Объекты SCE
              </Link>
            </li>
            <li>
              <Link 
                to="/posts" 
                className={`px-4 py-2 block hover:bg-black/20 transition-colors ${
                  location.pathname.startsWith('/posts') ? 'bg-black/20' : ''
                }`}
              >
                Новости
              </Link>
            </li>
            <li>
              <Link 
                to="/about" 
                className={`px-4 py-2 block hover:bg-black/20 transition-colors ${
                  location.pathname === '/about' ? 'bg-black/20' : ''
                }`}
              >
                О нас
              </Link>
            </li>
            {isAuthenticated && user && (
              <li>
                <Link 
                  to="/profile" 
                  className={`px-4 py-2 block hover:bg-black/20 transition-colors ${
                    location.pathname.startsWith('/profile') ? 'bg-black/20' : ''
                  }`}
                >
                  Профиль
                </Link>
              </li>
            )}
            {isAuthenticated && hasPermission(Permission.MANAGE_USERS) && (
              <li>
                <Link 
                  to="/admin" 
                  className={`px-4 py-2 block hover:bg-black/20 transition-colors ${
                    location.pathname.startsWith('/admin') ? 'bg-black/20' : ''
                  }`}
                >
                  Администрирование
                </Link>
              </li>
            )}
          </ul>
        </div>
      </nav>
      
      {/* Основной контент */}
      <main className="flex-grow py-6">
        <div className="sce-container">
          {children}
        </div>
      </main>
      
      {/* Футер */}
      <footer className="sce-footer mt-auto">
        <div className="sce-container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm">© {new Date().getFullYear()} SCE Foundation - Secure. Control. Explore.</p>
            </div>
            <div className="flex gap-4">
              <Link to="/about" className="text-sm hover:underline">О нас</Link>
              <Link to="/contact" className="text-sm hover:underline">Контакты</Link>
              <Link to="/privacy-policy" className="text-sm hover:underline">Политика конфиденциальности</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
