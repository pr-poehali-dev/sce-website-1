import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Layout from '@/components/Layout';

// Схема валидации формы регистрации (упрощенная)
const registerSchema = z.object({
  username: z.string().min(1, 'Введите имя пользователя'),
  email: z.string().min(1, 'Введите email'),
  password: z.string().min(1, 'Введите пароль'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setIsSubmitting(true);
      setError(null);
      setSuccess(null);
      
      const result = await register(data.username, data.email, data.password);
      
      if (result.success) {
        setSuccess(result.message || 'Регистрация успешна! Вы автоматически авторизованы.');
        // Перенаправляем на главную страницу после успешной регистрации
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        setError(result.message || 'Ошибка регистрации');
      }
    } catch (err) {
      console.error('Ошибка при регистрации:', err);
      setError('Произошла ошибка при регистрации');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto sce-content">
        <h1 className="text-2xl font-bold mb-6 text-center">Регистрация</h1>
        
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Имя пользователя</FormLabel>
                  <FormControl>
                    <Input placeholder="Введите имя пользователя" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Введите email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Пароль</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Введите пароль" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
            </Button>
          </form>
        </Form>
        
        <div className="mt-4 text-center">
          <p>
            Уже есть аккаунт?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Войти
            </Link>
          </p>
        </div>
        
        <div className="mt-6 text-sm text-muted-foreground">
          <p className="text-center">
            После регистрации вы автоматически получите доступ к системе.
            <br/>
            Для email artemkauniti@gmail.com предоставляются права суперадминистратора.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
