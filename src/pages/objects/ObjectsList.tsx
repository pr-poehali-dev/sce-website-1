import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSCEObjects } from '@/hooks/useSCEObjects';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import Layout from '@/components/Layout';
import { SCEObject, SCEClassType } from '@/types';

const ObjectsList = () => {
  const { objects, isLoading } = useSCEObjects();
  const { hasPermission } = useAuth();
  const [filteredObjects, setFilteredObjects] = useState<SCEObject[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState<string>('all');
  
  // Применяем фильтры при изменении объектов или фильтров
  useEffect(() => {
    if (!objects || objects.length === 0) {
      setFilteredObjects([]);
      return;
    }
    
    let result = [...objects];
    
    // Фильтрация по статусу (показываем только активные)
    result = result.filter(obj => obj.status === 'active');
    
    // Фильтрация по поисковому запросу
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(obj => 
        obj.number.toLowerCase().includes(query) || 
        obj.name.toLowerCase().includes(query) ||
        obj.description.toLowerCase().includes(query)
      );
    }
    
    // Фильтрация по классу
    if (classFilter !== 'all') {
      result = result.filter(obj => obj.classType === classFilter);
    }
    
    // Сортировка по номеру
    result = result.sort((a, b) => parseInt(a.number) - parseInt(b.number));
    
    setFilteredObjects(result);
  }, [objects, searchQuery, classFilter]);
  
  // Получить цвет бейджа для класса объекта
  const getClassBadgeColor = (classType: string): string => {
    switch (classType) {
      case SCEClassType.SAFE:
        return 'bg-green-100 text-green-800 border-green-200';
      case SCEClassType.EUCLID:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case SCEClassType.KETER:
        return 'bg-red-100 text-red-800 border-red-200';
      case SCEClassType.THAUMIEL:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case SCEClassType.NEUTRALIZED:
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Объекты SCE</h1>
      
      <div className="sce-warning mb-8">
        <p>
          ВНИМАНИЕ: Информация о объектах SCE строго засекречена.
        </p>
        <p className="text-sm">
          Несанкционированное распространение информации карается по закону.
        </p>
      </div>
      
      {/* Панель фильтров */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <Input
            placeholder="Поиск по номеру или названию..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div>
          <Select value={classFilter} onValueChange={setClassFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Фильтр по классу" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все классы</SelectItem>
              <SelectItem value={SCEClassType.SAFE}>SAFE</SelectItem>
              <SelectItem value={SCEClassType.EUCLID}>EUCLID</SelectItem>
              <SelectItem value={SCEClassType.KETER}>KETER</SelectItem>
              <SelectItem value={SCEClassType.THAUMIEL}>THAUMIEL</SelectItem>
              <SelectItem value={SCEClassType.NEUTRALIZED}>NEUTRALIZED</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Список объектов */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-current border-t-transparent"></div>
          <p className="mt-2">Загрузка объектов SCE...</p>
        </div>
      ) : filteredObjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredObjects.map((object) => (
            <Card key={object.id} className="sce-object">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="sce-object-title">
                      SCE-{object.number}
                    </CardTitle>
                    <CardDescription className="text-lg font-medium">
                      {object.name}
                    </CardDescription>
                  </div>
                  <Badge className={getClassBadgeColor(object.classType)}>
                    {object.classType}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3 text-sm">{object.description}</p>
              </CardContent>
              <CardFooter>
                <Link to={`/objects/${object.id}`} className="w-full">
                  <Button variant="outline" className="w-full">Подробнее</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-secondary rounded-sm border border-border">
          {searchQuery || classFilter !== 'all' ? (
            <p>Объекты SCE не найдены по заданным фильтрам</p>
          ) : (
            <>
              <p className="mb-2">Объекты SCE не найдены</p>
              {hasPermission('CREATE_OBJECT') && (
                <Link to="/admin/objects/create">
                  <Button>Создать первый объект SCE</Button>
                </Link>
              )}
            </>
          )}
        </div>
      )}
    </Layout>
  );
};

export default ObjectsList;
