import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Playlist {
  id: number;
  title: string;
  description: string;
  is_public: boolean;
  track_count: number;
  cover_url?: string;
}

const mockPlaylists: Playlist[] = [
  {
    id: 1,
    title: 'Мои лучшие треки',
    description: 'Топовые треки за 2025 год',
    is_public: true,
    track_count: 12,
  },
  {
    id: 2,
    title: 'В работе',
    description: 'Треки в процессе производства',
    is_public: false,
    track_count: 5,
  },
  {
    id: 3,
    title: 'Коллаборации',
    description: 'Совместные проекты с другими артистами',
    is_public: true,
    track_count: 8,
  },
];

const PlaylistManager = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>(mockPlaylists);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newPlaylist, setNewPlaylist] = useState({
    title: '',
    description: '',
    is_public: false,
  });

  const createPlaylist = () => {
    if (!newPlaylist.title.trim()) return;

    const playlist: Playlist = {
      id: playlists.length + 1,
      title: newPlaylist.title,
      description: newPlaylist.description,
      is_public: newPlaylist.is_public,
      track_count: 0,
    };

    setPlaylists([...playlists, playlist]);
    setNewPlaylist({ title: '', description: '', is_public: false });
    setIsCreateOpen(false);
  };

  const togglePublic = (id: number) => {
    setPlaylists(
      playlists.map((p) =>
        p.id === id ? { ...p, is_public: !p.is_public } : p
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Плейлисты</h3>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Icon name="Plus" size={18} />
              Создать плейлист
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Новый плейлист</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Название</Label>
                <Input
                  id="title"
                  placeholder="Название плейлиста"
                  value={newPlaylist.title}
                  onChange={(e) =>
                    setNewPlaylist({ ...newPlaylist, title: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  placeholder="Описание плейлиста"
                  value={newPlaylist.description}
                  onChange={(e) =>
                    setNewPlaylist({ ...newPlaylist, description: e.target.value })
                  }
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_public"
                  checked={newPlaylist.is_public}
                  onCheckedChange={(checked) =>
                    setNewPlaylist({ ...newPlaylist, is_public: checked })
                  }
                />
                <Label htmlFor="is_public">Публичный плейлист</Label>
              </div>
              <Button onClick={createPlaylist} className="w-full">
                Создать
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {playlists.map((playlist) => (
          <Card key={playlist.id} className="p-6 hover:bg-card/80 transition-colors">
            <div className="space-y-4">
              <div className="w-full h-40 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
                <Icon name="Music" size={48} className="text-primary" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold text-lg">{playlist.title}</h4>
                  <Badge variant={playlist.is_public ? 'default' : 'outline'}>
                    <Icon 
                      name={playlist.is_public ? 'Globe' : 'Lock'} 
                      size={12} 
                      className="mr-1" 
                    />
                    {playlist.is_public ? 'Публичный' : 'Приватный'}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {playlist.description}
                </p>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Icon name="Music" size={14} />
                  <span>{playlist.track_count} треков</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 gap-2">
                  <Icon name="Play" size={16} />
                  Открыть
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => togglePublic(playlist.id)}
                >
                  <Icon name={playlist.is_public ? 'Lock' : 'Globe'} size={18} />
                </Button>
                <Button variant="ghost" size="icon">
                  <Icon name="MoreVertical" size={18} />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PlaylistManager;
