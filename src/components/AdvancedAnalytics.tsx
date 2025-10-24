import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';

interface AnalyticsData {
  daily: Array<{ date: string; streams: number; revenue: number }>;
  countries: Array<{ country: string; streams: number }>;
  platforms: Array<{ platform: string; streams: number; revenue: number }>;
  demographics: Array<{ age_group: string; percentage: number }>;
}

const mockData: AnalyticsData = {
  daily: [
    { date: '2025-10-18', streams: 12453, revenue: 124.53 },
    { date: '2025-10-19', streams: 15234, revenue: 152.34 },
    { date: '2025-10-20', streams: 18923, revenue: 189.23 },
    { date: '2025-10-21', streams: 16789, revenue: 167.89 },
    { date: '2025-10-22', streams: 19456, revenue: 194.56 },
    { date: '2025-10-23', streams: 22134, revenue: 221.34 },
    { date: '2025-10-24', streams: 20567, revenue: 205.67 },
  ],
  countries: [
    { country: 'Россия', streams: 456789 },
    { country: 'США', streams: 234567 },
    { country: 'Германия', streams: 123456 },
    { country: 'Франция', streams: 98765 },
    { country: 'Великобритания', streams: 87654 },
  ],
  platforms: [
    { platform: 'Spotify', streams: 345678, revenue: 3456.78 },
    { platform: 'Apple Music', streams: 234567, revenue: 2345.67 },
    { platform: 'YouTube Music', streams: 123456, revenue: 1234.56 },
    { platform: 'Deezer', streams: 87654, revenue: 876.54 },
    { platform: 'Tidal', streams: 45678, revenue: 456.78 },
  ],
  demographics: [
    { age_group: '18-24', percentage: 35 },
    { age_group: '25-34', percentage: 30 },
    { age_group: '35-44', percentage: 20 },
    { age_group: '45-54', percentage: 10 },
    { age_group: '55+', percentage: 5 },
  ],
};

const AdvancedAnalytics = () => {
  const [timeRange, setTimeRange] = useState('7d');

  const maxDailyStreams = Math.max(...mockData.daily.map((d) => d.streams));
  const maxCountryStreams = Math.max(...mockData.countries.map((c) => c.streams));
  const maxPlatformStreams = Math.max(...mockData.platforms.map((p) => p.streams));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h3 className="text-xl font-semibold">Расширенная аналитика</h3>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Последние 7 дней</SelectItem>
            <SelectItem value="30d">Последние 30 дней</SelectItem>
            <SelectItem value="90d">Последние 90 дней</SelectItem>
            <SelectItem value="1y">Последний год</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Icon name="TrendingUp" size={20} className="text-primary" />
            Динамика прослушиваний
          </h4>
          <div className="space-y-3">
            {mockData.daily.map((day) => (
              <div key={day.date} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {new Date(day.date).toLocaleDateString('ru-RU', { 
                      day: 'numeric', 
                      month: 'short' 
                    })}
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold">{day.streams.toLocaleString()}</span>
                    <span className="text-primary font-semibold">${day.revenue.toFixed(2)}</span>
                  </div>
                </div>
                <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                    style={{ width: `${(day.streams / maxDailyStreams) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Icon name="Globe" size={20} className="text-blue-500" />
            География слушателей
          </h4>
          <div className="space-y-4">
            {mockData.countries.map((country) => (
              <div key={country.country} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{country.country}</span>
                  <span className="text-muted-foreground">{country.streams.toLocaleString()}</span>
                </div>
                <Progress 
                  value={(country.streams / maxCountryStreams) * 100} 
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Icon name="Music" size={20} className="text-accent" />
            Платформы
          </h4>
          <div className="space-y-4">
            {mockData.platforms.map((platform) => (
              <div key={platform.platform} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{platform.platform}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground">{platform.streams.toLocaleString()}</span>
                    <span className="text-primary font-semibold">${platform.revenue.toFixed(2)}</span>
                  </div>
                </div>
                <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent transition-all duration-500"
                    style={{ width: `${(platform.streams / maxPlatformStreams) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Icon name="Users" size={20} className="text-yellow-500" />
            Демографические данные
          </h4>
          <div className="space-y-4">
            {mockData.demographics.map((demo) => (
              <div key={demo.age_group} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{demo.age_group} лет</span>
                  <span className="text-muted-foreground">{demo.percentage}%</span>
                </div>
                <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-500 transition-all duration-500"
                    style={{ width: `${demo.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-primary/10 to-background">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Eye" size={18} className="text-primary" />
            <p className="text-xs text-muted-foreground">Средний рост</p>
          </div>
          <p className="text-2xl font-bold">+12.5%</p>
          <p className="text-xs text-primary">↑ за неделю</p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-background">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Clock" size={18} className="text-blue-500" />
            <p className="text-xs text-muted-foreground">Время слушания</p>
          </div>
          <p className="text-2xl font-bold">3:42</p>
          <p className="text-xs text-blue-500">в среднем</p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-yellow-500/10 to-background">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Repeat" size={18} className="text-yellow-500" />
            <p className="text-xs text-muted-foreground">Повторы</p>
          </div>
          <p className="text-2xl font-bold">34%</p>
          <p className="text-xs text-yellow-500">слушают снова</p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-accent/10 to-background">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Share2" size={18} className="text-accent" />
            <p className="text-xs text-muted-foreground">Репосты</p>
          </div>
          <p className="text-2xl font-bold">1,234</p>
          <p className="text-xs text-accent">за неделю</p>
        </Card>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;
