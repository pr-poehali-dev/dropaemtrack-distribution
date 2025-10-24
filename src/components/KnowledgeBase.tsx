import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface Article {
  id: number;
  title: string;
  category: string;
  content: string;
  icon: string;
}

const articles: Article[] = [
  {
    id: 1,
    title: 'Как загрузить трек?',
    category: 'Начало работы',
    icon: 'Upload',
    content: 'Нажмите кнопку "Загрузить трек" в верхней части страницы. Выберите аудиофайл (MP3, WAV, FLAC) и обложку (JPG, PNG). Заполните метаданные: название, жанр, BPM, тональность. После проверки модератором трек будет опубликован на платформах.',
  },
  {
    id: 2,
    title: 'Требования к аудиофайлам',
    category: 'Техническая информация',
    icon: 'FileAudio',
    content: 'Поддерживаемые форматы: MP3 (320 kbps), WAV (44.1/48 kHz, 16/24 bit), FLAC. Максимальный размер: 200 МБ. Рекомендуем использовать мастеринг с уровнем -14 LUFS для стриминговых платформ.',
  },
  {
    id: 3,
    title: 'Требования к обложкам',
    category: 'Техническая информация',
    icon: 'Image',
    content: 'Минимальное разрешение: 3000x3000 пикселей. Формат: JPG или PNG. Размер файла: до 10 МБ. Обложка должна быть квадратной и без текста с контактами или ценами.',
  },
  {
    id: 4,
    title: 'Как работает модерация?',
    category: 'Модерация',
    icon: 'CheckSquare',
    content: 'После загрузки трек попадает на проверку модератору. Проверяется качество аудио, соответствие метаданных, права на музыку. Модерация занимает 1-3 рабочих дня. Вы получите уведомление о результате.',
  },
  {
    id: 5,
    title: 'Как рассчитывается доход?',
    category: 'Финансы',
    icon: 'DollarSign',
    content: 'Доход зависит от количества прослушиваний и платформы. Spotify: $0.003-0.005 за стрим, Apple Music: $0.007-0.010, YouTube Music: $0.002-0.004. Выплаты происходят ежемесячно при накоплении минимум $50.',
  },
  {
    id: 6,
    title: 'На каких платформах публикуется музыка?',
    category: 'Дистрибуция',
    icon: 'Globe',
    content: 'Ваша музыка автоматически публикуется на: Spotify, Apple Music, YouTube Music, Deezer, Tidal, Amazon Music, Яндекс.Музыка, VK Музыка и еще 150+ платформах по всему миру.',
  },
  {
    id: 7,
    title: 'Как запланировать релиз?',
    category: 'Релизы',
    icon: 'Calendar',
    content: 'Перейдите в раздел "Календарь релизов". Выберите дату (минимум за 14 дней до публикации), выберите трек и платформы. Трек автоматически опубликуется в указанную дату.',
  },
  {
    id: 8,
    title: 'Что такое ISRC код?',
    category: 'Техническая информация',
    icon: 'Hash',
    content: 'ISRC (International Standard Recording Code) — уникальный код трека для идентификации на всех платформах. Мы автоматически генерируем ISRC для каждого вашего трека.',
  },
  {
    id: 9,
    title: 'Как создать плейлист?',
    category: 'Плейлисты',
    icon: 'ListMusic',
    content: 'В разделе "Плейлисты" нажмите "Создать плейлист". Задайте название, описание и добавьте треки. Плейлист можно сделать публичным для продвижения своей музыки.',
  },
  {
    id: 10,
    title: 'Как работают уведомления Telegram?',
    category: 'Настройки',
    icon: 'Bell',
    content: 'Подключите Telegram бот в настройках профиля. Вы будете получать уведомления о модерации, новых прослушиваниях, выплатах и сообщениях от команды.',
  },
];

const KnowledgeBase = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(articles.map(a => a.category)));

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold">База знаний</h3>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Поиск по базе знаний..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge
            variant={selectedCategory === null ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setSelectedCategory(null)}
          >
            Все категории
          </Badge>
          {categories.map(category => (
            <Badge
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>

      <Card className="p-6">
        <Accordion type="single" collapsible className="w-full">
          {filteredArticles.map((article, index) => (
            <AccordionItem key={article.id} value={`item-${article.id}`}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3 text-left">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon name={article.icon as any} size={16} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{article.title}</p>
                    <p className="text-xs text-muted-foreground">{article.category}</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pl-11 pr-4 pt-2 text-muted-foreground">
                  {article.content}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <Icon name="Search" size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">Ничего не найдено</p>
            <p className="text-sm text-muted-foreground mt-2">Попробуйте изменить поисковый запрос</p>
          </div>
        )}
      </Card>

      <Card className="p-6 bg-gradient-to-br from-primary/10 to-background">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
            <Icon name="HelpCircle" size={24} className="text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold mb-2">Не нашли ответ?</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Свяжитесь с нашей службой поддержки, и мы поможем вам разобраться
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
                <Icon name="Mail" size={12} className="mr-1" />
                support@dropaemtrack.com
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
                <Icon name="MessageSquare" size={12} className="mr-1" />
                Чат с поддержкой
              </Badge>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default KnowledgeBase;
