import { useState, useEffect } from 'react';
import { SCEObject, SCEClassType } from '@/types';

interface UseSCEObjectsReturn {
  objects: SCEObject[];
  isLoading: boolean;
  error: string | null;
  getObjectById: (id: string) => SCEObject | null;
  createObject: (object: Omit<SCEObject, 'id' | 'createdAt' | 'updatedAt'>) => Promise<SCEObject>;
  updateObject: (id: string, updates: Partial<SCEObject>) => Promise<SCEObject | null>;
  deleteObject: (id: string) => Promise<boolean>;
}

export const useSCEObjects = (): UseSCEObjectsReturn => {
  const [objects, setObjects] = useState<SCEObject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загружаем объекты из localStorage при инициализации
  useEffect(() => {
    loadObjects();
  }, []);

  const loadObjects = () => {
    try {
      setIsLoading(true);
      const storedObjects = localStorage.getItem('sce_objects');
      
      if (storedObjects) {
        setObjects(JSON.parse(storedObjects));
      } else {
        // Если объектов нет, создаем пустой массив
        localStorage.setItem('sce_objects', JSON.stringify([]));
      }
      
      setError(null);
    } catch (err) {
      setError('Ошибка при загрузке объектов SCE');
      console.error('Ошибка при загрузке объектов:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getObjectById = (id: string): SCEObject | null => {
    const object = objects.find(obj => obj.id === id);
    return object || null;
  };

  const createObject = async (objectData: Omit<SCEObject, 'id' | 'createdAt' | 'updatedAt'>): Promise<SCEObject> => {
    try {
      const now = new Date().toISOString();
      const newObject: SCEObject = {
        ...objectData,
        id: `sce-${Date.now()}`,
        createdAt: now,
        updatedAt: now
      };

      const updatedObjects = [...objects, newObject];
      setObjects(updatedObjects);
      localStorage.setItem('sce_objects', JSON.stringify(updatedObjects));
      
      return newObject;
    } catch (err) {
      console.error('Ошибка при создании объекта:', err);
      throw new Error('Не удалось создать объект SCE');
    }
  };

  const updateObject = async (id: string, updates: Partial<SCEObject>): Promise<SCEObject | null> => {
    try {
      const objectIndex = objects.findIndex(obj => obj.id === id);
      
      if (objectIndex === -1) {
        return null;
      }

      const updatedObject = {
        ...objects[objectIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };

      const updatedObjects = [...objects];
      updatedObjects[objectIndex] = updatedObject;
      
      setObjects(updatedObjects);
      localStorage.setItem('sce_objects', JSON.stringify(updatedObjects));
      
      return updatedObject;
    } catch (err) {
      console.error('Ошибка при обновлении объекта:', err);
      throw new Error('Не удалось обновить объект SCE');
    }
  };

  const deleteObject = async (id: string): Promise<boolean> => {
    try {
      const updatedObjects = objects.filter(obj => obj.id !== id);
      
      setObjects(updatedObjects);
      localStorage.setItem('sce_objects', JSON.stringify(updatedObjects));
      
      return true;
    } catch (err) {
      console.error('Ошибка при удалении объекта:', err);
      throw new Error('Не удалось удалить объект SCE');
    }
  };

  return {
    objects,
    isLoading,
    error,
    getObjectById,
    createObject,
    updateObject,
    deleteObject
  };
};
