import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import Icon from '@/components/ui/icon';
import { Card } from '@/components/ui/card';

interface TrackUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const platforms = [
  { id: 'spotify', name: 'Spotify', icon: 'Music' },
  { id: 'apple', name: 'Apple Music', icon: 'Music' },
  { id: 'youtube', name: 'YouTube Music', icon: 'Youtube' },
  { id: 'deezer', name: 'Deezer', icon: 'Music' },
  { id: 'tidal', name: 'Tidal', icon: 'Music' },
  { id: 'amazon', name: 'Amazon Music', icon: 'Music' },
];

const genres = [
  'Electronic', 'Pop', 'Hip-Hop', 'Rock', 'Jazz', 'Classical',
  'R&B', 'Country', 'Reggae', 'Blues', 'Metal', 'Indie', 'Ambient'
];

const TrackUploadModal = ({ open, onOpenChange }: TrackUploadModalProps) => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState<'audio' | 'cover' | null>(null);

  const handleDrag = (e: React.DragEvent, type: 'audio' | 'cover') => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(type);
    } else if (e.type === 'dragleave') {
      setDragActive(null);
    }
  };

  const handleDrop = (e: React.DragEvent, type: 'audio' | 'cover') => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(null);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (type === 'audio') {
        setAudioFile(file);
      } else {
        setCoverFile(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'audio' | 'cover') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (type === 'audio') {
        setAudioFile(file);
      } else {
        setCoverFile(file);
      }
    }
  };

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId)
        ? prev.filter((id) => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Track submitted');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Icon name="Upload" size={24} className="text-primary" />
            Загрузить трек на дистрибуцию
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Название трека *</Label>
              <Input id="title" placeholder="Summer Vibes" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="artist">Имя артиста *</Label>
              <Input id="artist" placeholder="DJ Alex" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="genre">Жанр *</Label>
              <Select required>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите жанр" />
                </SelectTrigger>
                <SelectContent>
                  {genres.map((genre) => (
                    <SelectItem key={genre} value={genre.toLowerCase()}>
                      {genre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="releaseDate">Дата релиза *</Label>
              <Input id="releaseDate" type="date" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="isrc">ISRC код (опционально)</Label>
              <Input id="isrc" placeholder="USRC17607839" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="upc">UPC/EAN код (опционально)</Label>
              <Input id="upc" placeholder="123456789012" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              placeholder="Расскажите о треке, его истории создания..."
              rows={3}
            />
          </div>

          <div className="space-y-3">
            <Label>Аудиофайл *</Label>
            <Card
              className={`p-8 border-2 border-dashed transition-all cursor-pointer hover:border-primary/50 ${
                dragActive === 'audio' ? 'border-primary bg-primary/5' : ''
              } ${audioFile ? 'border-primary bg-primary/10' : ''}`}
              onDragEnter={(e) => handleDrag(e, 'audio')}
              onDragLeave={(e) => handleDrag(e, 'audio')}
              onDragOver={(e) => handleDrag(e, 'audio')}
              onDrop={(e) => handleDrop(e, 'audio')}
              onClick={() => document.getElementById('audio-file')?.click()}
            >
              <input
                id="audio-file"
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={(e) => handleFileChange(e, 'audio')}
                required
              />
              <div className="text-center">
                {audioFile ? (
                  <>
                    <Icon name="CheckCircle" size={48} className="mx-auto mb-3 text-primary" />
                    <p className="font-semibold text-primary mb-1">{audioFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(audioFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </>
                ) : (
                  <>
                    <Icon name="Music" size={48} className="mx-auto mb-3 text-muted-foreground" />
                    <p className="font-semibold mb-1">Перетащите аудиофайл сюда</p>
                    <p className="text-sm text-muted-foreground">или нажмите для выбора</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Поддерживаются: WAV, FLAC, MP3 (до 100 MB)
                    </p>
                  </>
                )}
              </div>
            </Card>
          </div>

          <div className="space-y-3">
            <Label>Обложка трека *</Label>
            <Card
              className={`p-8 border-2 border-dashed transition-all cursor-pointer hover:border-primary/50 ${
                dragActive === 'cover' ? 'border-primary bg-primary/5' : ''
              } ${coverFile ? 'border-primary bg-primary/10' : ''}`}
              onDragEnter={(e) => handleDrag(e, 'cover')}
              onDragLeave={(e) => handleDrag(e, 'cover')}
              onDragOver={(e) => handleDrag(e, 'cover')}
              onDrop={(e) => handleDrop(e, 'cover')}
              onClick={() => document.getElementById('cover-file')?.click()}
            >
              <input
                id="cover-file"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileChange(e, 'cover')}
                required
              />
              <div className="text-center">
                {coverFile ? (
                  <>
                    <Icon name="CheckCircle" size={48} className="mx-auto mb-3 text-primary" />
                    <p className="font-semibold text-primary mb-1">{coverFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(coverFile.size / 1024).toFixed(0)} KB
                    </p>
                  </>
                ) : (
                  <>
                    <Icon name="Image" size={48} className="mx-auto mb-3 text-muted-foreground" />
                    <p className="font-semibold mb-1">Перетащите обложку сюда</p>
                    <p className="text-sm text-muted-foreground">или нажмите для выбора</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Минимум 3000x3000px, JPG или PNG
                    </p>
                  </>
                )}
              </div>
            </Card>
          </div>

          <div className="space-y-3">
            <Label>Выберите платформы для дистрибуции *</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {platforms.map((platform) => (
                <Card
                  key={platform.id}
                  className={`p-4 cursor-pointer transition-all hover:border-primary/50 ${
                    selectedPlatforms.includes(platform.id)
                      ? 'border-primary bg-primary/10'
                      : ''
                  }`}
                  onClick={() => togglePlatform(platform.id)}
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={selectedPlatforms.includes(platform.id)}
                      onCheckedChange={() => togglePlatform(platform.id)}
                    />
                    <Icon name={platform.icon as any} size={20} />
                    <span className="font-medium text-sm">{platform.name}</span>
                  </div>
                </Card>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Выберите хотя бы одну платформу для публикации
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1 gap-2" disabled={selectedPlatforms.length === 0}>
              <Icon name="Send" size={18} />
              Отправить на модерацию
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TrackUploadModal;
