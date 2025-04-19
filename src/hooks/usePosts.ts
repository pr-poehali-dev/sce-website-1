import { useState, useEffect } from 'react';
import { Post, PostCategory } from '@/types';

interface UsePostsReturn {
  posts: Post[];
  isLoading: boolean;
  error: string | null;
  getPostById: (id: string) => Post | null;
  createPost: (post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Post>;
  updatePost: (id: string, updates: Partial<Post>) => Promise<Post | null>;
  deletePost: (id: string) => Promise<boolean>;
}

export const usePosts = (): UsePostsReturn => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загружаем посты из localStorage при инициализации
  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = () => {
    try {
      setIsLoading(true);
      const storedPosts = localStorage.getItem('sce_posts');
      
      if (storedPosts) {
        setPosts(JSON.parse(storedPosts));
      } else {
        // Если постов нет, создаем пустой массив
        localStorage.setItem('sce_posts', JSON.stringify([]));
      }
      
      setError(null);
    } catch (err) {
      setError('Ошибка при загрузке постов');
      console.error('Ошибка при загрузке постов:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getPostById = (id: string): Post | null => {
    const post = posts.find(p => p.id === id);
    return post || null;
  };

  const createPost = async (postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Promise<Post> => {
    try {
      const now = new Date().toISOString();
      const newPost: Post = {
        ...postData,
        id: `post-${Date.now()}`,
        createdAt: now,
        updatedAt: now
      };

      const updatedPosts = [...posts, newPost];
      setPosts(updatedPosts);
      localStorage.setItem('sce_posts', JSON.stringify(updatedPosts));
      
      return newPost;
    } catch (err) {
      console.error('Ошибка при создании поста:', err);
      throw new Error('Не удалось создать пост');
    }
  };

  const updatePost = async (id: string, updates: Partial<Post>): Promise<Post | null> => {
    try {
      const postIndex = posts.findIndex(p => p.id === id);
      
      if (postIndex === -1) {
        return null;
      }

      const updatedPost = {
        ...posts[postIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };

      const updatedPosts = [...posts];
      updatedPosts[postIndex] = updatedPost;
      
      setPosts(updatedPosts);
      localStorage.setItem('sce_posts', JSON.stringify(updatedPosts));
      
      return updatedPost;
    } catch (err) {
      console.error('Ошибка при обновлении поста:', err);
      throw new Error('Не удалось обновить пост');
    }
  };

  const deletePost = async (id: string): Promise<boolean> => {
    try {
      const updatedPosts = posts.filter(p => p.id !== id);
      
      setPosts(updatedPosts);
      localStorage.setItem('sce_posts', JSON.stringify(updatedPosts));
      
      return true;
    } catch (err) {
      console.error('Ошибка при удалении поста:', err);
      throw new Error('Не удалось удалить пост');
    }
  };

  return {
    posts,
    isLoading,
    error,
    getPostById,
    createPost,
    updatePost,
    deletePost
  };
};
