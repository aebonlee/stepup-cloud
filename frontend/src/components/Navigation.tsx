import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavigationProps {
  user: any;
  onLogout: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ user, onLogout }) => {
  const location = useLocation();

  const navItems = [
    { path: '/study', label: '학습', icon: '📚' },
    { path: '/reading', label: '독서', icon: '📖' },
    { path: '/activities', label: '활동', icon: '🏆' },
    { path: '/dashboard', label: '통계', icon: '📊' }
  ];

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-soft border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-sky-pastel-400 to-mint-pastel-400 rounded-lg flex items-center justify-center shadow-card group-hover:shadow-hover transition-all duration-300 group-hover:scale-105">
                <span className="text-white text-sm">📚</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-sky-pastel-600 to-mint-pastel-600 bg-clip-text text-transparent">
                스텝업클라우드
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  location.pathname === item.path
                    ? 'bg-gradient-to-r from-sky-pastel-100 to-mint-pastel-100 text-sky-pastel-700 shadow-card transform scale-[0.98]'
                    : 'text-gray-600 hover:text-sky-pastel-600 hover:bg-gray-50/80'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-xl">
              <div className="w-6 h-6 bg-gradient-to-br from-lavender-pastel-400 to-rose-pastel-400 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">👤</span>
              </div>
              <span className="text-sm text-gray-600 max-w-24 truncate">{user.email}</span>
            </div>
            <button
              onClick={onLogout}
              className="bg-gradient-to-r from-gray-400 to-gray-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:from-gray-500 hover:to-gray-600 transition-all duration-300 shadow-card hover:shadow-hover"
            >
              <span className="hidden sm:inline">로그아웃</span>
              <span className="sm:hidden">🚪</span>
            </button>
          </div>
        </div>
      </div>

      <div className="md:hidden bg-gradient-to-r from-sky-pastel-50 to-mint-pastel-50 px-4 py-3">
        <div className="flex space-x-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex-1 flex items-center justify-center space-x-1 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 ${
                location.pathname === item.path
                  ? 'bg-white text-sky-pastel-700 shadow-card'
                  : 'text-gray-600 hover:text-sky-pastel-600 hover:bg-white/50'
              }`}
            >
              <span className="text-sm">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;