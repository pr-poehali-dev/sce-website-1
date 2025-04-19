import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { User, UserRole } from '@/types';

const Users = () => {
  const { getAllUsers, updateUserRole } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Загружаем пользователей при монтировании компонента
  useEffect(() => {
    const allUsers = getAllUsers();
    setUsers(allUsers);
  }, [getAllUsers]);

  // Обновление роли пользователя
  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      setIsLoading(true);
      const success = await updateUserRole(userId, newRole as UserRole);
      
      if (success) {
        // Обновляем список пользователей
        const updatedUsers = getAllUsers();
        setUsers(updatedUsers);
        
        toast({
          title: 'Роль обновлена',
          description: 'Роль пользователя успешно изменена.',
        });
      } else {
        throw new Error('Не удалось обновить роль пользователя');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Не удалось обновить роль пользователя',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Управление пользователями</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Список пользователей</CardTitle>
        </CardHeader>
        <CardContent>
          {users.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4">Имя пользователя</th>
                    <th className="text-left py-2 px-4">Email</th>
                    <th className="text-left py-2 px-4">Роль</th>
                    <th className="text-left py-2 px-4">Статус</th>
                    <th className="text-center py-2 px-4">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-muted/50">
                      <td className="py-2 px-4">{user.username}</td>
                      <td className="py-2 px-4">{user.email}</td>
                      <td className="py-2 px-4">
                        <Select
                          value={user.role}
                          onValueChange={(value) => handleRoleChange(user.id, value)}
                          disabled={isLoading}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Выберите роль" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={UserRole.ADMIN}>Администратор</SelectItem>
                            <SelectItem value={UserRole.RESEARCHER}>Исследователь</SelectItem>
                            <SelectItem value={UserRole.AGENT}>Агент</SelectItem>
                            <SelectItem value={UserRole.SECURITY}>Безопасность</SelectItem>
                            <SelectItem value={UserRole.DOCTOR}>Врач</SelectItem>
                            <SelectItem value={UserRole.READER}>Читатель</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="py-2 px-4">
                        {user.isEmailVerified ? (
                          <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                            Подтвержден
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                            Ожидает подтверждения
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-4 text-center">
                        <Button size="sm" variant="outline" disabled>Профиль</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground">Пользователи не найдены</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Users;
