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
      <div className="min-h-screen bg-gradient-to-br from-sky-pastel-50 via-cream-50 to-mint-pastel-50">
        <Navigation user={user} onLogout={handleLogout} />
        
        <main className="min-h-screen pb-20">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/study" element={<StudyPage />} />
            <Route path="/reading" element={<ReadingPage />} />
            <Route path="/activities" element={<ActivitiesPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Routes>
        </main>

        <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-100 mt-16">
          <div className="max-w-7xl mx-auto py-8 px-4">
            <div className="text-center text-gray-600">
              <div className="flex items-center justify-center space-x-2 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-sky-pastel-400 to-mint-pastel-400 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">📚</span>
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-sky-pastel-600 to-mint-pastel-600 bg-clip-text text-transparent">
                  스텝업클라우드
                </span>
              </div>
              <p className="text-sm">© 2024 스텝업클라우드. 모든 권리 보유.</p>
              <p className="text-xs mt-2 text-gray-500">학습 성장을 위한 협력형 학습관리 서비스</p>
              <div className="flex items-center justify-center space-x-4 mt-4 text-xs text-gray-400">
                <span>✨ Made with React & Tailwind</span>
                <span>•</span>
                <span>🚀 Powered by AI</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;