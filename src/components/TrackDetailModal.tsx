import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { Textarea } from '@/components/ui/textarea';

interface Track {
  id: number;
  title: string;
  artist: string;
  status: string;
  streams: number;
  uploadDate: string;
  genre: string;
}

interface TrackDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  track: Track | null;
}

const platformLinks = [
  { name: 'Spotify', url: 'https://open.spotify.com', icon: 'Music', active: true },
  { name: 'Apple Music', url: 'https://music.apple.com', icon: 'Music', active: true },
  { name: 'YouTube Music', url: 'https://music.youtube.com', icon: 'Youtube', active: true },
  { name: 'Deezer', url: 'https://deezer.com', icon: 'Music', active: false },
  { name: 'Tidal', url: 'https://tidal.com', icon: 'Music', active: true },
];

const statusHistory = [
  { status: 'Опубликовано', date: '2024-10-22 14:30', comment: 'Трек успешно опубликован на всех площадках', user: 'Система' },
  { status: 'Одобрено', date: '2024-10-21 16:45', comment: 'Качество аудио и обложки соответствует стандартам', user: 'Модератор Иван' },
  { status: 'На модерации', date: '2024-10-20 10:15', comment: 'Трек отправлен на проверку', user: 'Система' },
  { status: 'Загружено', date: '2024-10-20 10:00', comment: 'Трек загружен артистом', user: 'DJ Alex' },
];

const analytics = {
  daily: [
    { day: 'Пн', plays: 12450 },
    { day: 'Вт', plays: 15230 },
    { day: 'Ср', plays: 18900 },
    { day: 'Чт', plays: 21300 },
    { day: 'Пт', plays: 25600 },
    { day: 'Сб', plays: 28900 },
    { day: 'Вс', plays: 22100 },
  ],
  countries: [
    { name: 'Россия', percentage: 45, plays: 56340 },
    { name: 'США', percentage: 25, plays: 31285 },
    { name: 'Германия', percentage: 15, plays: 18771 },
    { name: 'Франция', percentage: 10, plays: 12514 },
    { name: 'Другие', percentage: 5, plays: 6257 },
  ],
};

const TrackDetailModal = ({ open, onOpenChange, track }: TrackDetailModalProps) => {
  if (!track) return null;

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary/40 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name="Music" size={48} className="text-primary-foreground" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-3xl mb-2">{track.title}</DialogTitle>
              <div className="flex items-center gap-3 text-muted-foreground mb-3">
                <span className="flex items-center gap-1">
                  <Icon name="User" size={16} />
                  {track.artist}
                </span>
                <span className="flex items-center gap-1">
                  <Icon name="Tag" size={16} />
                  {track.genre}
                </span>
                <span className="flex items-center gap-1">
                  <Icon name="Calendar" size={16} />
                  {track.uploadDate}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className={getStatusColor(track.status)}>
                  {getStatusText(track.status)}
                </Badge>
                <div className="flex items-center gap-2 text-sm">
                  <Icon name="Eye" size={16} className="text-primary" />
                  <span className="font-bold text-primary">{track.streams.toLocaleString()}</span>
                  <span className="text-muted-foreground">прослушиваний</span>
                </div>
              </div>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="info" className="mt-6">
          <TabsList className="w-full justify-start bg-card border border-border">
            <TabsTrigger value="info" className="gap-2">
              <Icon name="Info" size={16} />
              Информация
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <Icon name="BarChart3" size={16} />
              Аналитика
            </TabsTrigger>
            <TabsTrigger value="platforms" className="gap-2">
              <Icon name="Globe" size={16} />
              Площадки
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <Icon name="Clock" size={16} />
              История
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-6 mt-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Детали трека</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Название</p>
                  <p className="font-semibold">{track.title}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Артист</p>
                  <p className="font-semibold">{track.artist}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Жанр</p>
                  <p className="font-semibold">{track.genre}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Дата релиза</p>
                  <p className="font-semibold">{track.uploadDate}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">ISRC</p>
                  <p className="font-semibold">USRC17607839</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">UPC</p>
                  <p className="font-semibold">123456789012</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Описание</h3>
              <p className="text-muted-foreground leading-relaxed">
                Летний трек с позитивными вибрациями, созданный для солнечных дней и хорошего настроения. 
                Электронные биты сочетаются с мелодичными синтезаторами, создавая атмосферу беззаботного отдыха.
              </p>
            </Card>

            {track.status === 'needs_revision' && (
              <Card className="p-6 border-accent/30 bg-accent/5">
                <div className="flex items-start gap-3 mb-4">
                  <Icon name="AlertTriangle" size={20} className="text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-accent">Комментарии модератора</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Пожалуйста, внесите следующие изменения перед повторной отправкой:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Обложка должна быть минимум 3000x3000px</li>
                      <li>Необходимо улучшить качество мастеринга в диапазоне 2-4kHz</li>
                      <li>Добавьте корректный ISRC код</li>
                    </ul>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button className="gap-2">
                    <Icon name="Upload" size={16} />
                    Загрузить исправленную версию
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Icon name="MessageSquare" size={16} />
                    Связаться с модератором
                  </Button>
                </div>
              </Card>
            )}

            <div className="flex gap-3">
              <Button variant="outline" className="gap-2">
                <Icon name="Edit" size={16} />
                Редактировать
              </Button>
              <Button variant="outline" className="gap-2">
                <Icon name="Download" size={16} />
                Скачать файлы
              </Button>
              <Button variant="destructive" className="gap-2">
                <Icon name="Trash2" size={16} />
                Удалить трек
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6 mt-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Icon name="TrendingUp" size={20} className="text-primary" />
                Прослушивания по дням недели
              </h3>
              <div className="space-y-4">
                {analytics.daily.map((item) => {
                  const maxPlays = Math.max(...analytics.daily.map((d) => d.plays));
                  const percentage = (item.plays / maxPlays) * 100;
                  return (
                    <div key={item.day} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground font-medium">{item.day}</span>
                        <span className="font-bold">{item.plays.toLocaleString()} прослушиваний</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
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
                {analytics.countries.map((item, index) => (
                  <div key={item.name} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground font-medium">{item.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-muted-foreground">{item.plays.toLocaleString()}</span>
                        <span className="font-bold w-12 text-right">{item.percentage}%</span>
                      </div>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          index === 0 ? 'bg-primary' : index === 1 ? 'bg-blue-500' : index === 2 ? 'bg-yellow-500' : 'bg-accent'
                        } transition-all duration-500`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="platforms" className="space-y-4 mt-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Доступность на площадках</h3>
              <div className="space-y-3">
                {platformLinks.map((platform) => (
                  <div
                    key={platform.name}
                    className="flex items-center justify-between p-4 bg-muted/30 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Icon name={platform.icon as any} size={24} />
                      <div>
                        <p className="font-semibold">{platform.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {platform.active ? 'Опубликовано' : 'Ожидает публикации'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {platform.active ? (
                        <>
                          <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
                            Активно
                          </Badge>
                          <Button size="sm" variant="outline" className="gap-1">
                            <Icon name="ExternalLink" size={14} />
                            Открыть
                          </Button>
                        </>
                      ) : (
                        <Badge variant="outline" className="bg-muted text-muted-foreground">
                          Неактивно
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4 mt-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">История изменений</h3>
              <div className="space-y-4">
                {statusHistory.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-primary" />
                      {index < statusHistory.length - 1 && (
                        <div className="w-0.5 h-full bg-border mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-6">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold">{item.status}</p>
                        <span className="text-xs text-muted-foreground">{item.date}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{item.comment}</p>
                      <p className="text-xs text-muted-foreground">{item.user}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default TrackDetailModal;
