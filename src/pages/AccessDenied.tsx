import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';

const AccessDenied = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-6xl font-bold text-primary mb-4">403</div>
        <h1 className="text-3xl font-bold mb-4">Доступ запрещен</h1>
        <div className="max-w-md text-center mb-8">
          <p className="text-muted-foreground mb-4">
            У вас нет необходимых прав доступа к запрашиваемой странице.
          </p>
          <p className="text-sm text-muted-foreground">
            Этот инцидент будет зарегистрирован в системе безопасности SCE Foundation.
          </p>
        </div>
        <div className="flex gap-4">
          <Link to="/">
            <Button>Вернуться на главную</Button>
          </Link>
          <Link to="/login">
            <Button variant="outline">Войти с другим аккаунтом</Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default AccessDenied;
