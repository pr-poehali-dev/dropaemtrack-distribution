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
import TrackUploadModal from '@/components/TrackUploadModal';
import NotificationCenter from '@/components/NotificationCenter';
import TrackDetailModal from '@/components/TrackDetailModal';
import SearchAndFilters from '@/components/SearchAndFilters';
import FinancialTab from '@/components/FinancialTab';
import ProfileSettings from '@/components/ProfileSettings';
import AdvancedAnalytics from '@/components/AdvancedAnalytics';
import ChatSystem from '@/components/ChatSystem';
import PlaylistManager from '@/components/PlaylistManager';
import ReleaseCalendar from '@/components/ReleaseCalendar';
import LabelManager from '@/components/LabelManager';
import KnowledgeBase from '@/components/KnowledgeBase';
import ThemeToggle from '@/components/ThemeToggle';
import { exportTrackData } from '@/utils/exportHelpers';

type UserRole = 'artist' | 'moderator' | 'manager' | 'admin';

interface Track {
  id: number;
  title: string;
  artist: string;
  status: string;
  streams: number;
  uploadDate: string;
  genre: string;
}

const mockTracks: Track[] = [
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
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [filteredTracks, setFilteredTracks] = useState<Track[]>(mockTracks);

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

  const handleTrackClick = (track: Track) => {
    setSelectedTrack(track);
    setDetailModalOpen(true);
  };

  const handleSearch = (query: string) => {
    const filtered = mockTracks.filter(
      (track) =>
        track.title.toLowerCase().includes(query.toLowerCase()) ||
        track.artist.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredTracks(filtered);
  };

  const handleFilterChange = (filters: any) => {
    let filtered = [...mockTracks];

    if (filters.status.length > 0) {
      filtered = filtered.filter((track) => filters.status.includes(track.status));
    }

    if (filters.genre.length > 0) {
      filtered = filtered.filter((track) => filters.genre.includes(track.genre));
    }

    if (filters.sortBy === 'date-desc') {
      filtered.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
    } else if (filters.sortBy === 'date-asc') {
      filtered.sort((a, b) => new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime());
    } else if (filters.sortBy === 'streams-desc') {
      filtered.sort((a, b) => b.streams - a.streams);
    } else if (filters.sortBy === 'title-asc') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    setFilteredTracks(filtered);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <Icon name="Music" size={24} className="text-primary-foreground" />
              </div>
              <h1 className="text-xl md:text-2xl font-bold">dropaemtrack</h1>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <Select value={currentRole} onValueChange={(value) => setCurrentRole(value as UserRole)}>
                <SelectTrigger className="w-[160px] md:w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="artist">👤 Артист</SelectItem>
                  <SelectItem value="moderator">✓ Модератор</SelectItem>
                  <SelectItem value="manager">📊 Руководитель</SelectItem>
                  <SelectItem value="admin">⚙️ Администратор</SelectItem>
                </SelectContent>
              </Select>
              <NotificationCenter />
              <ThemeToggle />
              <Button variant="ghost" size="icon">
                <Icon name="User" size={20} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            {currentRole === 'artist' && 'Панель артиста'}
            {currentRole === 'moderator' && 'Панель модератора'}
            {currentRole === 'manager' && 'Панель руководителя'}
            {currentRole === 'admin' && 'Админ-панель'}
          </h2>
          <p className="text-muted-foreground text-sm md:text-base">
            {currentRole === 'artist' && 'Управляйте своими треками и отслеживайте аналитику'}
            {currentRole === 'moderator' && 'Проверяйте и модерируйте загруженные треки'}
            {currentRole === 'manager' && 'Контролируйте процесс дистрибуции и аналитику'}
            {currentRole === 'admin' && 'Полный контроль над платформой'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <Card className="p-4 md:p-6 bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30">
            <div className="flex items-center justify-between mb-2">
              <Icon name="Music" size={20} className="text-primary md:w-6 md:h-6" />
              <Icon name="TrendingUp" size={16} className="text-primary md:w-5 md:h-5" />
            </div>
            <p className="text-2xl md:text-3xl font-bold mb-1">
              {currentRole === 'artist' ? '12' : '1,247'}
            </p>
            <p className="text-xs md:text-sm text-muted-foreground">Всего треков</p>
          </Card>

          <Card className="p-4 md:p-6 bg-gradient-to-br from-blue-500/20 to-blue-500/5 border-blue-500/30">
            <div className="flex items-center justify-between mb-2">
              <Icon name="Eye" size={20} className="text-blue-500 md:w-6 md:h-6" />
              <Icon name="TrendingUp" size={16} className="text-blue-500 md:w-5 md:h-5" />
            </div>
            <p className="text-2xl md:text-3xl font-bold mb-1">
              {currentRole === 'artist' ? '1.2M' : '45.8M'}
            </p>
            <p className="text-xs md:text-sm text-muted-foreground">Прослушиваний</p>
          </Card>

          <Card className="p-4 md:p-6 bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 border-yellow-500/30">
            <div className="flex items-center justify-between mb-2">
              <Icon name="Clock" size={20} className="text-yellow-500 md:w-6 md:h-6" />
              <Badge variant="outline" className="text-yellow-500 border-yellow-500/30 text-xs">
                Сегодня
              </Badge>
            </div>
            <p className="text-2xl md:text-3xl font-bold mb-1">
              {currentRole === 'artist' ? '2' : '38'}
            </p>
            <p className="text-xs md:text-sm text-muted-foreground">На модерации</p>
          </Card>

          <Card className="p-4 md:p-6 bg-gradient-to-br from-accent/20 to-accent/5 border-accent/30">
            <div className="flex items-center justify-between mb-2">
              <Icon name="DollarSign" size={20} className="text-accent md:w-6 md:h-6" />
              <Icon name="TrendingUp" size={16} className="text-accent md:w-5 md:h-5" />
            </div>
            <p className="text-2xl md:text-3xl font-bold mb-1">
              {currentRole === 'artist' ? '$3.2K' : '$127K'}
            </p>
            <p className="text-xs md:text-sm text-muted-foreground">Доход</p>
          </Card>
        </div>

        <Tabs defaultValue="tracks" className="space-y-6">
          <TabsList className="bg-card border border-border w-full overflow-x-auto flex-nowrap justify-start">
            <TabsTrigger value="tracks" className="gap-2 flex-shrink-0">
              <Icon name="Music" size={16} />
              <span className="hidden sm:inline">Треки</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2 flex-shrink-0">
              <Icon name="BarChart3" size={16} />
              <span className="hidden sm:inline">Аналитика</span>
            </TabsTrigger>
            {currentRole !== 'artist' && (
              <TabsTrigger value="moderation" className="gap-2 flex-shrink-0">
                <Icon name="CheckSquare" size={16} />
                <span className="hidden sm:inline">Модерация</span>
              </TabsTrigger>
            )}
            {(currentRole === 'manager' || currentRole === 'admin') && (
              <TabsTrigger value="users" className="gap-2 flex-shrink-0">
                <Icon name="Users" size={16} />
                <span className="hidden sm:inline">Пользователи</span>
              </TabsTrigger>
            )}
            <TabsTrigger value="finance" className="gap-2 flex-shrink-0">
              <Icon name="DollarSign" size={16} />
              <span className="hidden sm:inline">Финансы</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2 flex-shrink-0">
              <Icon name="Settings" size={16} />
              <span className="hidden sm:inline">Настройки</span>
            </TabsTrigger>
            <TabsTrigger value="chat" className="gap-2 flex-shrink-0">
              <Icon name="MessageSquare" size={16} />
              <span className="hidden sm:inline">Чат</span>
            </TabsTrigger>
            <TabsTrigger value="playlists" className="gap-2 flex-shrink-0">
              <Icon name="ListMusic" size={16} />
              <span className="hidden sm:inline">Плейлисты</span>
            </TabsTrigger>
            <TabsTrigger value="releases" className="gap-2 flex-shrink-0">
              <Icon name="Calendar" size={16} />
              <span className="hidden sm:inline">Релизы</span>
            </TabsTrigger>
            <TabsTrigger value="labels" className="gap-2 flex-shrink-0">
              <Icon name="Briefcase" size={16} />
              <span className="hidden sm:inline">Лейблы</span>
            </TabsTrigger>
            <TabsTrigger value="knowledge" className="gap-2 flex-shrink-0">
              <Icon name="BookOpen" size={16} />
              <span className="hidden sm:inline">База знаний</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tracks" className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h3 className="text-lg md:text-xl font-semibold">Мои треки</h3>
              <div className="flex gap-2 w-full sm:w-auto">
                {currentRole === 'artist' && (
                  <Button onClick={() => setUploadModalOpen(true)} className="gap-2 flex-1 sm:flex-initial">
                    <Icon name="Upload" size={18} />
                    <span className="hidden sm:inline">Загрузить трек</span>
                    <span className="sm:hidden">Загрузить</span>
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => exportTrackData(filteredTracks)}
                  className="gap-2"
                >
                  <Icon name="Download" size={18} />
                  <span className="hidden sm:inline">Экспорт</span>
                </Button>
              </div>
            </div>

            <SearchAndFilters onSearch={handleSearch} onFilterChange={handleFilterChange} />

            <div className="grid gap-4">
              {filteredTracks.map((track) => (
                <Card
                  key={track.id}
                  className="p-4 md:p-6 hover:bg-card/80 transition-colors cursor-pointer"
                  onClick={() => handleTrackClick(track)}
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-primary to-primary/40 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon name="Music" size={24} className="text-primary-foreground md:w-7 md:h-7" />
                    </div>
                    <div className="flex-1 min-w-0 w-full">
                      <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2">
                        <h4 className="text-base md:text-lg font-semibold">{track.title}</h4>
                        <Badge variant="outline" className={`${getStatusColor(track.status)} text-xs`}>
                          {getStatusText(track.status)}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs md:text-sm text-muted-foreground">
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
                    <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
                      <div className="text-right flex-shrink-0">
                        <p className="text-xl md:text-2xl font-bold text-primary">
                          {track.streams.toLocaleString()}
                        </p>
                        <p className="text-xs md:text-sm text-muted-foreground">прослушиваний</p>
                      </div>
                      {currentRole === 'moderator' && track.status === 'pending' && (
                        <div className="flex gap-2 flex-shrink-0">
                          <Button size="sm" variant="default" className="gap-1">
                            <Icon name="Check" size={16} />
                          </Button>
                          <Button size="sm" variant="destructive" className="gap-1">
                            <Icon name="X" size={16} />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <AdvancedAnalytics />
          </TabsContent>

          <TabsContent value="analytics-old" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <Card className="p-4 md:p-6">
                <h3 className="text-base md:text-lg font-semibold mb-4 flex items-center gap-2">
                  <Icon name="TrendingUp" size={20} className="text-primary" />
                  Прослушивания по дням
                </h3>
                <div className="space-y-4">
                  {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day) => {
                    const value = Math.random() * 100;
                    return (
                      <div key={day} className="space-y-2">
                        <div className="flex items-center justify-between text-xs md:text-sm">
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

              <Card className="p-4 md:p-6">
                <h3 className="text-base md:text-lg font-semibold mb-4 flex items-center gap-2">
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
                      <div className="flex items-center justify-between text-xs md:text-sm">
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
            </div>
          </TabsContent>

          {currentRole !== 'artist' && (
            <TabsContent value="moderation" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg md:text-xl font-semibold">Очередь модерации</h3>
                <Badge variant="outline" className="text-yellow-500 border-yellow-500/30">
                  {mockTracks.filter((t) => t.status === 'pending').length} треков ожидают
                </Badge>
              </div>
              <div className="grid gap-4">
                {mockTracks
                  .filter((t) => t.status === 'pending')
                  .map((track) => (
                    <Card key={track.id} className="p-4 md:p-6">
                      <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-primary to-primary/40 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon name="Music" size={28} className="text-primary-foreground md:w-8 md:h-8" />
                        </div>
                        <div className="flex-1 w-full">
                          <h4 className="text-lg md:text-xl font-semibold mb-2">{track.title}</h4>
                          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Артист</p>
                              <p className="font-semibold">{track.artist}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Жанр</p>
                              <p className="font-semibold">{track.genre}</p>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 md:gap-3">
                            <Button className="gap-2 flex-1 sm:flex-initial">
                              <Icon name="Check" size={18} />
                              <span className="hidden sm:inline">Одобрить</span>
                            </Button>
                            <Button variant="destructive" className="gap-2 flex-1 sm:flex-initial">
                              <Icon name="X" size={18} />
                              <span className="hidden sm:inline">Отклонить</span>
                            </Button>
                            <Button variant="outline" className="gap-2 w-full sm:w-auto">
                              <Icon name="MessageSquare" size={18} />
                              <span className="hidden sm:inline">Запросить правки</span>
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
                <h3 className="text-lg md:text-xl font-semibold">Управление пользователями</h3>
                <Button className="gap-2">
                  <Icon name="UserPlus" size={18} />
                  <span className="hidden sm:inline">Добавить</span>
                </Button>
              </div>
              <div className="grid gap-4">
                {[
                  { name: 'DJ Alex', role: 'Артист', tracks: 12, status: 'active' },
                  { name: 'Sarah Connor', role: 'Артист', tracks: 8, status: 'active' },
                  { name: 'John Moderator', role: 'Модератор', tracks: 0, status: 'active' },
                ].map((user, index) => (
                  <Card key={index} className="p-4 md:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/40 rounded-full flex items-center justify-center flex-shrink-0">
                          <Icon name="User" size={24} className="text-primary-foreground" />
                        </div>
                        <div>
                          <p className="font-semibold text-base md:text-lg">{user.name}</p>
                          <p className="text-xs md:text-sm text-muted-foreground">{user.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        {user.tracks > 0 && (
                          <div className="text-right">
                            <p className="text-xl md:text-2xl font-bold text-primary">{user.tracks}</p>
                            <p className="text-xs md:text-sm text-muted-foreground">треков</p>
                          </div>
                        )}
                        <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
                          Активен
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          )}

          <TabsContent value="finance">
            <FinancialTab />
          </TabsContent>

          <TabsContent value="settings">
            <ProfileSettings />
          </TabsContent>

          <TabsContent value="chat">
            <ChatSystem />
          </TabsContent>

          <TabsContent value="playlists">
            <PlaylistManager />
          </TabsContent>

          <TabsContent value="releases">
            <ReleaseCalendar />
          </TabsContent>

          <TabsContent value="labels">
            <LabelManager />
          </TabsContent>

          <TabsContent value="knowledge">
            <KnowledgeBase />
          </TabsContent>
        </Tabs>
      </main>

      <TrackUploadModal open={uploadModalOpen} onOpenChange={setUploadModalOpen} />
      <TrackDetailModal open={detailModalOpen} onOpenChange={setDetailModalOpen} track={selectedTrack} />
    </div>
  );
};

export default Index;