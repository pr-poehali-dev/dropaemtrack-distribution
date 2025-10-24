import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const ProfileSettings = () => {
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [notifications, setNotifications] = useState({
    email: true,
    trackApproved: true,
    trackRejected: true,
    newPayment: true,
    monthlyReport: false,
    promotions: false,
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-card border border-border">
          <TabsTrigger value="profile" className="gap-2">
            <Icon name="User" size={16} />
            Профиль
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Icon name="Bell" size={16} />
            Уведомления
          </TabsTrigger>
          <TabsTrigger value="payment" className="gap-2">
            <Icon name="CreditCard" size={16} />
            Оплата
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Icon name="Shield" size={16} />
            Безопасность
          </TabsTrigger>
          <TabsTrigger value="api" className="gap-2">
            <Icon name="Code" size={16} />
            API
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6">Основная информация</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-6">
                <div className="space-y-3">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary/40 rounded-full flex items-center justify-center overflow-hidden">
                    {avatarFile ? (
                      <img
                        src={URL.createObjectURL(avatarFile)}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Icon name="User" size={48} className="text-primary-foreground" />
                    )}
                  </div>
                  <input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('avatar')?.click()}
                    className="w-24 gap-1"
                  >
                    <Icon name="Upload" size={14} />
                    Изменить
                  </Button>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="artistName">Имя артиста *</Label>
                      <Input id="artistName" defaultValue="DJ Alex" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="realName">Настоящее имя</Label>
                      <Input id="realName" defaultValue="Александр Петров" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input id="email" type="email" defaultValue="alex@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Телефон</Label>
                      <Input id="phone" type="tel" defaultValue="+7 (999) 123-45-67" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Биография</Label>
                    <Textarea
                      id="bio"
                      rows={4}
                      defaultValue="Электронный музыкант из Москвы. Создаю музыку более 5 лет, специализируюсь на progressive house и melodic techno."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Веб-сайт</Label>
                    <Input id="website" type="url" placeholder="https://your-website.com" />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-border">
                <Button className="gap-2">
                  <Icon name="Save" size={16} />
                  Сохранить изменения
                </Button>
                <Button variant="outline">Отмена</Button>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Социальные сети</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="instagram" className="flex items-center gap-2">
                  <Icon name="Instagram" size={16} />
                  Instagram
                </Label>
                <Input id="instagram" placeholder="@username" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter" className="flex items-center gap-2">
                  <Icon name="Twitter" size={16} />
                  Twitter / X
                </Label>
                <Input id="twitter" placeholder="@username" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="youtube" className="flex items-center gap-2">
                  <Icon name="Youtube" size={16} />
                  YouTube
                </Label>
                <Input id="youtube" placeholder="Channel URL" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="soundcloud" className="flex items-center gap-2">
                  <Icon name="Music" size={16} />
                  SoundCloud
                </Label>
                <Input id="soundcloud" placeholder="Profile URL" />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6">Настройки уведомлений</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <Icon name="Mail" size={20} className="text-primary mt-1" />
                  <div>
                    <p className="font-semibold">Email уведомления</p>
                    <p className="text-sm text-muted-foreground">
                      Получать уведомления на почту
                    </p>
                  </div>
                </div>
                <Switch
                  checked={notifications.email}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, email: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <Icon name="CheckCircle" size={20} className="text-primary mt-1" />
                  <div>
                    <p className="font-semibold">Трек одобрен</p>
                    <p className="text-sm text-muted-foreground">
                      Уведомлять когда трек прошел модерацию
                    </p>
                  </div>
                </div>
                <Switch
                  checked={notifications.trackApproved}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, trackApproved: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <Icon name="XCircle" size={20} className="text-accent mt-1" />
                  <div>
                    <p className="font-semibold">Требуются правки</p>
                    <p className="text-sm text-muted-foreground">
                      Уведомлять о необходимости исправлений
                    </p>
                  </div>
                </div>
                <Switch
                  checked={notifications.trackRejected}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, trackRejected: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <Icon name="DollarSign" size={20} className="text-primary mt-1" />
                  <div>
                    <p className="font-semibold">Новая выплата</p>
                    <p className="text-sm text-muted-foreground">
                      Уведомлять о новых выплатах
                    </p>
                  </div>
                </div>
                <Switch
                  checked={notifications.newPayment}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, newPayment: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <Icon name="FileText" size={20} className="text-muted-foreground mt-1" />
                  <div>
                    <p className="font-semibold">Месячный отчет</p>
                    <p className="text-sm text-muted-foreground">
                      Получать ежемесячную статистику
                    </p>
                  </div>
                </div>
                <Switch
                  checked={notifications.monthlyReport}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, monthlyReport: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <Icon name="Gift" size={20} className="text-muted-foreground mt-1" />
                  <div>
                    <p className="font-semibold">Промо и предложения</p>
                    <p className="text-sm text-muted-foreground">
                      Получать информацию об акциях
                    </p>
                  </div>
                </div>
                <Switch
                  checked={notifications.promotions}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, promotions: checked })
                  }
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6">Методы оплаты</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Предпочитаемый метод</Label>
                <Select defaultValue="bank">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank">Банковский перевод</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="stripe">Stripe</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bankName">Название банка</Label>
                <Input id="bankName" placeholder="Сбербанк" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountNumber">Номер счета</Label>
                <Input id="accountNumber" placeholder="40817810..." />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bik">БИК</Label>
                  <Input id="bik" placeholder="044525225" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inn">ИНН</Label>
                  <Input id="inn" placeholder="1234567890" />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-border">
                <Button className="gap-2">
                  <Icon name="Save" size={16} />
                  Сохранить
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6">Безопасность</h3>
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Текущий пароль</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Новый пароль</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-border">
                <Button className="gap-2">
                  <Icon name="Lock" size={16} />
                  Изменить пароль
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Двухфакторная аутентификация</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Добавьте дополнительный уровень защиты вашего аккаунта
            </p>
            <Button variant="outline" className="gap-2">
              <Icon name="Shield" size={16} />
              Включить 2FA
            </Button>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">API ключи</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Используйте API для интеграции с вашими приложениями
            </p>

            <div className="space-y-4">
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold">Production Key</p>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Icon name="Copy" size={14} />
                    Копировать
                  </Button>
                </div>
                <code className="text-sm font-mono bg-background px-2 py-1 rounded">
                  sk_live_1234567890abcdef...
                </code>
              </div>

              <Button variant="outline" className="gap-2">
                <Icon name="Plus" size={16} />
                Создать новый ключ
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Документация API</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Полное руководство по использованию нашего API
            </p>
            <Button variant="outline" className="gap-2">
              <Icon name="ExternalLink" size={16} />
              Открыть документацию
            </Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileSettings;
