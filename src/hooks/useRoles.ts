import { useState, useEffect } from 'react';
import { Role, Permission } from '@/types';

interface UseRolesReturn {
  roles: Role[];
  isLoading: boolean;
  error: string | null;
  getRoleById: (id: string) => Role | null;
  createRole: (role: Omit<Role, 'id' | 'createdAt'>) => Promise<Role>;
  updateRole: (id: string, updates: Partial<Role>) => Promise<Role | null>;
  deleteRole: (id: string) => Promise<boolean>;
}

export const useRoles = (): UseRolesReturn => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Инициализация ролей при первой загрузке
  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = () => {
    try {
      setIsLoading(true);
      const storedRoles = localStorage.getItem('sce_roles');
      
      if (storedRoles) {
        setRoles(JSON.parse(storedRoles));
      } else {
        // Если ролей нет, создаем стандартные роли
        const defaultRoles: Role[] = [
          {
            id: 'role-admin',
            name: 'Администратор',
            description: 'Полный доступ ко всем функциям системы',
            permissions: Object.values(Permission),
            createdAt: new Date().toISOString()
          },
          {
            id: 'role-researcher',
            name: 'Исследователь',
            description: 'Может создавать и редактировать объекты SCE и посты',
            permissions: [
              Permission.VIEW_OBJECT,
              Permission.CREATE_OBJECT,
              Permission.EDIT_OBJECT,
              Permission.VIEW_POST,
              Permission.CREATE_POST,
              Permission.EDIT_POST
            ],
            createdAt: new Date().toISOString()
          },
          {
            id: 'role-agent',
            name: 'Агент',
            description: 'Может просматривать объекты SCE и создавать отчеты',
            permissions: [
              Permission.VIEW_OBJECT,
              Permission.VIEW_POST,
              Permission.CREATE_POST
            ],
            createdAt: new Date().toISOString()
          },
          {
            id: 'role-reader',
            name: 'Читатель',
            description: 'Может только просматривать информацию',
            permissions: [
              Permission.VIEW_OBJECT,
              Permission.VIEW_POST
            ],
            createdAt: new Date().toISOString()
          }
        ];
        
        setRoles(defaultRoles);
        localStorage.setItem('sce_roles', JSON.stringify(defaultRoles));
      }
      
      setError(null);
    } catch (err) {
      setError('Ошибка при загрузке ролей');
      console.error('Ошибка при загрузке ролей:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleById = (id: string): Role | null => {
    const role = roles.find(r => r.id === id);
    return role || null;
  };

  const createRole = async (roleData: Omit<Role, 'id' | 'createdAt'>): Promise<Role> => {
    try {
      const newRole: Role = {
        ...roleData,
        id: `role-${Date.now()}`,
        createdAt: new Date().toISOString()
      };

      const updatedRoles = [...roles, newRole];
      setRoles(updatedRoles);
      localStorage.setItem('sce_roles', JSON.stringify(updatedRoles));
      
      return newRole;
    } catch (err) {
      console.error('Ошибка при создании роли:', err);
      throw new Error('Не удалось создать роль');
    }
  };

  const updateRole = async (id: string, updates: Partial<Role>): Promise<Role | null> => {
    try {
      const roleIndex = roles.findIndex(r => r.id === id);
      
      if (roleIndex === -1) {
        return null;
      }

      const updatedRole = {
        ...roles[roleIndex],
        ...updates
      };

      const updatedRoles = [...roles];
      updatedRoles[roleIndex] = updatedRole;
      
      setRoles(updatedRoles);
      localStorage.setItem('sce_roles', JSON.stringify(updatedRoles));
      
      return updatedRole;
    } catch (err) {
      console.error('Ошибка при обновлении роли:', err);
      throw new Error('Не удалось обновить роль');
    }
  };

  const deleteRole = async (id: string): Promise<boolean> => {
    try {
      // Проверяем, что нельзя удалить стандартные роли
      if (['role-admin', 'role-researcher', 'role-agent', 'role-reader'].includes(id)) {
        throw new Error('Нельзя удалить стандартную роль');
      }
      
      const updatedRoles = roles.filter(r => r.id !== id);
      
      setRoles(updatedRoles);
      localStorage.setItem('sce_roles', JSON.stringify(updatedRoles));
      
      return true;
    } catch (err) {
      console.error('Ошибка при удалении роли:', err);
      throw new Error('Не удалось удалить роль');
    }
  };

  return {
    roles,
    isLoading,
    error,
    getRoleById,
    createRole,
    updateRole,
    deleteRole
  };
};
