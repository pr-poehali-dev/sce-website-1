import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePosts } from '@/hooks/usePosts';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import PostForm from '@/components/PostForm';
import { UserRole } from '@/types';
import ProtectedRoute from '@/components/ProtectedRoute';

const EditPost = () => {
  const { id } = useParams<{ id: string }>();
  const { getPostById, updatePost } = usePosts();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<any>(null);

  useEffect(() => {
    if (id) {
      const postData = getPostById(id);
      if (postData) {
        setPost(postData);
      } else {
        setError('Публикация не найдена');
      }
    } else {
      setError('Неверный идентификатор публикации');
    }
    setLoading(false);
  }, [id, getPostById]);

  const handleSubmit = async (formData: any) => {
    try {
      if (!user) {
        throw new Error('Необходима авторизация');
      }

      if (!id) {
        throw new Error('Отсутствует идентификатор публикации');
      }

      // Преобразуем строку тегов в массив
      const tagsArray = formData.tags
        .split(',')
        .map((tag: string) => tag.trim())
        .filter((tag: string) => tag !== '');

      const updatedPost = await updatePost(id, {
        ...formData,
        tags: tagsArray
      });

      if (updatedPost) {
        navigate(`/posts/${updatedPost.id}`);
      } else {
        throw new Error('Не удалось обновить публикацию');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Произошла ошибка при обновлении публикации');
      }
    }
  };

  if (loading) {
    return <div className="text-center py-8">Загрузка публикации...</div>;
  }

  if (error && !post) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <ProtectedRoute requiredRole={UserRole.ADMIN}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Редактирование публикации</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {post && (
              <PostForm 
                onSubmit={handleSubmit} 
                initialData={{
                  ...post,
                  tags: post.tags.join(', ')
                }} 
                isEdit
              />
            )}
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
};

export default EditPost;