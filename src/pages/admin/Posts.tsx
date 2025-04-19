import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePosts } from '@/hooks/usePosts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Post } from '@/types';
import { toast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const Posts = () => {
  const { posts, deletePost } = usePosts();
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Инициализация и сортировка постов
  useEffect(() => {
    const sorted = [...posts].sort((a, b) => {
      // Сортировка по дате создания (новые сверху)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    setFilteredPosts(sorted);
  }, [posts]);
  
  // Обработчик удаления поста
  const handleDeletePost = async () => {
    if (!postToDelete) return;
    
    try {
      setIsDeleting(true);
      await deletePost(postToDelete);
      toast({
        title: 'Публикация удалена',
        description: 'Публикация успешно удалена из базы данных.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Не удалось удалить публикацию',
      });
    } finally {
      setIsDeleting(false);
      setPostToDelete(null);
    }
  };
  
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
  
  // Получить цвет для статуса
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  // Получить текст статуса
  const getStatusText = (status: string): string => {
    switch (status) {
      case 'published':
        return 'Опубликовано';
      case 'draft':
        return 'Черновик';
      default:
        return status;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Управление публикациями</h2>
        <Link to="/admin/posts/create">
          <Button>Создать публикацию</Button>
        </Link>
      </div>
      
      {filteredPosts.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-4">Заголовок</th>
                <th className="text-left py-2 px-4">Категория</th>
                <th className="text-left py-2 px-4">Автор</th>
                <th className="text-left py-2 px-4">Статус</th>
                <th className="text-left py-2 px-4">Дата</th>
                <th className="text-center py-2 px-4">Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.map((post) => (
                <tr key={post.id} className="border-b hover:bg-muted/50">
                  <td className="py-2 px-4">
                    <div className="font-medium">{post.title}</div>
                  </td>
                  <td className="py-2 px-4">
                    <Badge className={getCategoryColor(post.category)}>
                      {getCategoryName(post.category)}
                    </Badge>
                  </td>
                  <td className="py-2 px-4">{post.author}</td>
                  <td className="py-2 px-4">
                    <Badge className={getStatusColor(post.status)}>
                      {getStatusText(post.status)}
                    </Badge>
                  </td>
                  <td className="py-2 px-4">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 text-center">
                    <div className="flex justify-center gap-2">
                      <Link to={`/posts/${post.id}`}>
                        <Button size="sm" variant="outline">Просмотр</Button>
                      </Link>
                      <Link to={`/admin/posts/edit/${post.id}`}>
                        <Button size="sm" variant="outline">Изменить</Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-destructive"
                            onClick={() => setPostToDelete(post.id)}
                          >
                            Удалить
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Это действие удалит публикацию "{post.title}" и не может быть отменено.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Отмена</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={handleDeletePost}
                              disabled={isDeleting}
                              className="bg-destructive text-destructive-foreground"
                            >
                              {isDeleting ? 'Удаление...' : 'Удалить'}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">Публикации не найдены</p>
          <Link to="/admin/posts/create">
            <Button>Создать первую публикацию</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Posts;
