import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';

const NotFound = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-6xl font-bold text-primary mb-4">404</div>
        <h1 className="text-3xl font-bold mb-4">Страница не найдена</h1>
        <div className="max-w-md text-center mb-8">
          <p className="text-muted-foreground mb-4">
            Запрашиваемая страница не существует или была удалена.
          </p>
          <p className="text-sm text-muted-foreground">
            Возможно, вы пытаетесь получить доступ к секретным материалам без надлежащего разрешения.
          </p>
        </div>
        <Link to="/">
          <Button>Вернуться на главную</Button>
        </Link>
      </div>
    </Layout>
  );
};

export default NotFound;
