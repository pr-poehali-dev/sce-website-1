import { useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Permission } from '@/types';

const Admin = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Определяем активную вкладку на основе URL
  const getActiveTab = (): string => {
    const path = location.pathname;
    if (path === '/admin') return 'dashboard';
    if (path.includes('/admin/objects')) return 'objects';
    if (path.includes('/admin/posts')) return 'posts';
    if (path.includes('/admin/users')) return 'users';
    if (path.includes('/admin/roles')) return 'roles';
    return 'dashboard';
  };
  
  // Переключение вкладок
  const handleTabChange = (value: string) => {
    switch (value) {
      case 'dashboard':
        navigate('/admin');
        break;
      case 'objects':
        navigate('/admin/objects');
        break;
      case 'posts':
        navigate('/admin/posts');
        break;
      case 'users':
        navigate('/admin/users');
        break;
      case 'roles':
        navigate('/admin/roles');
        break;
    }
  };
  
  // Перенаправляем на дашборд, если мы на /admin/
  useEffect(() => {
    if (location.pathname === '/admin/') {
      navigate('/admin');
    }
  }, [location.pathname, navigate]);
  
  return (
    <ProtectedRoute requiredPermission={Permission.MANAGE_USERS}>
      <Layout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Панель администратора</h1>
            <Link to="/">
              <Button variant="outline">Вернуться на сайт</Button>
            </Link>
          </div>
          
          <Tabs value={getActiveTab()} onValueChange={handleTabChange}>
            <TabsList className="grid grid-cols-5">
              <TabsTrigger value="dashboard">Дашборд</TabsTrigger>
              <TabsTrigger value="objects">Объекты SCE</TabsTrigger>
              <TabsTrigger value="posts">Публикации</TabsTrigger>
              <TabsTrigger value="users">Пользователи</TabsTrigger>
              <TabsTrigger value="roles">Роли</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="sce-content">
            <Outlet />
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default Admin;
