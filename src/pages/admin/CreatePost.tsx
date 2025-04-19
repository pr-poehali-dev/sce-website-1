import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePosts } from '@/hooks/usePosts';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/use-toast';
import PostForm from '@/components/PostForm';
import { Alert, AlertDescription } from '@/components/ui/alert';

const CreatePost = () => {
  const { createPost } = usePosts();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreatePost = async (formData: any) => {
    if (!user) {
      setError('Вы должны быть авторизованы для создания публикации');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Добавляем информацию об авторе
      const postData = {
        ...formData,
        author: user.username
      };

      await createPost(postData);
      
      toast({
        title: 'Публикация создана',
        description: `Публикация "${formData.title}" успешно создана.`,
      });
      
      navigate('/admin/posts');
    } catch (err) {
      console.error('Ошибка при создании публикации:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Произошла ошибка при создании публикации');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Создание новой публикации</h2>
      
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="sce-content">
        <PostForm 
          onSubmit={handleCreatePost} 
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default CreatePost;
