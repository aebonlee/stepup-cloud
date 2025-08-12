import React, { useState } from 'react';
import api from '../config/api';

interface AuthProps {
  onLogin: (token: string, user: any) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  // 타임스탬프 강제 업데이트 - 2025.01.12 16:30

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 임시 테스트 계정 처리
    if (formData.email === 'test@sample.com' && formData.password === '1234') {
      const mockToken = 'test-token-123456789';
      const mockUser = { id: 1, email: 'test@sample.com' };
      
      localStorage.setItem('token', mockToken);
      onLogin(mockToken, mockUser);
      return;
    }

    // 입력 검증
    if (!formData.email || !formData.password) {
      setError('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    if (!isValidEmail(formData.email)) {
      setError('올바른 이메일 형식을 입력해주세요.');
      return;
    }

    if (formData.password.length < 4) {
      setError('비밀번호는 최소 4자 이상이어야 합니다.');
      return;
    }

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const response = await api.post(endpoint, formData);
      
      localStorage.setItem('token', response.data.token);
      onLogin(response.data.token, response.data.user);
    } catch (error: any) {
      console.error('Auth error:', error);
      if (error.code === 'ECONNREFUSED') {
        setError('서버에 연결할 수 없습니다. 임시 테스트는 test@sample.com / 1234 로 로그인해보세요.');
      } else {
        setError(error.response?.data?.error || '오류가 발생했습니다. 임시 테스트는 test@sample.com / 1234 로 로그인해보세요.');
      }
    }
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-pastel-50 via-cream-50 to-mint-pastel-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-white/50 p-8 w-full max-w-md hover:shadow-hover transition-all duration-300">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-sky-pastel-400 to-mint-pastel-400 rounded-2xl mb-4 shadow-card animate-bounce-gentle">
            <span className="text-2xl">📚</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-pastel-600 to-mint-pastel-600 bg-clip-text text-transparent mb-2">
            스텝업클라우드
          </h1>
          <p className="text-gray-600">학습 성장을 위한 협력형 학습관리 서비스</p>
        </div>

        <div className="mb-6 bg-gradient-to-r from-cream-50 to-sky-pastel-50 p-4 rounded-xl border border-cream-200/50">
          <h3 className="font-semibold text-sky-pastel-700 mb-2 flex items-center">
            <span className="mr-2">🎯</span>왜 필요한가?
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            학습 계획과 실천의 반복에서 오는 성장 데이터를 토대로, 학생은 자기주도 학습을 실현하고 
            학부모는 방향성을 함께 고민할 수 있습니다.
          </p>
          
          <h3 className="font-semibold text-mint-pastel-700 mb-2 flex items-center">
            <span className="mr-2">📊</span>대표적으로 무엇을 볼 수 있나?
          </h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li className="flex items-center"><span className="text-sky-pastel-500 mr-2">✓</span>과목별 학습 시간 기록 및 시각화</li>
            <li className="flex items-center"><span className="text-mint-pastel-500 mr-2">✓</span>독서 및 활동 기록</li>
          </ul>
          
          <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-sm text-amber-700 font-medium flex items-center">
              <span className="mr-2">🔐</span>임시 테스트 계정
            </p>
            <p className="text-sm text-amber-600 mt-1">
              이메일: <code className="bg-amber-100 px-1 rounded">test@sample.com</code><br />
              비밀번호: <code className="bg-amber-100 px-1 rounded">1234</code>
            </p>
          </div>
        </div>

        <div className="flex mb-6 bg-gray-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
              isLogin 
                ? 'bg-white text-sky-pastel-600 shadow-soft transform scale-[0.98]' 
                : 'text-gray-600 hover:text-sky-pastel-600'
            }`}
          >
            <span className="flex items-center justify-center">
              <span className="mr-2">🔐</span>로그인
            </span>
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
              !isLogin 
                ? 'bg-white text-mint-pastel-600 shadow-soft transform scale-[0.98]' 
                : 'text-gray-600 hover:text-mint-pastel-600'
            }`}
          >
            <span className="flex items-center justify-center">
              <span className="mr-2">✨</span>회원가입
            </span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <span className="mr-2">📧</span>이메일
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-pastel-400 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white"
              placeholder="이메일을 입력하세요"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <span className="mr-2">🔑</span>비밀번호
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete={isLogin ? "current-password" : "new-password"}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-pastel-400 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white"
              placeholder="비밀번호를 입력하세요"
            />
          </div>

          {error && (
            <div className="text-rose-pastel-600 text-sm bg-rose-pastel-50 p-3 rounded-xl border border-rose-pastel-200 animate-slide-in">
              <span className="flex items-center">
                <span className="mr-2">⚠️</span>{error}
              </span>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-sky-pastel-500 to-mint-pastel-500 text-white py-3 px-4 rounded-xl hover:from-sky-pastel-600 hover:to-mint-pastel-600 transition-all duration-300 font-medium shadow-card hover:shadow-hover transform hover:scale-[1.02]"
          >
            <span className="flex items-center justify-center">
              {isLogin ? (
                <><span className="mr-2">🚀</span>로그인</>
              ) : (
                <><span className="mr-2">🌟</span>회원가입</>
              )}
            </span>
          </button>
        </form>

        <div className="mt-6 text-center">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <span>✨</span>
            <span className="bg-gradient-to-r from-sky-pastel-500 to-mint-pastel-500 bg-clip-text text-transparent font-medium">
              스텝업클라우드
            </span>
            <span>✨</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;