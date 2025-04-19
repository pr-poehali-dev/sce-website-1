import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSCEObjects } from '@/hooks/useSCEObjects';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import SCEObjectForm from '@/components/SCEObjectForm';
import { UserRole } from '@/types';
import ProtectedRoute from '@/components/ProtectedRoute';

const EditObject = () => {
  const { id } = useParams<{ id: string }>();
  const { getObjectById, updateObject } = useSCEObjects();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [object, setObject] = useState<any>(null);

  useEffect(() => {
    if (id) {
      const obj = getObjectById(id);
      if (obj) {
        setObject(obj);
      } else {
        setError('Объект не найден');
      }
    } else {
      setError('Неверный идентификатор объекта');
    }
    setLoading(false);
  }, [id, getObjectById]);

  const handleSubmit = async (formData: any) => {
    try {
      if (!user) {
        throw new Error('Необходима авторизация');
      }

      if (!id) {
        throw new Error('Отсутствует идентификатор объекта');
      }

      const updatedObject = await updateObject(id, {
        ...formData
      });

      if (updatedObject) {
        navigate(`/objects/${updatedObject.id}`);
      } else {
        throw new Error('Не удалось обновить объект');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Произошла ошибка при обновлении объекта');
      }
    }
  };

  if (loading) {
    return <div className="text-center py-8">Загрузка объекта...</div>;
  }

  if (error && !object) {
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
            <CardTitle>Редактирование объекта SCE-{object?.number}</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {object && (
              <SCEObjectForm 
                onSubmit={handleSubmit} 
                initialData={object} 
                isEdit
              />
            )}
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
};

export default EditObject;