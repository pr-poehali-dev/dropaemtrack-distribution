import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Message {
  id: number;
  sender_id: number;
  sender_name: string;
  content: string;
  created_at: string;
  is_read: boolean;
}

interface Chat {
  user_id: number;
  username: string;
  full_name: string;
  last_message: string;
  unread_count: number;
  avatar?: string;
}

const mockChats: Chat[] = [
  {
    user_id: 1,
    username: 'moderator1',
    full_name: 'John Moderator',
    last_message: 'Трек одобрен, но нужно поправить обложку',
    unread_count: 2,
  },
  {
    user_id: 2,
    username: 'admin',
    full_name: 'Admin User',
    last_message: 'Поздравляю с первыми 100к прослушиваний!',
    unread_count: 0,
  },
  {
    user_id: 3,
    username: 'sarahconnor',
    full_name: 'Sarah Connor',
    last_message: 'Хочешь сделать коллаборацию?',
    unread_count: 1,
  },
];

const mockMessages: Message[] = [
  {
    id: 1,
    sender_id: 1,
    sender_name: 'John Moderator',
    content: 'Привет! Проверил твой трек "Summer Vibes"',
    created_at: '2025-10-24T10:30:00',
    is_read: true,
  },
  {
    id: 2,
    sender_id: 2,
    sender_name: 'Ты',
    content: 'Здравствуйте! Что скажете?',
    created_at: '2025-10-24T10:32:00',
    is_read: true,
  },
  {
    id: 3,
    sender_id: 1,
    sender_name: 'John Moderator',
    content: 'Трек одобрен, но нужно поправить обложку. Разрешение должно быть минимум 3000x3000',
    created_at: '2025-10-24T10:35:00',
    is_read: false,
  },
  {
    id: 4,
    sender_id: 1,
    sender_name: 'John Moderator',
    content: 'И еще добавь копирайт в метаданные',
    created_at: '2025-10-24T10:36:00',
    is_read: false,
  },
];

const ChatSystem = () => {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(mockChats[0]);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;

    const message: Message = {
      id: messages.length + 1,
      sender_id: 2,
      sender_name: 'Ты',
      content: newMessage,
      created_at: new Date().toISOString(),
      is_read: true,
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
      <Card className="p-4 lg:col-span-1">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Icon name="MessageSquare" size={20} />
          Чаты
        </h3>
        <ScrollArea className="h-[520px]">
          <div className="space-y-2">
            {mockChats.map((chat) => (
              <div
                key={chat.user_id}
                onClick={() => setSelectedChat(chat)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedChat?.user_id === chat.user_id
                    ? 'bg-primary/10 border-2 border-primary'
                    : 'hover:bg-muted border-2 border-transparent'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                    <Icon name="User" size={20} className="text-primary-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold truncate">{chat.full_name}</p>
                      {chat.unread_count > 0 && (
                        <Badge variant="default" className="ml-2">
                          {chat.unread_count}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{chat.last_message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>

      <Card className="p-4 lg:col-span-2 flex flex-col">
        {selectedChat ? (
          <>
            <div className="pb-4 border-b border-border mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Icon name="User" size={20} className="text-primary-foreground" />
                </div>
                <div>
                  <p className="font-semibold">{selectedChat.full_name}</p>
                  <p className="text-xs text-muted-foreground">@{selectedChat.username}</p>
                </div>
              </div>
            </div>

            <ScrollArea className="flex-1 mb-4 h-[400px]">
              <div className="space-y-4 pr-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender_id === 2 ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.sender_id === 2
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      {message.sender_id !== 2 && (
                        <p className="text-xs font-semibold mb-1">{message.sender_name}</p>
                      )}
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.sender_id === 2
                            ? 'text-primary-foreground/70'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {formatTime(message.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="flex gap-2">
              <Input
                placeholder="Напишите сообщение..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1"
              />
              <Button onClick={sendMessage} size="icon">
                <Icon name="Send" size={20} />
              </Button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <Icon name="MessageSquare" size={48} className="mx-auto mb-4 opacity-50" />
              <p>Выберите чат</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ChatSystem;
