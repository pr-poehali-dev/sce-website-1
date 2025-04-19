import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SCEClassType, SCEObject } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';

// Схема валидации для объекта SCE
const sceObjectSchema = z.object({
  number: z.string().min(1, 'Номер объекта обязателен'),
  name: z.string().min(1, 'Название объекта обязательно'),
  classType: z.nativeEnum(SCEClassType, {
    errorMap: () => ({ message: 'Выберите класс объекта' }),
  }),
  description: z.string().min(20, 'Описание должно содержать минимум 20 символов'),
  containment: z.string().min(20, 'Процедуры содержания должны содержать минимум 20 символов'),
  additionalInfo: z.string().optional(),
  status: z.enum(['active', 'archived', 'pending'], {
    errorMap: () => ({ message: 'Выберите статус объекта' }),
  }),
});

type FormValues = z.infer<typeof sceObjectSchema>;

interface SCEObjectFormProps {
  initialData?: SCEObject;
  onSubmit: (data: FormValues) => Promise<void>;
  isLoading: boolean;
}

const SCEObjectForm = ({ initialData, onSubmit, isLoading }: SCEObjectFormProps) => {
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(sceObjectSchema),
    defaultValues: initialData || {
      number: '',
      name: '',
      classType: undefined,
      description: '',
      containment: '',
      additionalInfo: '',
      status: 'active',
    },
  });

  const handleSubmit = async (values: FormValues) => {
    try {
      setError(null);
      await onSubmit(values);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Произошла ошибка при сохранении объекта');
      }
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: error || 'Произошла ошибка при сохранении объекта',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Номер объекта */}
          <FormField
            control={form.control}
            name="number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Номер объекта</FormLabel>
                <FormControl>
                  <Input placeholder="Например: 173" {...field} />
                </FormControl>
                <FormDescription>
                  Уникальный номер для идентификации объекта SCE
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Название объекта */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Название объекта</FormLabel>
                <FormControl>
                  <Input placeholder="Название объекта" {...field} />
                </FormControl>
                <FormDescription>
                  Краткое название или обозначение объекта
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Класс объекта */}
          <FormField
            control={form.control}
            name="classType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Класс объекта</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите класс объекта" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={SCEClassType.SAFE}>SAFE</SelectItem>
                    <SelectItem value={SCEClassType.EUCLID}>EUCLID</SelectItem>
                    <SelectItem value={SCEClassType.KETER}>KETER</SelectItem>
                    <SelectItem value={SCEClassType.THAUMIEL}>THAUMIEL</SelectItem>
                    <SelectItem value={SCEClassType.NEUTRALIZED}>NEUTRALIZED</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Классификация опасности объекта
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Статус объекта */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Статус объекта</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите статус" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">Активный</SelectItem>
                    <SelectItem value="archived">Архивный</SelectItem>
                    <SelectItem value="pending">На рассмотрении</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Текущий статус объекта в базе данных
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Описание объекта */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Описание объекта</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Подробное описание объекта SCE"
                  className="h-32"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Детальное описание внешнего вида, свойств и особенностей объекта
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Процедуры содержания */}
        <FormField
          control={form.control}
          name="containment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Процедуры содержания</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Описание процедур содержания объекта"
                  className="h-32"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Подробные инструкции по содержанию и обращению с объектом
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Дополнительная информация */}
        <FormField
          control={form.control}
          name="additionalInfo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Дополнительная информация</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Дополнительные сведения, история обнаружения, инциденты и т.д."
                  className="h-32"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Необязательное поле для дополнительных сведений об объекте
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Кнопка отправки формы */}
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Сохранение...' : initialData ? 'Обновить объект' : 'Создать объект'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SCEObjectForm;
