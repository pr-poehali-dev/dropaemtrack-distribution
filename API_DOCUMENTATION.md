# dropaemtrack API Documentation

## Backend Functions Overview

Платформа использует 5 backend функций для полного функционала:

### 1. API Function (Tracks Management)
**URL:** `https://functions.poehali.dev/19bb1dc3-a5d6-42c9-abe8-9590401425c2`

**Возможности:**
- CRUD операции с треками
- Поиск и фильтрация треков
- Модерация треков
- Обновление статусов

**Методы:**
- `GET /` - Получить все треки или отфильтрованные
- `GET /?id=1` - Получить трек по ID
- `GET /?user_id=1` - Получить треки пользователя
- `GET /?status=pending` - Фильтр по статусу
- `GET /?genre=Electronic` - Фильтр по жанру
- `GET /?search=summer` - Поиск по названию/артисту
- `POST /` - Создать новый трек
- `PUT /` - Обновить трек
- `DELETE /?id=1` - Удалить трек (soft delete)

### 2. Analytics Function
**URL:** `https://functions.poehali.dev/4e2caace-d0d5-47ef-9373-0d3b40f194ed`

**Возможности:**
- Статистика прослушиваний
- География слушателей
- Аналитика по платформам
- Доходы

**Методы:**
- `GET /?track_id=1` - Аналитика конкретного трека
- `GET /?user_id=1` - Аналитика пользователя
- `GET /` - Общая аналитика платформы

**Ответ содержит:**
```json
{
  "daily": [...],
  "countries": [...],
  "platforms": [...],
  "totals": { "total_streams": 0, "total_revenue": 0 }
}
```

### 3. Social Function (Коммуникации)
**URL:** `https://functions.poehali.dev/0a8585e7-2bba-431d-9847-fd2b034fe7b8`

**Возможности:**
- Комментарии к трекам
- Система сообщений (чат)
- Плейлисты
- Уведомления

**Методы:**
- `GET /?resource=comments&track_id=1` - Комментарии трека
- `POST /?resource=comments` - Добавить комментарий
- `GET /?resource=messages&user_id=1` - Сообщения пользователя
- `POST /?resource=messages` - Отправить сообщение
- `GET /?resource=playlists&user_id=1` - Плейлисты пользователя
- `POST /?resource=playlists` - Создать плейлист
- `GET /?resource=notifications&user_id=1` - Уведомления
- `PUT /?resource=notifications` - Отметить как прочитанное

### 4. Labels Function (Лейблы и релизы)
**URL:** `https://functions.poehali.dev/cbcdce3c-5f50-4e28-bb2b-423a11a143ad`

**Возможности:**
- Управление музыкальными лейблами
- Календарь релизов
- Команды артистов

**Методы:**
- `GET /?resource=labels` - Все лейблы
- `GET /?resource=labels&label_id=1` - Конкретный лейбл с артистами
- `POST /?resource=labels` - Создать лейбл
- `GET /?resource=releases&user_id=1` - Релизы пользователя
- `POST /?resource=releases` - Запланировать релиз

### 5. Users Function (Пользователи)
**URL:** `https://functions.poehali.dev/5d6e629e-4376-4dea-903c-f70f3771afc3`

**Возможности:**
- Профили пользователей
- Настройки уведомлений
- Платежная информация

**Методы:**
- `GET /` - Все пользователи
- `GET /?id=1` - Пользователь по ID
- `GET /?username=djalex` - По username
- `GET /?role=artist` - По роли
- `POST /` - Создать пользователя
- `PUT /` - Обновить профиль

## Database Schema

### Основные таблицы:
- `users` - Пользователи
- `tracks` - Треки
- `playlists` - Плейлисты
- `playlist_tracks` - Треки в плейлистах
- `comments` - Комментарии
- `labels` - Лейблы
- `label_artists` - Артисты лейблов
- `analytics` - Аналитика
- `messages` - Сообщения
- `notifications` - Уведомления
- `releases` - Релизы

## Frontend Components

### Новые компоненты:
1. **AudioPlayer** - Встроенный аудиоплеер
2. **Waveform** - Визуализация звука
3. **AdvancedAnalytics** - Расширенная аналитика
4. **ChatSystem** - Система чатов
5. **PlaylistManager** - Управление плейлистами
6. **ReleaseCalendar** - Календарь релизов
7. **LabelManager** - Управление лейблами
8. **KnowledgeBase** - База знаний
9. **ThemeToggle** - Переключатель темы

### Custom Hooks:
- `useTracks(userId)` - Работа с треками
- `useAnalytics(trackId, userId)` - Аналитика
- `useComments(trackId)` - Комментарии
- `usePlaylists(userId)` - Плейлисты
- `useLabels(userId)` - Лейблы
- `useReleases(userId)` - Релизы
- `useUsers(role)` - Пользователи

## Возможности платформы

### ✅ Реализовано (все 16 функций):

1. **Аудио возможности:**
   - ✅ Встроенный аудиоплеер
   - ✅ Визуализация waveform

2. **Расширенная аналитика:**
   - ✅ Графики по дням/неделям
   - ✅ География слушателей
   - ✅ Аналитика по платформам
   - ✅ Демографические данные

3. **Социальные функции:**
   - ✅ Система чатов
   - ✅ Комментарии к трекам
   - ✅ Уведомления

4. **Плейлисты:**
   - ✅ Создание плейлистов
   - ✅ Публичные/приватные
   - ✅ Управление треками

5. **Интеграции:**
   - ✅ Telegram уведомления (настройки)

6. **Лейблы и команды:**
   - ✅ Создание лейблов
   - ✅ Управление артистами
   - ✅ Групповая аналитика

7. **Календарь релизов:**
   - ✅ Планирование релизов
   - ✅ Выбор платформ
   - ✅ Фильтрация по датам

8. **Продвинутый поиск:**
   - ✅ Поиск по BPM, жанру, настроению
   - ✅ Множественные фильтры
   - ✅ Сортировка

9. **База данных:**
   - ✅ PostgreSQL с 11 таблицами
   - ✅ Индексы для производительности
   - ✅ Реляционные связи

10. **Кастомизация:**
    - ✅ Темная/светлая/системная тема
    - ✅ Настройки профиля

11. **PWA:**
    - ✅ Manifest.json
    - ✅ Shortcuts
    - ✅ Иконки и screenshots

12. **База знаний:**
    - ✅ 10+ статей
    - ✅ Поиск по базе
    - ✅ Категории

13. **Экспорт данных:**
    - ✅ CSV экспорт
    - ✅ JSON экспорт

14. **Финансы:**
    - ✅ Статистика доходов
    - ✅ История выплат
    - ✅ Аналитика по платформам

15. **Модерация:**
    - ✅ Очередь модерации
    - ✅ Одобрение/отклонение
    - ✅ Комментарии модераторов

16. **Мобильная адаптация:**
    - ✅ Responsive дизайн
    - ✅ Touch-friendly интерфейс

## Используемые технологии

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS
- **UI Components:** shadcn/ui
- **Backend:** Python 3.11 (Cloud Functions)
- **Database:** PostgreSQL (Simple Query Protocol)
- **Icons:** lucide-react
- **State Management:** React Hooks

## Примеры использования

### Загрузка треков
```typescript
const { tracks, loading } = useTracks(userId);
```

### Получение аналитики
```typescript
const { analytics } = useAnalytics(trackId);
```

### Создание комментария
```typescript
const { addComment } = useComments(trackId);
await addComment("Отличный трек!", userId);
```

### Создание плейлиста
```typescript
const { createPlaylist } = usePlaylists(userId);
await createPlaylist("Мой плейлист", "Описание", true);
```
