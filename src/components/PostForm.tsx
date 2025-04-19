import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Post, PostCategory } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';

// Схема валидации для поста
const postSchema = z.object({
  title: z.string().min(5, 'Название должно содержать минимум 5 символов'),
  content: z.string().min(20, 'Содержание должно содержать минимум 20 символов'),
  category: z.enum(['news', 'report', 'research', 'other'] as const, {
    errorMap: () => ({ message: 'Выберите категорию' }),
  }),
  tags: z.string().optional(),
  status: z.enum(['published', 'draft'], {
    errorMap: () => ({ message: 'Выберите статус публикации' }),
  }),
});

type FormValues = z.infer<typeof postSchema> & { tags: string };

interface PostFormProps {
  initialData?: Post;
  onSubmit: (data: FormValues) => Promise<void>;
  isLoading: boolean;
}

const PostForm = ({ initialData, onSubmit, isLoading }: PostFormProps) => {
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: initialData 
      ? { 
          ...initialData,
          tags: initialData.tags.join(', ')
        } 
      : {
          title: '',
          content: '',
          category: 'news',
          tags: '',
          status: 'published',
        },
  });

  const handleSubmit = async (values: FormValues) => {
    try {
      setError(null);
      // Преобразуем строку тегов в массив
      const formattedValues = {
        ...values,
        tags: values.tags ? values.tags.split(',').map(tag => tag.trim()) : [],
      };
      await onSubmit(formattedValues);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Произошла ошибка при сохранении поста');
      }
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: error || 'Произошла ошибка при сохранении поста',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Заголовок поста */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Заголовок</FormLabel>
              <FormControl>
                <Input placeholder="Введите заголовок" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Категория поста */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Категория</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите категорию" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="news">Новости</SelectItem>
                    <SelectItem value="report">Отчёт</SelectItem>
                    <SelectItem value="research">Исследование</SelectItem>
                    <SelectItem value="other">Прочее</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Категория определяет тип публикации
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Статус поста */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Статус публикации</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите статус" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="published">Опубликовано</SelectItem>
                    <SelectItem value="draft">Черновик</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Статус определяет видимость публикации
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Теги поста */}
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Теги</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Введите теги через запятую" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Добавьте теги, разделяя их запятыми
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Содержание поста */}
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Содержание</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Введите содержание поста"
                  className="h-64"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Кнопка отправки формы */}
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Сохранение...' : initialData ? 'Обновить публикацию' : 'Создать публикацию'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;
