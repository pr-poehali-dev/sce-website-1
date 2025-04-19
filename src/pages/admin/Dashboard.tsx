import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSCEObjects } from '@/hooks/useSCEObjects';
import { usePosts } from '@/hooks/usePosts';
import { useAuth } from '@/context/AuthContext';

const Dashboard = () => {
  const { objects } = useSCEObjects();
  const { posts } = usePosts();
  const { getAllUsers } = useAuth();
  
  const [stats, setStats] = useState({
    totalObjects: 0,
    totalPosts: 0,
    totalUsers: 0,
    recentActivity: [] as { type: string; title: string; date: string }[]
  });
  
  useEffect(() => {
    // Получаем статистику
    const users = getAllUsers();
    
    // Формируем список последней активности
    const activity: { type: string; title: string; date: string }[] = [
      // Объекты
      ...objects.slice(0, 5).map(obj => ({
        type: 'object',
        title: `SCE-${obj.number}: ${obj.name}`,
        date: obj.createdAt
      })),
      // Посты
      ...posts.slice(0, 5).map(post => ({
        type: 'post',
        title: post.title,
        date: post.createdAt
      }))
    ];
    
    // Сортируем по дате, новые первыми
    const sortedActivity = activity.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ).slice(0, 10);
    
    setStats({
      totalObjects: objects.length,
      totalPosts: posts.length,
      totalUsers: users.length,
      recentActivity: sortedActivity
    });
  }, [objects, posts, getAllUsers]);
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Панель управления</h2>
      
      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Объекты SCE
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalObjects}</div>
            <div className="mt-2">
              <Link to="/admin/objects" className="text-sm text-primary hover:underline">
                Управление объектами
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Публикации
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalPosts}</div>
            <div className="mt-2">
              <Link to="/admin/posts" className="text-sm text-primary hover:underline">
                Управление публикациями
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Пользователи
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalUsers}</div>
            <div className="mt-2">
              <Link to="/admin/users" className="text-sm text-primary hover:underline">
                Управление пользователями
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Последняя активность */}
      <Card>
        <CardHeader>
          <CardTitle>Последняя активность</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.recentActivity.length > 0 ? (
            <ul className="space-y-4">
              {stats.recentActivity.map((item, index) => (
                <li key={index} className="flex justify-between border-b pb-2">
                  <div>
                    <span className="text-xs font-medium capitalize px-2 py-1 rounded-full mr-2 
                      ${item.type === 'object' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}">
                      {item.type === 'object' ? 'Объект' : 'Публикация'}
                    </span>
                    {item.title}
                  </div>
                  <div className="text-muted-foreground text-sm">
                    {new Date(item.date).toLocaleDateString()}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">Нет активности для отображения</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
