import { useState, useEffect } from 'react';

const API_URLS = {
  api: 'https://functions.poehali.dev/19bb1dc3-a5d6-42c9-abe8-9590401425c2',
  analytics: 'https://functions.poehali.dev/4e2caace-d0d5-47ef-9373-0d3b40f194ed',
  social: 'https://functions.poehali.dev/0a8585e7-2bba-431d-9847-fd2b034fe7b8',
  labels: 'https://functions.poehali.dev/cbcdce3c-5f50-4e28-bb2b-423a11a143ad',
  users: 'https://functions.poehali.dev/5d6e629e-4376-4dea-903c-f70f3771afc3',
};

export const useTracks = (userId?: number) => {
  const [tracks, setTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const url = userId 
          ? `${API_URLS.api}?user_id=${userId}`
          : API_URLS.api;
        
        const response = await fetch(url);
        const data = await response.json();
        setTracks(Array.isArray(data) ? data : []);
      } catch (err) {
        setError('Failed to fetch tracks');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, [userId]);

  return { tracks, loading, error };
};

export const useAnalytics = (trackId?: number, userId?: number) => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        let url = API_URLS.analytics;
        const params = new URLSearchParams();
        
        if (trackId) params.append('track_id', trackId.toString());
        if (userId) params.append('user_id', userId.toString());
        
        if (params.toString()) url += `?${params.toString()}`;
        
        const response = await fetch(url);
        const data = await response.json();
        setAnalytics(data);
      } catch (err) {
        setError('Failed to fetch analytics');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [trackId, userId]);

  return { analytics, loading, error };
};

export const useComments = (trackId: number) => {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(
          `${API_URLS.social}?resource=comments&track_id=${trackId}`
        );
        const data = await response.json();
        setComments(Array.isArray(data) ? data : []);
      } catch (err) {
        setError('Failed to fetch comments');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (trackId) fetchComments();
  }, [trackId]);

  const addComment = async (content: string, userId: number) => {
    try {
      const response = await fetch(`${API_URLS.social}?resource=comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ track_id: trackId, user_id: userId, content }),
      });
      const newComment = await response.json();
      setComments([...comments, newComment]);
      return newComment;
    } catch (err) {
      console.error('Failed to add comment:', err);
      throw err;
    }
  };

  return { comments, loading, error, addComment };
};

export const usePlaylists = (userId: number) => {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await fetch(
          `${API_URLS.social}?resource=playlists&user_id=${userId}`
        );
        const data = await response.json();
        setPlaylists(Array.isArray(data) ? data : []);
      } catch (err) {
        setError('Failed to fetch playlists');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchPlaylists();
  }, [userId]);

  const createPlaylist = async (title: string, description: string, isPublic: boolean) => {
    try {
      const response = await fetch(`${API_URLS.social}?resource=playlists`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, title, description, is_public: isPublic }),
      });
      const newPlaylist = await response.json();
      setPlaylists([...playlists, newPlaylist]);
      return newPlaylist;
    } catch (err) {
      console.error('Failed to create playlist:', err);
      throw err;
    }
  };

  return { playlists, loading, error, createPlaylist };
};

export const useLabels = (userId?: number) => {
  const [labels, setLabels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLabels = async () => {
      try {
        const url = userId 
          ? `${API_URLS.labels}?resource=labels&user_id=${userId}`
          : `${API_URLS.labels}?resource=labels`;
        
        const response = await fetch(url);
        const data = await response.json();
        setLabels(Array.isArray(data) ? data : []);
      } catch (err) {
        setError('Failed to fetch labels');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLabels();
  }, [userId]);

  return { labels, loading, error };
};

export const useReleases = (userId?: number) => {
  const [releases, setReleases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReleases = async () => {
      try {
        const url = userId 
          ? `${API_URLS.labels}?resource=releases&user_id=${userId}`
          : `${API_URLS.labels}?resource=releases`;
        
        const response = await fetch(url);
        const data = await response.json();
        setReleases(Array.isArray(data) ? data : []);
      } catch (err) {
        setError('Failed to fetch releases');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReleases();
  }, [userId]);

  return { releases, loading, error };
};

export const useUsers = (role?: string) => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const url = role 
          ? `${API_URLS.users}?role=${role}`
          : API_URLS.users;
        
        const response = await fetch(url);
        const data = await response.json();
        setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        setError('Failed to fetch users');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [role]);

  return { users, loading, error };
};
