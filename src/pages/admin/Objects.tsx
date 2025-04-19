import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSCEObjects } from '@/hooks/useSCEObjects';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SCEObject } from '@/types';
import { toast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const Objects = () => {
  const { objects, deleteObject } = useSCEObjects();
  const [filteredObjects, setFilteredObjects] = useState<SCEObject[]>([]);
  const [objectToDelete, setObjectToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Инициализация и сортировка объектов
  useEffect(() => {
    const sorted = [...objects].sort((a, b) => {
      // Сортировка по номеру объекта
      return parseInt(a.number) - parseInt(b.number);
    });
    setFilteredObjects(sorted);
  }, [objects]);
  
  // Обработчик удаления объекта
  const handleDeleteObject = async () => {
    if (!objectToDelete) return;
    
    try {
      setIsDeleting(true);
      await deleteObject(objectToDelete);
      toast({
        title: 'Объект SCE удален',
        description: 'Объект успешно удален из базы данных.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Не удалось удалить объект SCE',
      });
    } finally {
      setIsDeleting(false);
      setObjectToDelete(null);
    }
  };
  
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
  
  // Получить цвет для статуса объекта
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'archived':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  // Получить текст статуса объекта
  const getStatusText = (status: string): string => {
    switch (status) {
      case 'active':
        return 'Активный';
      case 'archived':
        return 'Архивный';
      case 'pending':
        return 'На рассмотрении';
      default:
        return status;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Управление объектами SCE</h2>
        <Link to="/admin/objects/create">
          <Button>Создать объект</Button>
        </Link>
      </div>
      
      {filteredObjects.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-4">Номер</th>
                <th className="text-left py-2 px-4">Название</th>
                <th className="text-left py-2 px-4">Класс</th>
                <th className="text-left py-2 px-4">Статус</th>
                <th className="text-left py-2 px-4">Создан</th>
                <th className="text-center py-2 px-4">Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredObjects.map((object) => (
                <tr key={object.id} className="border-b hover:bg-muted/50">
                  <td className="py-2 px-4">SCE-{object.number}</td>
                  <td className="py-2 px-4">{object.name}</td>
                  <td className="py-2 px-4">
                    <Badge className={getClassColor(object.classType)}>
                      {object.classType}
                    </Badge>
                  </td>
                  <td className="py-2 px-4">
                    <Badge className={getStatusColor(object.status)}>
                      {getStatusText(object.status)}
                    </Badge>
                  </td>
                  <td className="py-2 px-4">
                    {new Date(object.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 text-center">
                    <div className="flex justify-center gap-2">
                      <Link to={`/objects/${object.id}`}>
                        <Button size="sm" variant="outline">Просмотр</Button>
                      </Link>
                      <Link to={`/admin/objects/edit/${object.id}`}>
                        <Button size="sm" variant="outline">Изменить</Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-destructive"
                            onClick={() => setObjectToDelete(object.id)}
                          >
                            Удалить
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Это действие удалит объект SCE-{object.number}: {object.name} и не может быть отменено.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Отмена</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={handleDeleteObject}
                              disabled={isDeleting}
                              className="bg-destructive text-destructive-foreground"
                            >
                              {isDeleting ? 'Удаление...' : 'Удалить'}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">Объекты SCE не найдены</p>
          <Link to="/admin/objects/create">
            <Button>Создать первый объект</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Objects;
