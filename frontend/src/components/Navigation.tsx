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
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              스텝업클라우드
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">{user.email}</span>
            <button
              onClick={onLogout}
              className="bg-gray-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-600 transition-colors"
            >
              로그아웃
            </button>
          </div>
        </div>
      </div>

      <div className="md:hidden bg-gray-50 px-4 py-2">
        <div className="flex space-x-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex-1 flex items-center justify-center space-x-1 px-2 py-1 rounded text-xs font-medium ${
                location.pathname === item.path
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;