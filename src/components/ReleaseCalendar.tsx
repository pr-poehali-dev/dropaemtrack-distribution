import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Release {
  id: number;
  track_title: string;
  artist: string;
  release_date: string;
  platforms: string[];
  status: 'scheduled' | 'in_progress' | 'published';
  cover_url?: string;
}

const mockReleases: Release[] = [
  {
    id: 1,
    track_title: 'Night Vibes',
    artist: 'DJ Alex',
    release_date: '2025-11-01',
    platforms: ['Spotify', 'Apple Music', 'YouTube Music'],
    status: 'scheduled',
  },
  {
    id: 2,
    track_title: 'Electric Dreams',
    artist: 'DJ Alex',
    release_date: '2025-11-15',
    platforms: ['Spotify', 'Apple Music', 'Deezer', 'Tidal'],
    status: 'scheduled',
  },
  {
    id: 3,
    track_title: 'Sunset Boulevard',
    artist: 'Sarah Connor',
    release_date: '2025-10-28',
    platforms: ['Spotify', 'Apple Music'],
    status: 'in_progress',
  },
  {
    id: 4,
    track_title: 'Digital Love',
    artist: 'DJ Alex',
    release_date: '2025-12-01',
    platforms: ['All Platforms'],
    status: 'scheduled',
  },
];

const ReleaseCalendar = () => {
  const [releases, setReleases] = useState<Release[]>(mockReleases);
  const [filterMonth, setFilterMonth] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
      case 'in_progress':
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'published':
        return 'bg-primary/20 text-primary border-primary/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'Запланирован';
      case 'in_progress':
        return 'В процессе';
      case 'published':
        return 'Опубликован';
      default:
        return status;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getDaysUntil = (dateStr: string) => {
    const now = new Date();
    const release = new Date(dateStr);
    const diff = Math.ceil((release.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diff < 0) return 'Прошедший';
    if (diff === 0) return 'Сегодня';
    if (diff === 1) return 'Завтра';
    return `Через ${diff} дней`;
  };

  const filteredReleases = releases.filter((release) => {
    if (filterStatus !== 'all' && release.status !== filterStatus) return false;
    if (filterMonth !== 'all') {
      const releaseMonth = new Date(release.release_date).getMonth();
      if (releaseMonth !== parseInt(filterMonth)) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h3 className="text-xl font-semibold">Календарь релизов</h3>
        <div className="flex flex-wrap gap-2">
          <Select value={filterMonth} onValueChange={setFilterMonth}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Все месяцы" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все месяцы</SelectItem>
              <SelectItem value="9">Октябрь</SelectItem>
              <SelectItem value="10">Ноябрь</SelectItem>
              <SelectItem value="11">Декабрь</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Все статусы" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все статусы</SelectItem>
              <SelectItem value="scheduled">Запланирован</SelectItem>
              <SelectItem value="in_progress">В процессе</SelectItem>
              <SelectItem value="published">Опубликован</SelectItem>
            </SelectContent>
          </Select>

          <Button className="gap-2">
            <Icon name="Plus" size={18} />
            <span className="hidden sm:inline">Запланировать релиз</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredReleases.map((release) => (
          <Card key={release.id} className="p-6 hover:bg-card/80 transition-colors">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name="Calendar" size={32} className="text-primary-foreground" />
              </div>

              <div className="flex-1 space-y-3 w-full">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-lg font-semibold">{release.track_title}</h4>
                  <Badge variant="outline" className={getStatusColor(release.status)}>
                    {getStatusText(release.status)}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Icon name="User" size={14} />
                    <span>{release.artist}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Icon name="Calendar" size={14} />
                    <span>{formatDate(release.release_date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground sm:col-span-2">
                    <Icon name="Music" size={14} />
                    <span>{release.platforms.join(', ')}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-primary/10">
                    <Icon name="Clock" size={12} className="mr-1" />
                    {getDaysUntil(release.release_date)}
                  </Badge>
                </div>
              </div>

              <div className="flex gap-2 w-full md:w-auto">
                <Button variant="outline" className="flex-1 md:flex-initial gap-2">
                  <Icon name="Edit" size={16} />
                  <span className="hidden sm:inline">Изменить</span>
                </Button>
                <Button variant="ghost" size="icon">
                  <Icon name="MoreVertical" size={18} />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredReleases.length === 0 && (
        <Card className="p-12 text-center">
          <Icon name="Calendar" size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">Нет запланированных релизов</p>
          <Button className="mt-4 gap-2">
            <Icon name="Plus" size={18} />
            Запланировать первый релиз
          </Button>
        </Card>
      )}
    </div>
  );
};

export default ReleaseCalendar;
