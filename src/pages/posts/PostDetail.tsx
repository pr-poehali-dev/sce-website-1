import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { usePosts } from '@/hooks/usePosts';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertCircle } from 'lucide-react';
import Layout from '@/components/Layout';
import { Permission } from '@/types';

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { getPostById } = usePosts();
  const { hasPermission } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!id) {
      setError('Идентификатор публикации не указан');
      setIsLoading(false);
      return;
    }
    
    const fetchPost = () => {
      try {
        const foundPost = getPostById(id);
        
        if (!foundPost) {
          setError('Публикация не найдена');
        } else if (foundPost.status !== 'published') {
          setError('Эта публикация недоступна для просмотра');
        } else {
          setPost(foundPost);
        }
      } catch (err) {
        console.error('Ошибка при загрузке публикации:', err);
        setError('Ошибка при загрузке публикации');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPost();
  }, [id, getPostById]);
  
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
  
  // Получить цвет для категории
  const getCategoryColor = (category: string): string => {
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
  
  if (isLoading) {
    return (
      <Layout>
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-current border-t-transparent"></div>
          <p className="mt-2">Загрузка публикации...</p>
        </div>
      </Layout>
    );
  }
  
  if (error || !post) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto text-center py-12">
          <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
          <h1 className="text-2xl font-bold mb-4">Ошибка</h1>
          <p className="text-muted-foreground mb-6">{error || 'Публикация не найдена'}</p>
          <Button onClick={() => navigate('/posts')}>
            Вернуться к списку публикаций
          </Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto sce-content">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">{post.title}</h1>
            <div className="mt-2 flex items-center gap-2">
              <Badge className={getCategoryColor(post.category)}>
                {getCategoryName(post.category)}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Link to="/posts">
              <Button variant="outline">Назад к списку</Button>
            </Link>
            {hasPermission(Permission.EDIT_POST) && (
              <Link to={`/admin/posts/edit/${post.id}`}>
                <Button>Редактировать</Button>
              </Link>
            )}
          </div>
        </div>
        
        <Separator className="mb-6" />
        
        <div className="mb-6">
          <div className="whitespace-pre-line">
            {post.content.split('\n').map((paragraph: string, index: number) => (
              <p key={index} className="mb-4">{paragraph}</p>
            ))}
          </div>
        </div>
        
        {post.tags && post.tags.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Теги:</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag: string, index: number) => (
                <Badge key={index} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        <div className="bg-muted p-4 rounded-sm">
          <p className="text-sm">
            <strong>Автор:</strong> {post.author}
          </p>
          <p className="text-sm">
            <strong>Опубликовано:</strong> {new Date(post.createdAt).toLocaleString()}
          </p>
          {post.createdAt !== post.updatedAt && (
            <p className="text-sm">
              <strong>Обновлено:</strong> {new Date(post.updatedAt).toLocaleString()}
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PostDetail;
