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

  // Войти в систему
  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      setIsLoading(true);
      
      const usersData = localStorage.getItem('sce_users');
      if (!usersData) {
        return { success: false, message: 'Пользователи не найдены. Зарегистрируйтесь, чтобы стать первым пользователем.' };
      }
      
      const users = JSON.parse(usersData) as User[];
      const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!foundUser) {
        return { success: false, message: 'Пользователь с таким email не найден' };
      }
      
      if (foundUser.password !== password) {
        return { success: false, message: 'Неверный пароль' };
      }
      
      if (!foundUser.isEmailVerified) {
        return { success: false, message: 'Email не подтвержден. Проверьте вашу почту.' };
      }
      
      // Не сохраняем пароль в state
      const { password: _, verificationToken, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword as User);
      
      // Сохраняем пользователя в localStorage
      localStorage.setItem('sce_current_user', JSON.stringify(foundUser));
      
      return { success: true };
    } catch (error) {
      console.error('Ошибка при входе:', error);
      return { success: false, message: 'Произошла ошибка при входе в систему' };
    } finally {
      setIsLoading(false);
    }
  };

  // Регистрация нового пользователя
  const register = async (username: string, email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      setIsLoading(true);
      
      // Проверяем существующих пользователей
      let users: User[] = [];
      const usersData = localStorage.getItem('sce_users');
      
      if (usersData) {
        users = JSON.parse(usersData);
        
        // Проверяем, существует ли уже пользователь с таким email
        if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
          return { success: false, message: 'Пользователь с таким email уже существует' };
        }
      }
      
      // Создаем токен для подтверждения email
      const verificationToken = Math.random().toString(36).substring(2, 15);
      
      // Определяем роль пользователя
      // Если это первый пользователь, он получает права администратора
      const isFirstUser = users.length === 0;
      const role = isFirstUser ? UserRole.ADMIN : UserRole.READER;
      
      // Создаем нового пользователя
      const newUser: User = {
        id: Date.now().toString(),
        username,
        email,
        password,
        role,
        createdAt: new Date().toISOString(),
        isEmailVerified: false,
        verificationToken
      };
      
      users.push(newUser);
      localStorage.setItem('sce_users', JSON.stringify(users));
      
      // В реальном приложении здесь будет отправка email с токеном
      console.log(`Ссылка для подтверждения: /verify-email?token=${verificationToken}`);
      
      return { 
        success: true, 
        message: `Регистрация успешна! Проверьте вашу почту для подтверждения.
        (Для тестирования используйте: /verify-email?token=${verificationToken})` 
      };
    } catch (error) {
      console.error('Ошибка при регистрации:', error);
      return { success: false, message: 'Произошла ошибка при регистрации' };
    } finally {
      setIsLoading(false);
    }
  };

  // Подтверждение email
  const verifyEmail = async (token: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const usersData = localStorage.getItem('sce_users');
      if (!usersData) return false;
      
      const users = JSON.parse(usersData) as User[];
      const userIndex = users.findIndex(u => u.verificationToken === token);
      
      if (userIndex === -1) return false;
      
      // Подтверждаем email и удаляем токен
      users[userIndex].isEmailVerified = true;
      delete users[userIndex].verificationToken;
      
      localStorage.setItem('sce_users', JSON.stringify(users));
      
      return true;
    } catch (error) {
      console.error('Ошибка при подтверждении email:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
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
