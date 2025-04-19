import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSCEObjects } from '@/hooks/useSCEObjects';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertCircle } from 'lucide-react';
import Layout from '@/components/Layout';
import { Permission } from '@/types';

const ObjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { getObjectById } = useSCEObjects();
  const { hasPermission } = useAuth();
  const navigate = useNavigate();
  const [object, setObject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!id) {
      setError('Идентификатор объекта не указан');
      setIsLoading(false);
      return;
    }
    
    const fetchObject = () => {
      try {
        const foundObject = getObjectById(id);
        
        if (!foundObject) {
          setError('Объект SCE не найден');
        } else {
          setObject(foundObject);
        }
      } catch (err) {
        console.error('Ошибка при загрузке объекта:', err);
        setError('Ошибка при загрузке объекта SCE');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchObject();
  }, [id, getObjectById]);
  
  // Получить цвет для класса объекта
  const getClassColor = (classType: string): string => {
    switch (classType) {
      case 'SAFE':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'EUCLID':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'KETER':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'THAUMIEL':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'NEUTRALIZED':
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
          <p className="mt-2">Загрузка объекта SCE...</p>
        </div>
      </Layout>
    );
  }
  
  if (error || !object) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto text-center py-12">
          <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
          <h1 className="text-2xl font-bold mb-4">Ошибка</h1>
          <p className="text-muted-foreground mb-6">{error || 'Объект SCE не найден'}</p>
          <Button onClick={() => navigate('/objects')}>
            Вернуться к списку объектов
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
            <h1 className="text-3xl font-bold text-primary">
              SCE-{object.number}: {object.name}
            </h1>
            <div className="mt-2">
              <Badge className={getClassColor(object.classType)}>
                Класс: {object.classType}
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Link to="/objects">
              <Button variant="outline">Назад к списку</Button>
            </Link>
            {hasPermission(Permission.EDIT_OBJECT) && (
              <Link to={`/admin/objects/edit/${object.id}`}>
                <Button>Редактировать</Button>
              </Link>
            )}
          </div>
        </div>
        
        <div className="sce-warning mb-6">
          <p>
            ВНИМАНИЕ: Информация о объекте SCE-{object.number} строго засекречена.
          </p>
          <p className="text-sm">
            Доступ к данному материалу разрешен только авторизованному персоналу.
          </p>
        </div>
        
        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-bold mb-2">Описание</h2>
            <Separator className="mb-4" />
            <p className="whitespace-pre-line">{object.description}</p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold mb-2">Процедуры содержания</h2>
            <Separator className="mb-4" />
            <p className="whitespace-pre-line">{object.containment}</p>
          </section>
          
          {object.additionalInfo && (
            <section>
              <h2 className="text-xl font-bold mb-2">Дополнительная информация</h2>
              <Separator className="mb-4" />
              <p className="whitespace-pre-line">{object.additionalInfo}</p>
            </section>
          )}
          
          <div className="bg-muted p-4 rounded-sm text-sm">
            <p className="mb-1"><strong>Создан:</strong> {new Date(object.createdAt).toLocaleDateString()}</p>
            <p className="mb-1"><strong>Последнее обновление:</strong> {new Date(object.updatedAt).toLocaleDateString()}</p>
            <p><strong>Автор:</strong> {object.createdBy}</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ObjectDetail;
