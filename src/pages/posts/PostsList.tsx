import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePosts } from '@/hooks/usePosts';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import Layout from '@/components/Layout';
import { Post, Permission } from '@/types';

const PostsList = () => {
  const { posts, isLoading } = usePosts();
  const { hasPermission } = useAuth();
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  
  // Применяем фильтры при изменении постов или фильтров
  useEffect(() => {
    if (!posts || posts.length === 0) {
      setFilteredPosts([]);
      return;
    }
    
    let result = [...posts];
    
    // Фильтрация по статусу (показываем только опубликованные)
    result = result.filter(post => post.status === 'published');
    
    // Фильтрация по поисковому запросу
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(post => 
        post.title.toLowerCase().includes(query) || 
        post.content.toLowerCase().includes(query) ||
        post.author.toLowerCase().includes(query)
      );
    }
    
    // Фильтрация по категории
    if (categoryFilter !== 'all') {
      result = result.filter(post => post.category === categoryFilter);
    }
    
    // Сортировка по дате создания (новые сверху)
    result = result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    setFilteredPosts(result);
  }, [posts, searchQuery, categoryFilter]);
  
  // Получить название категории
  const getCategoryName = (category: string): string => {
    const categories: Record<string, string> = {
      'news': 'Новости',
      'report': 'Отчёт',
      'research': 'Исследование',
      'other': 'Прочее'
    };
    return categories[category] || category;
  };
  
  // Получить цвет бейджа для категории
  const getCategoryBadgeColor = (category: string): string => {
    switch (category) {
      case 'news':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'report':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'research':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'other':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Публикации</h1>
      
      {/* Панель фильтров */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <Input
            placeholder="Поиск по заголовку или содержанию..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Фильтр по категории" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все категории</SelectItem>
              <SelectItem value="news">Новости</SelectItem>
              <SelectItem value="report">Отчёты</SelectItem>
              <SelectItem value="research">Исследования</SelectItem>
              <SelectItem value="other">Прочее</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Список публикаций */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-current border-t-transparent"></div>
          <p className="mt-2">Загрузка публикаций...</p>
        </div>
      ) : filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <CardTitle>{post.title}</CardTitle>
                <CardDescription>
                  <div className="flex justify-between items-center">
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    <Badge className={getCategoryBadgeColor(post.category)}>
                      {getCategoryName(post.category)}
                    </Badge>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3 text-sm">{post.content}</p>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Автор: {post.author}</span>
                <Link to={`/posts/${post.id}`}>
                  <Button variant="outline" size="sm">Читать</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-secondary rounded-sm border border-border">
          {searchQuery || categoryFilter !== 'all' ? (
            <p>Публикации не найдены по заданным фильтрам</p>
          ) : (
            <>
              <p className="mb-2">Публикации не найдены</p>
              {hasPermission(Permission.CREATE_POST) && (
                <Link to="/admin/posts/create">
                  <Button>Создать первую публикацию</Button>
                </Link>
              )}
            </>
          )}
        </div>
      )}
    </Layout>
  );
};

export default PostsList;