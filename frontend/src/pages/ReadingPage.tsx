import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ReadingRecord {
  id: number;
  date: string;
  book_title: string;
  review: string;
  category: string;
}

const ReadingPage: React.FC = () => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    book_title: '',
    category: '',
    review: ''
  });
  const [records, setRecords] = useState<ReadingRecord[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<ReadingRecord | null>(null);

  const categories = [
    '소설', '에세이', '자기계발', '과학', '역사', '철학', '예술', '경제/경영', '사회과학', '기타'
  ];

  useEffect(() => {
    fetchRecords();
    fetchStats();
  }, []);

  const fetchRecords = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/reading-records', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecords(response.data);
    } catch (error) {
      console.error('독서 기록을 불러오는데 실패했습니다:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/stats/reading', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error('독서 통계를 불러오는데 실패했습니다:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/reading-records', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setMessage('독서 기록이 저장되었습니다.');
      setFormData({
        date: new Date().toISOString().split('T')[0],
        book_title: '',
        category: '',
        review: ''
      });
      fetchRecords();
      fetchStats();
    } catch (error) {
      setMessage('독서 기록 저장에 실패했습니다.');
    }
  };

  const categoryChartData = stats?.categories ? {
    labels: stats.categories.map((item: any) => item.category || '미분류'),
    datasets: [
      {
        data: stats.categories.map((item: any) => item.book_count),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
          '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384'
        ],
        borderWidth: 2,
        borderColor: '#fff'
      }
    ]
  } : null;

  const monthlyChartData = stats?.monthly ? {
    labels: stats.monthly.slice(0, 6).reverse().map((item: any) => item.month),
    datasets: [
      {
        label: '읽은 책 수',
        data: stats.monthly.slice(0, 6).reverse().map((item: any) => item.book_count),
        borderColor: '#36A2EB',
        backgroundColor: '#36A2EB20',
        borderWidth: 2,
        fill: true,
        tension: 0.3
      }
    ]
  } : null;

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">독서 기록</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">독서 기록 입력</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  날짜
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="book_title" className="block text-sm font-medium text-gray-700 mb-1">
                  책 제목
                </label>
                <input
                  type="text"
                  id="book_title"
                  name="book_title"
                  value={formData.book_title}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="읽은 책의 제목을 입력하세요"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  분류
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">분류를 선택하세요</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-1">
                  독서감상문
                </label>
                <textarea
                  id="review"
                  name="review"
                  value={formData.review}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="책을 읽고 느낀 점을 자유롭게 작성해보세요..."
                />
              </div>

              {message && (
                <div className={`text-sm p-2 rounded ${
                  message.includes('실패') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                }`}>
                  {message}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors font-medium"
              >
                기록 저장
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {stats && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">독서 현황</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">총 읽은 책</span>
                    <span className="font-semibold text-blue-600">{records.length}권</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">작성된 감상문</span>
                    <span className="font-semibold text-green-600">{stats.totalReviews || 0}개</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">이번 달 독서량</span>
                    <span className="font-semibold text-purple-600">
                      {stats.monthly?.[0]?.book_count || 0}권
                    </span>
                  </div>
                </div>
              </div>
            )}

            {categoryChartData && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">카테고리별 독서량</h3>
                <div className="h-48">
                  <Doughnut 
                    data={categoryChartData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom' as const,
                          labels: {
                            boxWidth: 12,
                            padding: 8
                          }
                        },
                      },
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {monthlyChartData && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">월별 독서량 (최근 6개월)</h3>
              <div className="h-64">
                <Line 
                  data={monthlyChartData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          stepSize: 1
                        }
                      },
                    },
                  }}
                />
              </div>
            </div>
          )}

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">독서 기록</h3>
            <div className="grid gap-4">
              {records.slice(0, 6).map((record) => (
                <div 
                  key={record.id} 
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedRecord(record)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-800">{record.book_title}</h4>
                    <span className="text-xs text-gray-500">{record.date}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      {record.category}
                    </span>
                    {record.review && (
                      <span className="text-xs text-green-600">감상문 작성됨</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-800">{selectedRecord.book_title}</h3>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <div className="mb-4">
                <span className="text-sm text-gray-600">날짜: {selectedRecord.date}</span>
                <span className="ml-4 text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  {selectedRecord.category}
                </span>
              </div>
              {selectedRecord.review ? (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">독서감상문</h4>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {selectedRecord.review}
                  </p>
                </div>
              ) : (
                <p className="text-gray-500 italic">감상문이 작성되지 않았습니다.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReadingPage;