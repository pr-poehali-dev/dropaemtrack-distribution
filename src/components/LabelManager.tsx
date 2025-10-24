import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Label {
  id: number;
  name: string;
  description: string;
  artist_count: number;
  total_tracks: number;
  total_streams: number;
  logo_url?: string;
}

interface Artist {
  id: number;
  username: string;
  full_name: string;
  role: string;
  tracks: number;
}

const mockLabels: Label[] = [
  {
    id: 1,
    name: 'Electronic Beats Records',
    description: 'Лейбл электронной музыки',
    artist_count: 12,
    total_tracks: 145,
    total_streams: 5600000,
  },
  {
    id: 2,
    name: 'Urban Sound Collective',
    description: 'Hip-hop и urban музыка',
    artist_count: 8,
    total_tracks: 92,
    total_streams: 3200000,
  },
];

const mockArtists: Artist[] = [
  { id: 1, username: 'djalex', full_name: 'DJ Alex', role: 'Основатель', tracks: 25 },
  { id: 2, username: 'sarahconnor', full_name: 'Sarah Connor', role: 'Артист', tracks: 18 },
  { id: 3, username: 'mcrhythm', full_name: 'MC Rhythm', role: 'Артист', tracks: 12 },
];

const LabelManager = () => {
  const [labels, setLabels] = useState<Label[]>(mockLabels);
  const [selectedLabel, setSelectedLabel] = useState<Label | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newLabel, setNewLabel] = useState({
    name: '',
    description: '',
  });

  const createLabel = () => {
    if (!newLabel.name.trim()) return;

    const label: Label = {
      id: labels.length + 1,
      name: newLabel.name,
      description: newLabel.description,
      artist_count: 1,
      total_tracks: 0,
      total_streams: 0,
    };

    setLabels([...labels, label]);
    setNewLabel({ name: '', description: '' });
    setIsCreateOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h3 className="text-xl font-semibold">Музыкальные лейблы</h3>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Icon name="Plus" size={18} />
              Создать лейбл
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Новый лейбл</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Название</Label>
                <Input
                  id="name"
                  placeholder="Название лейбла"
                  value={newLabel.name}
                  onChange={(e) => setNewLabel({ ...newLabel, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  placeholder="Описание лейбла"
                  value={newLabel.description}
                  onChange={(e) => setNewLabel({ ...newLabel, description: e.target.value })}
                />
              </div>
              <Button onClick={createLabel} className="w-full">
                Создать
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {labels.map((label) => (
          <Card key={label.id} className="p-6 hover:bg-card/80 transition-colors cursor-pointer"
            onClick={() => setSelectedLabel(label)}
          >
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name="Music" size={28} className="text-primary-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-lg mb-1">{label.name}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">{label.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                <div>
                  <p className="text-2xl font-bold text-primary">{label.artist_count}</p>
                  <p className="text-xs text-muted-foreground">Артистов</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-500">{label.total_tracks}</p>
                  <p className="text-xs text-muted-foreground">Треков</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-accent">
                    {(label.total_streams / 1000000).toFixed(1)}M
                  </p>
                  <p className="text-xs text-muted-foreground">Прослушиваний</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 gap-2">
                  <Icon name="Users" size={16} />
                  Управление
                </Button>
                <Button variant="ghost" size="icon">
                  <Icon name="MoreVertical" size={18} />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {selectedLabel && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-semibold flex items-center gap-2">
              <Icon name="Users" size={20} />
              Артисты лейбла "{selectedLabel.name}"
            </h4>
            <Button variant="outline" className="gap-2">
              <Icon name="UserPlus" size={16} />
              Добавить артиста
            </Button>
          </div>

          <div className="grid gap-4">
            {mockArtists.map((artist) => (
              <div key={artist.id} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground font-semibold">
                      {artist.full_name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{artist.full_name}</p>
                    <p className="text-sm text-muted-foreground">@{artist.username}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Badge variant="outline">{artist.role}</Badge>
                  <div className="text-right">
                    <p className="text-xl font-bold text-primary">{artist.tracks}</p>
                    <p className="text-xs text-muted-foreground">треков</p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Icon name="MoreVertical" size={18} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default LabelManager;
