import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Layout from '@/components/Layout';

const VerifyEmail = () => {
  const { verifyEmail } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Проверка email...');

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Отсутствует токен подтверждения');
        return;
      }

      try {
        const success = await verifyEmail(token);
        
        if (success) {
          setStatus('success');
          setMessage('Ваш email успешно подтвержден! Теперь вы можете войти в систему.');
        } else {
          setStatus('error');
          setMessage('Недействительный или устаревший токен подтверждения.');
        }
      } catch (err) {
        console.error('Ошибка при подтверждении email:', err);
        setStatus('error');
        setMessage('Произошла ошибка при подтверждении email. Попробуйте позже.');
      }
    };

    verify();
  }, [token, verifyEmail]);

  return (
    <Layout>
      <div className="max-w-md mx-auto sce-content">
        <h1 className="text-2xl font-bold mb-6 text-center">Подтверждение Email</h1>
        
        {status === 'loading' && (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent mb-4"></div>
            <p>{message}</p>
          </div>
        )}
        
        {status === 'success' && (
          <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
        
        {status === 'error' && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
        
        <div className="mt-6 flex justify-center">
          {status === 'success' ? (
            <Button onClick={() => navigate('/login')}>
              Перейти на страницу входа
            </Button>
          ) : (
            <Link to="/">
              <Button variant="outline">
                Вернуться на главную
              </Button>
            </Link>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default VerifyEmail;
