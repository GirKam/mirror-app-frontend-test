import { useEffect, useState } from 'react';
import 'normalize.css';
import './App.css';
import axios from 'axios';
import Posts from './components/Posts';
import SettingsPanel from './components/SettingsPanel';

import { Post } from '../../server/src/posts/interface';
import { User } from '../../server/src/users/interface';
import { Settings } from '../../server/src/settings/interface';

function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [users, setUsers] = useState<Record<string, User>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 1,
  });

  const calculateItemsPerPage = (settings: Settings) => {
    const { current, params } = settings.layout;
    return params[current].columns * params[current].rows;
  };

  const loadUsers = async () => {
    try {
      const response = await axios.get<User[]>('http://localhost:4000/users');
      const usersMap = response.data.reduce((acc, user) => {
        acc[user.id] = user;
        return acc;
      }, {} as Record<string, User>);
      setUsers(usersMap);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const fetchInitialData = async () => {
    try {
      setIsLoading(true);
      await loadUsers();

      const [settingsRes, totalCountRes] = await Promise.all([
        axios.get('http://localhost:4000/settings'),
        axios.get('http://localhost:4000/posts/count'),
      ]);

      setSettings(settingsRes.data);

      const itemsPerPage = calculateItemsPerPage(settingsRes.data);
      const postsRes = await axios.get<Post[]>(
        `http://localhost:4000/posts?_page=1&_limit=${itemsPerPage}`,
      );

      setPosts(postsRes.data);
      setPagination({
        currentPage: 1,
        totalPages: Math.ceil(totalCountRes.data / itemsPerPage),
        itemsPerPage,
      });
    } catch (error) {
      console.error('Error fetching initial data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMorePosts = async () => {
    if (!settings) return;

    try {
      const { currentPage, itemsPerPage } = pagination;
      const nextPage = currentPage + 1;

      const response = await axios.get<Post[]>(
        `http://localhost:4000/posts?_page=${nextPage}&_limit=${itemsPerPage}`,
      );

      setPosts((prev) => [...prev, ...response.data]);
      setPagination((prev) => ({
        ...prev,
        currentPage: nextPage,
      }));
    } catch (error) {
      console.error('Error loading more posts:', error);
    }
  };

  const handlePageChange = async (pageNumber: number) => {
    if (!settings || pageNumber === pagination.currentPage) return;

    try {
      const itemsPerPage = calculateItemsPerPage(settings);
      const response = await axios.get<Post[]>(
        `http://localhost:4000/posts?_page=${pageNumber}&_limit=${itemsPerPage}`,
      );

      setPosts(response.data);
      setPagination((prev) => ({
        ...prev,
        currentPage: pageNumber,
      }));
    } catch (error) {
      console.error('Error changing page:', error);
    }
  };

  const refreshSettings = async () => {
    try {
      setIsLoading(true);
      const [settingsRes, totalCountRes] = await Promise.all([
        axios.get('http://localhost:4000/settings'),
        axios.get('http://localhost:4000/posts/count'),
      ]);

      setSettings(settingsRes.data);

      const itemsPerPage = calculateItemsPerPage(settingsRes.data);
      const postsRes = await axios.get<Post[]>(
        `http://localhost:4000/posts?_page=1&_limit=${itemsPerPage}`,
      );

      setPosts(postsRes.data);
      setPagination({
        currentPage: 1,
        totalPages: Math.ceil(totalCountRes.data / itemsPerPage),
        itemsPerPage,
      });
    } catch (error) {
      console.error('Error refreshing settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  if (isLoading) return <div className="loading">Loading...</div>;
  if (!settings) return <div className="error">Failed to load settings</div>;

  return (
    <div className="app">
      <SettingsPanel settings={settings} onRefresh={refreshSettings} />
      <Posts
        posts={posts}
        settings={settings}
        onLoadMore={loadMorePosts}
        hasMore={pagination.currentPage < pagination.totalPages}
        pagination={pagination}
        onPageChange={handlePageChange}
        users={users}
      />
    </div>
  );
}

export default App;
