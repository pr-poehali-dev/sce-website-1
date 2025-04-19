import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSCEObjects } from '@/hooks/useSCEObjects';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/use-toast';
import SCEObjectForm from '@/components/SCEObjectForm';
import { Alert, AlertDescription } from '@/components/ui/alert';

const CreateObject = () => {
  const { createObject } = useSCEObjects();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateObject = async (formData: any) => {
    if (!user) {
      setError('Вы должны быть авторизованы для создания объекта');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Добавляем информацию о создателе
      const objectData = {
        ...formData,
        createdBy: user.username
      };

      await createObject(objectData);
      
      toast({
        title: 'Объект SCE создан',
        description: `Объект SCE-${formData.number}: ${formData.name} успешно создан.`,
      });
      
      navigate('/admin/objects');
    } catch (err) {
      console.error('Ошибка при создании объекта:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Произошла ошибка при создании объекта SCE');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Создание нового объекта SCE</h2>
      
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="sce-content">
        <SCEObjectForm 
          onSubmit={handleCreateObject} 
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default CreateObject;
