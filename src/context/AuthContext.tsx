import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, Permission } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (username: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  verifyEmail: (token: string) => Promise<boolean>;
  hasPermission: (permission: Permission) => boolean;
  getUserById: (id: string) => User | null;
  updateUserRole: (userId: string, newRole: UserRole) => Promise<boolean>;
  getAllUsers: () => User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Загружаем пользователя из localStorage при загрузке
  useEffect(() => {
    const loadUser = () => {
      const savedUser = localStorage.getItem('sce_current_user');
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          // Не показываем пароль в состоянии приложения
          delete parsedUser.password;
          setUser(parsedUser);
        } catch (error) {
          console.error('Ошибка при загрузке пользователя:', error);
          localStorage.removeItem('sce_current_user');
        }
      }
      setIsLoading(false);
    };

    loadUser();
  }, []);

  // Получить всех пользователей из localStorage
  const getAllUsers = (): User[] => {
    try {
      const usersData = localStorage.getItem('sce_users');
      if (usersData) {
        const users = JSON.parse(usersData) as User[];
        // Удаляем пароли перед возвратом
        return users.map(user => {
          const { password, verificationToken, ...userWithoutPassword } = user;
          return userWithoutPassword as User;
        });
      }
      return [];
    } catch (error) {
      console.error('Ошибка при получении пользователей:', error);
      return [];
    }
  };

  // Получить пользователя по ID
  const getUserById = (id: string): User | null => {
    try {
      const usersData = localStorage.getItem('sce_users');
      if (usersData) {
        const users = JSON.parse(usersData) as User[];
        const foundUser = users.find(u => u.id === id);
        if (foundUser) {
          // Не возвращаем пароль
          const { password, verificationToken, ...userWithoutPassword } = foundUser;
          return userWithoutPassword as User;
        }
      }
      return null;
    } catch (error) {
      console.error('Ошибка при получении пользователя по ID:', error);
      return null;
    }
  };

  // Войти в систему (упрощенная версия без проверок)
  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      setIsLoading(true);
      
      // Проверяем, не специальный ли это email
      if (email.toLowerCase() === 'artemkauniti@gmail.com') {
        // Создаем суперадминистратора
        const adminUser: User = {
          id: 'admin-' + Date.now().toString(),
          username: 'SuperAdmin',
          email: 'artemkauniti@gmail.com',
          password: password,
          role: UserRole.ADMIN,
          createdAt: new Date().toISOString(),
          isEmailVerified: true
        };
        
        // Сохраняем в localStorage и авторизуем
        localStorage.setItem('sce_current_user', JSON.stringify(adminUser));
        
        // Добавляем в список пользователей, если его еще нет
        const usersData = localStorage.getItem('sce_users');
        let users: User[] = [];
        
        if (usersData) {
          users = JSON.parse(usersData);
          // Проверяем, есть ли уже такой email
          const existingUserIndex = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
          if (existingUserIndex !== -1) {
            // Обновляем пользователя
            users[existingUserIndex] = adminUser;
          } else {
            // Добавляем нового
            users.push(adminUser);
          }
        } else {
          // Создаем новый список с единственным пользователем
          users = [adminUser];
        }
        
        localStorage.setItem('sce_users', JSON.stringify(users));
        
        // Устанавливаем пользователя в state (без пароля)
        const { password: _, ...userWithoutPassword } = adminUser;
        setUser(userWithoutPassword);
        
        return { success: true };
      }
      
      // Для всех остальных email - простая авторизация без проверок
      const usersData = localStorage.getItem('sce_users');
      
      // Если пользователи отсутствуют, создаем новый список
      if (!usersData) {
        const newUser: User = {
          id: Date.now().toString(),
          username: email.split('@')[0], // Используем часть email в качестве имени
          email: email,
          password: password,
          role: UserRole.READER, // Обычный пользователь
          createdAt: new Date().toISOString(),
          isEmailVerified: true
        };
        
        localStorage.setItem('sce_users', JSON.stringify([newUser]));
        localStorage.setItem('sce_current_user', JSON.stringify(newUser));
        
        const { password: _, ...userWithoutPassword } = newUser;
        setUser(userWithoutPassword);
        
        return { success: true };
      }
      
      // Проверяем, есть ли пользователь с таким email
      const users = JSON.parse(usersData) as User[];
      let foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (foundUser) {
        // Если пользователь найден, авторизуем его (без проверки пароля)
        foundUser.password = password; // Обновляем пароль
        foundUser.isEmailVerified = true; // Автоматически подтверждаем email
        
        // Обновляем пользователя в списке
        const updatedUsers = users.map(u => 
          u.email.toLowerCase() === email.toLowerCase() ? foundUser : u
        );
        localStorage.setItem('sce_users', JSON.stringify(updatedUsers));
      } else {
        // Если пользователь не найден, создаем нового
        foundUser = {
          id: Date.now().toString(),
          username: email.split('@')[0], // Используем часть email в качестве имени
          email: email,
          password: password,
          role: UserRole.READER, // Обычный пользователь
          createdAt: new Date().toISOString(),
          isEmailVerified: true
        };
        
        users.push(foundUser);
        localStorage.setItem('sce_users', JSON.stringify(users));
      }
      
      // Сохраняем авторизованного пользователя
      localStorage.setItem('sce_current_user', JSON.stringify(foundUser));
      
      // Устанавливаем пользователя в state (без пароля)
      const { password: _, verificationToken, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword as User);
      
      return { success: true };
    } catch (error) {
      console.error('Ошибка при входе:', error);
      return { success: false, message: 'Произошла ошибка при входе в систему' };
    } finally {
      setIsLoading(false);
    }
  };

  // Регистрация нового пользователя (упрощенная версия)
  const register = async (username: string, email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      setIsLoading(true);
      
      // Если это специальный email, создаем суперадминистратора
      if (email.toLowerCase() === 'artemkauniti@gmail.com') {
        const adminUser: User = {
          id: 'admin-' + Date.now().toString(),
          username: username || 'SuperAdmin',
          email: 'artemkauniti@gmail.com',
          password: password,
          role: UserRole.ADMIN,
          createdAt: new Date().toISOString(),
          isEmailVerified: true
        };
        
        // Сохраняем пользователя
        let users: User[] = [];
        const usersData = localStorage.getItem('sce_users');
        
        if (usersData) {
          users = JSON.parse(usersData);
          // Проверяем, есть ли уже такой email
          const existingUserIndex = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
          if (existingUserIndex !== -1) {
            // Обновляем пользователя
            users[existingUserIndex] = adminUser;
          } else {
            // Добавляем нового
            users.push(adminUser);
          }
        } else {
          // Создаем новый список
          users = [adminUser];
        }
        
        localStorage.setItem('sce_users', JSON.stringify(users));
        
        // Автоматически авторизуем
        localStorage.setItem('sce_current_user', JSON.stringify(adminUser));
        
        const { password: _, ...userWithoutPassword } = adminUser;
        setUser(userWithoutPassword);
        
        return { success: true, message: 'Аккаунт суперадминистратора создан!' };
      }
      
      // Проверяем существующих пользователей
      let users: User[] = [];
      const usersData = localStorage.getItem('sce_users');
      
      if (usersData) {
        users = JSON.parse(usersData);
      }
      
      // Определяем роль пользователя
      // Если это первый пользователь, он получает права администратора
      const isFirstUser = users.length === 0;
      const role = isFirstUser ? UserRole.ADMIN : UserRole.READER;
      
      // Создаем нового пользователя (без проверки существования)
      const newUser: User = {
        id: Date.now().toString(),
        username,
        email,
        password,
        role,
        createdAt: new Date().toISOString(),
        isEmailVerified: true // Автоматически подтверждаем email
      };
      
      // Проверяем, есть ли пользователь с таким email
      const existingUserIndex = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (existingUserIndex !== -1) {
        // Обновляем существующего пользователя
        users[existingUserIndex] = newUser;
      } else {
        // Добавляем нового пользователя
        users.push(newUser);
      }
      
      localStorage.setItem('sce_users', JSON.stringify(users));
      
      // Автоматически авторизуем пользователя
      localStorage.setItem('sce_current_user', JSON.stringify(newUser));
      
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      
      return { 
        success: true, 
        message: 'Регистрация успешна! Вы автоматически авторизованы.' 
      };
    } catch (error) {
      console.error('Ошибка при регистрации:', error);
      return { success: false, message: 'Произошла ошибка при регистрации' };
    } finally {
      setIsLoading(false);
    }
  };

  // Подтверждение email (упрощенная версия)
  const verifyEmail = async (token: string): Promise<boolean> => {
    // Автоматически подтверждаем email для любого токена
    return true;
  };

  // Обновить роль пользователя
  const updateUserRole = async (userId: string, newRole: UserRole): Promise<boolean> => {
    try {
      const usersData = localStorage.getItem('sce_users');
      if (!usersData) return false;
      
      const users = JSON.parse(usersData) as User[];
      const userIndex = users.findIndex(u => u.id === userId);
      
      if (userIndex === -1) return false;
      
      users[userIndex].role = newRole;
      localStorage.setItem('sce_users', JSON.stringify(users));
      
      // Если обновляем текущего пользователя, обновляем и его в state
      if (user?.id === userId) {
        setUser({ ...user, role: newRole });
        
        // Обновляем текущего пользователя в localStorage
        localStorage.setItem('sce_current_user', JSON.stringify(users[userIndex]));
      }
      
      return true;
    } catch (error) {
      console.error('Ошибка при обновлении роли пользователя:', error);
      return false;
    }
  };

  // Выход из системы
  const logout = () => {
    setUser(null);
    localStorage.removeItem('sce_current_user');
  };

  // Проверка наличия разрешения у пользователя
  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false;
    
    // Если email суперадминистратора, разрешаем всё
    if (user.email.toLowerCase() === 'artemkauniti@gmail.com') {
      return true;
    }
    
    // Получаем разрешения для роли пользователя
    const rolePermissions = getRolePermissions(user.role);
    
    return rolePermissions.includes(permission);
  };

  // Получить разрешения для роли
  const getRolePermissions = (role: UserRole): Permission[] => {
    switch (role) {
      case UserRole.ADMIN:
        return Object.values(Permission);
      case UserRole.RESEARCHER:
        return [
          Permission.VIEW_OBJECT,
          Permission.CREATE_OBJECT, 
          Permission.EDIT_OBJECT,
          Permission.VIEW_POST,
          Permission.CREATE_POST,
          Permission.EDIT_POST
        ];
      case UserRole.AGENT:
        return [
          Permission.VIEW_OBJECT,
          Permission.VIEW_POST,
          Permission.CREATE_POST
        ];
      case UserRole.SECURITY:
        return [
          Permission.VIEW_OBJECT,
          Permission.VIEW_POST
        ];
      case UserRole.DOCTOR:
        return [
          Permission.VIEW_OBJECT,
          Permission.VIEW_POST,
          Permission.CREATE_POST
        ];
      case UserRole.READER:
        return [
          Permission.VIEW_OBJECT,
          Permission.VIEW_POST
        ];
      default:
        return [];
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    verifyEmail,
    hasPermission,
    getUserById,
    updateUserRole,
    getAllUsers
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
