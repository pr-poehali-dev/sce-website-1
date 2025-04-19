import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useSCEObjects } from '@/hooks/useSCEObjects';
import { usePosts } from '@/hooks/usePosts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Layout from '@/components/Layout';
import { SCEObject, Post, Permission } from '@/types';

const Home = () => {
  const { isAuthenticated, hasPermission } = useAuth();
  const { objects, isLoading: objectsLoading } = useSCEObjects();
  const { posts, isLoading: postsLoading } = usePosts();
  
  const [latestObjects, setLatestObjects] = useState<SCEObject[]>([]);
  const [latestPosts, setLatestPosts] = useState<Post[]>([]);
  
  useEffect(() => {
    // Загружаем последние активные объекты
    if (!objectsLoading && objects.length > 0) {
      const filteredObjects = objects.filter(obj => obj.status === 'active');
      const sorted = [...filteredObjects].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ).slice(0, 3);
      setLatestObjects(sorted);
    }
  }, [objects, objectsLoading]);
  
  useEffect(() => {
    // Загружаем последние опубликованные посты
    if (!postsLoading && posts.length > 0) {
      const filteredPosts = posts.filter(post => post.status === 'published');
      const sorted = [...filteredPosts].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ).slice(0, 3);
      setLatestPosts(sorted);
    }
  }, [posts, postsLoading]);
  
  // Преобразуем категорию в читаемый вид
  const getCategoryLabel = (category: string): string => {
    const categories: Record<string, string> = {
      'news': 'Новости',
      'report': 'Отчёт',
      'research': 'Исследование',
      'other': 'Прочее'
    };
    return categories[category] || category;
  };
  
  return (
    <Layout>
      {/* Главный баннер */}
      <div className="bg-gradient-to-r from-[#870000] to-[#b01] text-white p-8 mb-8 rounded-sm">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            SCE Foundation
          </h1>
          <p className="text-xl mb-6">
            Secure. Control. Explore.
          </p>
          <p className="mb-6">
            Обеспечение безопасности, контроль аномалий, исследование неизвестного. 
            Защита человечества от того, что находится за гранью понимания.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/objects">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[#b01]">
                Объекты SCE
              </Button>
            </Link>
            {isAuthenticated ? (
              <Link to="/profile">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[#b01]">
                  Мой профиль
                </Button>
              </Link>
            ) : (
              <Link to="/register">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[#b01]">
                  Присоединиться
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
      
      {/* Предупреждение о доступе */}
      <div className="sce-warning mb-8">
        <p>
          ВНИМАНИЕ: Доступ к информации на этом сайте ограничен.
        </p>
        <p className="text-sm">
          Несанкционированное распространение информации преследуется по закону.
        </p>
      </div>
      
      {/* Последние объекты SCE */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Последние объекты SCE</h2>
          <Link to="/objects">
            <Button variant="outline">Все объекты</Button>
          </Link>
        </div>
        
        {objectsLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-current border-t-transparent"></div>
            <p className="mt-2">Загрузка объектов...</p>
          </div>
        ) : latestObjects.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-3">
            {latestObjects.map((object) => (
              <Card key={object.id} className="sce-object">
                <CardHeader className="pb-2">
                  <CardTitle className="sce-object-title">
                    SCE-{object.number}: {object.name}
                  </CardTitle>
                  <CardDescription>
                    Класс: <span className="font-medium">{object.classType}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-3 text-sm">{object.description}</p>
                </CardContent>
                <CardFooter>
                  <Link to={`/objects/${object.id}`} className="w-full">
                    <Button variant="outline" className="w-full">Подробнее</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-secondary rounded-sm border border-border">
            <p className="mb-2">Объекты SCE не найдены</p>
            {isAuthenticated && hasPermission(Permission.CREATE_OBJECT) && (
              <Link to="/admin/objects/create">
                <Button>Создать первый объект SCE</Button>
              </Link>
            )}
          </div>
        )}
      </div>
      
      {/* Последние новости */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Последние публикации</h2>
          <Link to="/posts">
            <Button variant="outline">Все публикации</Button>
          </Link>
        </div>
        
        {postsLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-current border-t-transparent"></div>
            <p className="mt-2">Загрузка публикаций...</p>
          </div>
        ) : latestPosts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-3">
            {latestPosts.map((post) => (
              <Card key={post.id}>
                <CardHeader>
                  <CardTitle>{post.title}</CardTitle>
                  <CardDescription>
                    {new Date(post.createdAt).toLocaleDateString()} • {getCategoryLabel(post.category)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-3 text-sm">{post.content}</p>
                </CardContent>
                <CardFooter>
                  <Link to={`/posts/${post.id}`} className="w-full">
                    <Button variant="outline" className="w-full">Читать далее</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-secondary rounded-sm border border-border">
            <p className="mb-2">Публикации не найдены</p>
            {isAuthenticated && hasPermission(Permission.CREATE_POST) && (
              <Link to="/admin/posts/create">
                <Button>Создать первую публикацию</Button>
              </Link>
            )}
          </div>
        )}
      </div>
      
      {/* О Фонде SCE */}
      <div className="sce-content mb-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-center">О Фонде SCE</h2>
          <p className="mb-4">
            SCE Foundation (Secure. Control. Explore.) - секретная организация, занимающаяся 
            задержанием аномалий, их исследованием и контролем. Наша миссия - защитить человечество 
            от угроз, находящихся за пределами обычного понимания.
          </p>
          <p className="mb-4">
            Вся информация на этом сайте строго засекречена и предназначена только для персонала с 
            соответствующим уровнем допуска. Несанкционированный доступ или распространение 
            информации строго запрещены и преследуются по закону.
          </p>
          <div className="text-center mt-6">
            <Link to="/about">
              <Button>Подробнее о нас</Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
