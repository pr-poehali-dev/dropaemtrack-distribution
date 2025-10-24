-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'artist' CHECK (role IN ('artist', 'moderator', 'manager', 'admin')),
    avatar_url TEXT,
    bio TEXT,
    paypal_email VARCHAR(255),
    bank_account VARCHAR(100),
    telegram_id VARCHAR(100),
    telegram_notifications BOOLEAN DEFAULT true,
    email_notifications BOOLEAN DEFAULT true,
    push_notifications BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create tracks table
CREATE TABLE IF NOT EXISTS tracks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    artist VARCHAR(255) NOT NULL,
    genre VARCHAR(100),
    bpm INTEGER,
    key VARCHAR(10),
    mood VARCHAR(50),
    audio_url TEXT,
    cover_url TEXT,
    duration INTEGER,
    file_size BIGINT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'published', 'needs_revision', 'rejected')),
    rejection_reason TEXT,
    streams INTEGER DEFAULT 0,
    revenue DECIMAL(10, 2) DEFAULT 0.00,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    publish_date TIMESTAMP,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create playlists table
CREATE TABLE IF NOT EXISTS playlists (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    cover_url TEXT,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create playlist_tracks junction table
CREATE TABLE IF NOT EXISTS playlist_tracks (
    id SERIAL PRIMARY KEY,
    playlist_id INTEGER REFERENCES playlists(id),
    track_id INTEGER REFERENCES tracks(id),
    position INTEGER NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(playlist_id, track_id)
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    track_id INTEGER REFERENCES tracks(id),
    user_id INTEGER REFERENCES users(id),
    content TEXT NOT NULL,
    parent_id INTEGER REFERENCES comments(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create labels table
CREATE TABLE IF NOT EXISTS labels (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    logo_url TEXT,
    website VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create label_artists junction table
CREATE TABLE IF NOT EXISTS label_artists (
    id SERIAL PRIMARY KEY,
    label_id INTEGER REFERENCES labels(id),
    user_id INTEGER REFERENCES users(id),
    role VARCHAR(50) DEFAULT 'artist',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(label_id, user_id)
);

-- Create analytics table
CREATE TABLE IF NOT EXISTS analytics (
    id SERIAL PRIMARY KEY,
    track_id INTEGER REFERENCES tracks(id),
    date DATE NOT NULL,
    streams INTEGER DEFAULT 0,
    revenue DECIMAL(10, 2) DEFAULT 0.00,
    country VARCHAR(3),
    platform VARCHAR(50),
    age_group VARCHAR(20),
    gender VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(track_id, date, country, platform)
);

-- Create messages table for chat
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER REFERENCES users(id),
    receiver_id INTEGER REFERENCES users(id),
    track_id INTEGER REFERENCES tracks(id),
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    link TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create releases calendar table
CREATE TABLE IF NOT EXISTS releases (
    id SERIAL PRIMARY KEY,
    track_id INTEGER REFERENCES tracks(id),
    user_id INTEGER REFERENCES users(id),
    release_date DATE NOT NULL,
    platforms JSONB,
    promotional_plan TEXT,
    status VARCHAR(50) DEFAULT 'scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_tracks_user_id ON tracks(user_id);
CREATE INDEX IF NOT EXISTS idx_tracks_status ON tracks(status);
CREATE INDEX IF NOT EXISTS idx_tracks_genre ON tracks(genre);
CREATE INDEX IF NOT EXISTS idx_comments_track_id ON comments(track_id);
CREATE INDEX IF NOT EXISTS idx_analytics_track_id ON analytics(track_id);
CREATE INDEX IF NOT EXISTS idx_analytics_date ON analytics(date);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_releases_date ON releases(release_date);

-- Insert sample data
INSERT INTO users (email, username, full_name, role) VALUES
('alex@example.com', 'djalex', 'DJ Alex', 'artist'),
('sarah@example.com', 'sarahconnor', 'Sarah Connor', 'artist'),
('mod@example.com', 'moderator1', 'John Moderator', 'moderator'),
('admin@example.com', 'admin', 'Admin User', 'admin')
ON CONFLICT (email) DO NOTHING;

INSERT INTO tracks (user_id, title, artist, genre, status, streams, revenue, bpm, key, mood) VALUES
(1, 'Summer Vibes', 'DJ Alex', 'Electronic', 'pending', 125430, 1254.30, 128, 'Am', 'energetic'),
(2, 'Midnight Dreams', 'Sarah Connor', 'Pop', 'approved', 342890, 3428.90, 120, 'C', 'melancholic'),
(1, 'Urban Flow', 'DJ Alex', 'Hip-Hop', 'published', 567123, 5671.23, 95, 'Gm', 'chill'),
(2, 'Ocean Waves', 'Sarah Connor', 'Ambient', 'needs_revision', 89234, 892.34, 80, 'D', 'relaxing')
ON CONFLICT DO NOTHING;