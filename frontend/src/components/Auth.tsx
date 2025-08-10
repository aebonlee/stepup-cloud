import React, { useState } from 'react';
import axios from 'axios';

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const response = await axios.post(`http://localhost:5000${endpoint}`, formData);
      
      localStorage.setItem('token', response.data.token);
      onLogin(response.data.token, response.data.user);
    } catch (error: any) {
      setError(error.response?.data?.error || '오류가 발생했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-mint-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">스텝업클라우드</h1>
          <p className="text-gray-600">학습 성장을 위한 협력형 학습관리 서비스</p>
        </div>

        <div className="mb-6 bg-gray-100 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-700 mb-2">왜 필요한가?</h3>
          <p className="text-sm text-gray-600 mb-3">
            학습 계획과 실천의 반복에서 오는 성장 데이터를 토대로, 학생은 자기주도 학습을 실현하고 
            학부모는 방향성을 함께 고민할 수 있습니다.
          </p>
          
          <h3 className="font-semibold text-gray-700 mb-2">대표적으로 무엇을 볼 수 있나?</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• 과목별 학습 시간 기록 및 시각화</li>
            <li>• 독서 및 활동 기록</li>
          </ul>
        </div>

        <div className="flex mb-6">
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 px-4 rounded-l-lg font-medium ${
              isLogin ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            로그인
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 px-4 rounded-r-lg font-medium ${
              !isLogin ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            회원가입
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              이메일
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="이메일을 입력하세요"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="비밀번호를 입력하세요"
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors font-medium"
          >
            {isLogin ? '로그인' : '회원가입'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          스텝업클라우드
        </div>
      </div>
    </div>
  );
};

export default Auth;