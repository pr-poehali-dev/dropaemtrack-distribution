import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type UserRole = 'artist' | 'moderator' | 'manager' | 'admin';

const mockTracks = [
  {
    id: 1,
    title: 'Summer Vibes',
    artist: 'DJ Alex',
    status: 'pending',
    streams: 125430,
    uploadDate: '2024-10-20',
    genre: 'Electronic',
  },
  {
    id: 2,
    title: 'Midnight Dreams',
    artist: 'Sarah Connor',
    status: 'approved',
    streams: 342890,
    uploadDate: '2024-10-18',
    genre: 'Pop',
  },
  {
    id: 3,
    title: 'Urban Flow',
    artist: 'MC Rhythm',
    status: 'published',
    streams: 567123,
    uploadDate: '2024-10-15',
    genre: 'Hip-Hop',
  },
  {
    id: 4,
    title: 'Ocean Waves',
    artist: 'Chill Master',
    status: 'needs_revision',
    streams: 89234,
    uploadDate: '2024-10-22',
    genre: 'Ambient',
  },
];

const Index = () => {
  const [currentRole, setCurrentRole] = useState<UserRole>('artist');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'approved':
        return 'bg-primary/20 text-primary border-primary/30';
      case 'published':
        return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
      case 'needs_revision':
        return 'bg-accent/20 text-accent border-accent/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'На модерации';
      case 'approved':
        return 'Одобрено';
      case 'published':
        return 'Опубликовано';
      case 'needs_revision':
        return 'Требует правок';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <Icon name="Music" size={24} className="text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold">dropaemtrack</h1>
            </div>
            <div className="flex items-center gap-4">
              <Select value={currentRole} onValueChange={(value) => setCurrentRole(value as UserRole)}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="artist">👤 Артист</SelectItem>
                  <SelectItem value="moderator">✓ Модератор</SelectItem>
                  <SelectItem value="manager">📊 Руководитель</SelectItem>
                  <SelectItem value="admin">⚙️ Администратор</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="ghost" size="icon">
                <Icon name="Bell" size={20} />
              </Button>
              <Button variant="ghost" size="icon">
                <Icon name="User" size={20} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">
            {currentRole === 'artist' && 'Панель артиста'}
            {currentRole === 'moderator' && 'Панель модератора'}
            {currentRole === 'manager' && 'Панель руководителя'}
            {currentRole === 'admin' && 'Админ-панель'}
          </h2>
          <p className="text-muted-foreground">
            {currentRole === 'artist' && 'Управляйте своими треками и отслеживайте аналитику'}
            {currentRole === 'moderator' && 'Проверяйте и модерируйте загруженные треки'}
            {currentRole === 'manager' && 'Контролируйте процесс дистрибуции и аналитику'}
            {currentRole === 'admin' && 'Полный контроль над платформой'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30">
            <div className="flex items-center justify-between mb-2">
              <Icon name="Music" size={24} className="text-primary" />
              <Icon name="TrendingUp" size={20} className="text-primary" />
            </div>
            <p className="text-3xl font-bold mb-1">
              {currentRole === 'artist' ? '12' : '1,247'}
            </p>
            <p className="text-sm text-muted-foreground">Всего треков</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-blue-500/20 to-blue-500/5 border-blue-500/30">
            <div className="flex items-center justify-between mb-2">
              <Icon name="Eye" size={24} className="text-blue-500" />
              <Icon name="TrendingUp" size={20} className="text-blue-500" />
            </div>
            <p className="text-3xl font-bold mb-1">
              {currentRole === 'artist' ? '1.2M' : '45.8M'}
            </p>
            <p className="text-sm text-muted-foreground">Прослушиваний</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 border-yellow-500/30">
            <div className="flex items-center justify-between mb-2">
              <Icon name="Clock" size={24} className="text-yellow-500" />
              <Badge variant="outline" className="text-yellow-500 border-yellow-500/30">
                Сегодня
              </Badge>
            </div>
            <p className="text-3xl font-bold mb-1">
              {currentRole === 'artist' ? '2' : '38'}
            </p>
            <p className="text-sm text-muted-foreground">На модерации</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-accent/20 to-accent/5 border-accent/30">
            <div className="flex items-center justify-between mb-2">
              <Icon name="DollarSign" size={24} className="text-accent" />
              <Icon name="TrendingUp" size={20} className="text-accent" />
            </div>
            <p className="text-3xl font-bold mb-1">
              {currentRole === 'artist' ? '$3.2K' : '$127K'}
            </p>
            <p className="text-sm text-muted-foreground">Доход</p>
          </Card>
        </div>

        <Tabs defaultValue="tracks" className="space-y-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="tracks" className="gap-2">
              <Icon name="Music" size={16} />
              Треки
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <Icon name="BarChart3" size={16} />
              Аналитика
            </TabsTrigger>
            {currentRole !== 'artist' && (
              <TabsTrigger value="moderation" className="gap-2">
                <Icon name="CheckSquare" size={16} />
                Модерация
              </TabsTrigger>
            )}
            {(currentRole === 'manager' || currentRole === 'admin') && (
              <TabsTrigger value="users" className="gap-2">
                <Icon name="Users" size={16} />
                Пользователи
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="tracks" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Мои треки</h3>
              {currentRole === 'artist' && (
                <Button className="gap-2">
                  <Icon name="Upload" size={18} />
                  Загрузить трек
                </Button>
              )}
            </div>

            <div className="grid gap-4">
              {mockTracks.map((track) => (
                <Card key={track.id} className="p-6 hover:bg-card/80 transition-colors">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/40 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon name="Music" size={28} className="text-primary-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-semibold">{track.title}</h4>
                        <Badge variant="outline" className={getStatusColor(track.status)}>
                          {getStatusText(track.status)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Icon name="User" size={14} />
                          {track.artist}
                        </span>
                        <span className="flex items-center gap-1">
                          <Icon name="Calendar" size={14} />
                          {track.uploadDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <Icon name="Tag" size={14} />
                          {track.genre}
                        </span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-2xl font-bold text-primary">
                        {track.streams.toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">прослушиваний</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      {currentRole === 'moderator' && track.status === 'pending' && (
                        <>
                          <Button size="sm" variant="default" className="gap-1">
                            <Icon name="Check" size={16} />
                            Одобрить
                          </Button>
                          <Button size="sm" variant="destructive" className="gap-1">
                            <Icon name="X" size={16} />
                            Отклонить
                          </Button>
                        </>
                      )}
                      {currentRole === 'artist' && (
                        <Button size="sm" variant="outline" className="gap-1">
                          <Icon name="MoreHorizontal" size={16} />
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Icon name="TrendingUp" size={20} className="text-primary" />
                  Прослушивания по дням
                </h3>
                <div className="space-y-4">
                  {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day, index) => {
                    const value = Math.random() * 100;
                    return (
                      <div key={day} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{day}</span>
                          <span className="font-semibold">
                            {(value * 1000).toFixed(0)} прослушиваний
                          </span>
                        </div>
                        <Progress value={value} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Icon name="Globe" size={20} className="text-blue-500" />
                  География слушателей
                </h3>
                <div className="space-y-4">
                  {[
                    { country: 'Россия', value: 45, color: 'bg-primary' },
                    { country: 'США', value: 25, color: 'bg-blue-500' },
                    { country: 'Германия', value: 15, color: 'bg-yellow-500' },
                    { country: 'Франция', value: 10, color: 'bg-accent' },
                    { country: 'Другие', value: 5, color: 'bg-muted' },
                  ].map((item) => (
                    <div key={item.country} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{item.country}</span>
                        <span className="font-semibold">{item.value}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.color} transition-all duration-500`}
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Icon name="Tag" size={20} className="text-accent" />
                  Популярные жанры
                </h3>
                <div className="space-y-3">
                  {[
                    { genre: 'Electronic', tracks: 342, percentage: 35 },
                    { genre: 'Pop', tracks: 289, percentage: 29 },
                    { genre: 'Hip-Hop', tracks: 198, percentage: 20 },
                    { genre: 'Ambient', tracks: 156, percentage: 16 },
                  ].map((item) => (
                    <div
                      key={item.genre}
                      className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                    >
                      <div>
                        <p className="font-semibold">{item.genre}</p>
                        <p className="text-sm text-muted-foreground">{item.tracks} треков</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">{item.percentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Icon name="Activity" size={20} className="text-primary" />
                  Активность платформы
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg border border-primary/20">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                        <Icon name="Upload" size={20} className="text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">Новые загрузки</p>
                        <p className="text-sm text-muted-foreground">За последние 24 часа</p>
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-primary">38</p>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                        <Icon name="CheckCircle" size={20} className="text-blue-500" />
                      </div>
                      <div>
                        <p className="font-semibold">Одобрено</p>
                        <p className="text-sm text-muted-foreground">За последние 24 часа</p>
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-blue-500">27</p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {currentRole !== 'artist' && (
            <TabsContent value="moderation" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Очередь модерации</h3>
                <Badge variant="outline" className="text-yellow-500 border-yellow-500/30">
                  {mockTracks.filter((t) => t.status === 'pending').length} треков ожидают
                </Badge>
              </div>
              <div className="grid gap-4">
                {mockTracks
                  .filter((t) => t.status === 'pending')
                  .map((track) => (
                    <Card key={track.id} className="p-6">
                      <div className="flex items-start gap-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/40 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon name="Music" size={32} className="text-primary-foreground" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xl font-semibold mb-2">{track.title}</h4>
                          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Артист</p>
                              <p className="font-semibold">{track.artist}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Жанр</p>
                              <p className="font-semibold">{track.genre}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Дата загрузки</p>
                              <p className="font-semibold">{track.uploadDate}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Статус</p>
                              <Badge variant="outline" className={getStatusColor(track.status)}>
                                {getStatusText(track.status)}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <Button className="gap-2">
                              <Icon name="Check" size={18} />
                              Одобрить
                            </Button>
                            <Button variant="destructive" className="gap-2">
                              <Icon name="X" size={18} />
                              Отклонить
                            </Button>
                            <Button variant="outline" className="gap-2">
                              <Icon name="MessageSquare" size={18} />
                              Запросить правки
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          )}

          {(currentRole === 'manager' || currentRole === 'admin') && (
            <TabsContent value="users" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Управление пользователями</h3>
                <Button className="gap-2">
                  <Icon name="UserPlus" size={18} />
                  Добавить пользователя
                </Button>
              </div>
              <div className="grid gap-4">
                {[
                  { name: 'DJ Alex', role: 'Артист', tracks: 12, status: 'active' },
                  { name: 'Sarah Connor', role: 'Артист', tracks: 8, status: 'active' },
                  { name: 'John Moderator', role: 'Модератор', tracks: 0, status: 'active' },
                  { name: 'Jane Manager', role: 'Руководитель', tracks: 0, status: 'active' },
                ].map((user, index) => (
                  <Card key={index} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/40 rounded-full flex items-center justify-center">
                          <Icon name="User" size={24} className="text-primary-foreground" />
                        </div>
                        <div>
                          <p className="font-semibold text-lg">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        {user.tracks > 0 && (
                          <div className="text-right">
                            <p className="text-2xl font-bold text-primary">{user.tracks}</p>
                            <p className="text-sm text-muted-foreground">треков</p>
                          </div>
                        )}
                        <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
                          {user.status === 'active' ? 'Активен' : 'Неактивен'}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Icon name="Settings" size={16} />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
