import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './components/Auth';
import Navigation from './components/Navigation';
import StudyPage from './pages/StudyPage';
import ReadingPage from './pages/ReadingPage';
import ActivitiesPage from './pages/ActivitiesPage';
import DashboardPage from './pages/DashboardPage';
import './App.css';

function App() {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (newToken: string, newUser: any) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  if (!token || !user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation user={user} onLogout={handleLogout} />
        
        <main className="min-h-screen">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/study" element={<StudyPage />} />
            <Route path="/reading" element={<ReadingPage />} />
            <Route path="/activities" element={<ActivitiesPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Routes>
        </main>

        <footer className="bg-white border-t mt-16">
          <div className="max-w-7xl mx-auto py-6 px-4">
            <div className="text-center text-gray-600">
              <p className="text-sm">© 2024 스텝업클라우드. 모든 권리 보유.</p>
              <p className="text-xs mt-2">학습 성장을 위한 협력형 학습관리 서비스</p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;