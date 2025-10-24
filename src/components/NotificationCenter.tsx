import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Notification {
  id: number;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: 1,
    type: 'success',
    title: 'Трек одобрен',
    message: 'Ваш трек "Summer Vibes" прошел модерацию и опубликован',
    timestamp: '2 минуты назад',
    read: false,
  },
  {
    id: 2,
    type: 'warning',
    title: 'Требуются правки',
    message: 'К треку "Night Drive" есть комментарии от модератора',
    timestamp: '1 час назад',
    read: false,
  },
  {
    id: 3,
    type: 'info',
    title: 'Новая выплата',
    message: 'Доступна выплата $342.50 за октябрь 2024',
    timestamp: '3 часа назад',
    read: false,
  },
  {
    id: 4,
    type: 'success',
    title: 'Достижение',
    message: 'Ваш трек набрал 1 млн прослушиваний!',
    timestamp: 'Вчера',
    read: true,
  },
  {
    id: 5,
    type: 'info',
    title: 'Новый трек на модерации',
    message: 'DJ Alex загрузил новый трек "Ocean Waves"',
    timestamp: '2 дня назад',
    read: true,
  },
];

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return { name: 'CheckCircle', color: 'text-primary' };
      case 'warning':
        return { name: 'AlertTriangle', color: 'text-yellow-500' };
      case 'error':
        return { name: 'XCircle', color: 'text-destructive' };
      case 'info':
        return { name: 'Info', color: 'text-blue-500' };
    }
  };

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Icon name="Bell" size={20} />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96">
        <div className="flex items-center justify-between p-3 border-b border-border">
          <h3 className="font-semibold">Уведомления</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="h-7 text-xs"
            >
              Прочитать все
            </Button>
          )}
        </div>
        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Icon name="Bell" size={48} className="mx-auto mb-3 text-muted-foreground opacity-50" />
              <p className="text-sm text-muted-foreground">Нет уведомлений</p>
            </div>
          ) : (
            notifications.map((notification) => {
              const iconData = getIcon(notification.type);
              return (
                <DropdownMenuItem
                  key={notification.id}
                  className={`p-4 cursor-pointer ${
                    !notification.read ? 'bg-primary/5' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex gap-3 w-full">
                    <Icon
                      name={iconData.name as any}
                      size={20}
                      className={`flex-shrink-0 ${iconData.color}`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="font-semibold text-sm">{notification.title}</p>
                        {!notification.read && (
                          <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {notification.timestamp}
                      </p>
                    </div>
                  </div>
                </DropdownMenuItem>
              );
            })
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationCenter;
