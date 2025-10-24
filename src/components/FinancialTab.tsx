import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const earnings = {
  current: 3245.67,
  pending: 892.34,
  total: 12567.89,
  thisMonth: 1234.56,
};

const paymentHistory = [
  { id: 1, date: '2024-09-30', amount: 2341.23, status: 'completed', method: 'Bank Transfer' },
  { id: 2, date: '2024-08-31', amount: 1987.45, status: 'completed', method: 'PayPal' },
  { id: 3, date: '2024-07-31', amount: 2156.78, status: 'completed', method: 'Bank Transfer' },
  { id: 4, date: '2024-06-30', amount: 1876.32, status: 'completed', method: 'Bank Transfer' },
  { id: 5, date: '2024-05-31', amount: 2234.11, status: 'completed', method: 'PayPal' },
];

const revenueByPlatform = [
  { platform: 'Spotify', revenue: 1245.67, percentage: 38, streams: 456789 },
  { platform: 'Apple Music', revenue: 987.34, percentage: 30, streams: 234567 },
  { platform: 'YouTube Music', revenue: 654.23, percentage: 20, streams: 567890 },
  { platform: 'Deezer', revenue: 234.56, percentage: 7, streams: 89012 },
  { platform: 'Tidal', revenue: 123.87, percentage: 5, streams: 34567 },
];

const topTracks = [
  { title: 'Summer Vibes', revenue: 567.89, streams: 125430 },
  { title: 'Midnight Dreams', revenue: 489.23, streams: 98765 },
  { title: 'Urban Flow', revenue: 423.45, streams: 87654 },
  { title: 'Ocean Waves', revenue: 345.67, streams: 76543 },
  { title: 'Night Drive', revenue: 298.12, streams: 65432 },
];

const FinancialTab = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30">
          <div className="flex items-center justify-between mb-2">
            <Icon name="DollarSign" size={24} className="text-primary" />
            <Icon name="TrendingUp" size={18} className="text-primary" />
          </div>
          <p className="text-3xl font-bold mb-1">${earnings.current.toFixed(2)}</p>
          <p className="text-sm text-muted-foreground">Доступно к выводу</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 border-yellow-500/30">
          <div className="flex items-center justify-between mb-2">
            <Icon name="Clock" size={24} className="text-yellow-500" />
            <Badge variant="outline" className="text-yellow-500 border-yellow-500/30">
              Ожидание
            </Badge>
          </div>
          <p className="text-3xl font-bold mb-1">${earnings.pending.toFixed(2)}</p>
          <p className="text-sm text-muted-foreground">В обработке</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-500/20 to-blue-500/5 border-blue-500/30">
          <div className="flex items-center justify-between mb-2">
            <Icon name="Calendar" size={24} className="text-blue-500" />
            <span className="text-xs text-muted-foreground">Октябрь</span>
          </div>
          <p className="text-3xl font-bold mb-1">${earnings.thisMonth.toFixed(2)}</p>
          <p className="text-sm text-muted-foreground">Доход за месяц</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-accent/20 to-accent/5 border-accent/30">
          <div className="flex items-center justify-between mb-2">
            <Icon name="TrendingUp" size={24} className="text-accent" />
            <Icon name="Award" size={18} className="text-accent" />
          </div>
          <p className="text-3xl font-bold mb-1">${earnings.total.toFixed(2)}</p>
          <p className="text-sm text-muted-foreground">Всего заработано</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Icon name="PieChart" size={20} className="text-primary" />
              Доход по платформам
            </h3>
            <Button variant="outline" size="sm" className="gap-1">
              <Icon name="Download" size={14} />
              Экспорт
            </Button>
          </div>
          <div className="space-y-4">
            {revenueByPlatform.map((item) => (
              <div key={item.platform} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Icon name="Music" size={16} className="text-muted-foreground" />
                    <span className="font-medium">{item.platform}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground">
                      {item.streams.toLocaleString()} стримов
                    </span>
                    <span className="font-bold text-primary min-w-[80px] text-right">
                      ${item.revenue.toFixed(2)}
                    </span>
                  </div>
                </div>
                <Progress value={item.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Icon name="Trophy" size={20} className="text-accent" />
              Топ треков по доходу
            </h3>
          </div>
          <div className="space-y-3">
            {topTracks.map((track, index) => (
              <div
                key={track.title}
                className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-bold flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{track.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {track.streams.toLocaleString()} прослушиваний
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-primary">${track.revenue.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Icon name="History" size={20} className="text-blue-500" />
            История выплат
          </h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1">
              <Icon name="Filter" size={14} />
              Фильтр
            </Button>
            <Button variant="outline" size="sm" className="gap-1">
              <Icon name="Download" size={14} />
              Экспорт
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Дата</TableHead>
              <TableHead>Сумма</TableHead>
              <TableHead>Метод</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paymentHistory.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-medium">{payment.date}</TableCell>
                <TableCell className="font-bold text-primary">
                  ${payment.amount.toFixed(2)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Icon name="CreditCard" size={16} className="text-muted-foreground" />
                    {payment.method}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className="bg-primary/20 text-primary border-primary/30"
                  >
                    {payment.status === 'completed' ? 'Завершено' : 'В обработке'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Icon name="Download" size={14} />
                    Чек
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
            <Icon name="Wallet" size={24} className="text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">Запросить выплату</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Вы можете вывести ${earnings.current.toFixed(2)}. Минимальная сумма для вывода: $50.00
            </p>
            <div className="flex gap-3">
              <Button className="gap-2">
                <Icon name="Send" size={16} />
                Запросить выплату
              </Button>
              <Button variant="outline" className="gap-2">
                <Icon name="Settings" size={16} />
                Настроить метод оплаты
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FinancialTab;
