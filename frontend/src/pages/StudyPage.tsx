import React, { useState, useEffect } from 'react';
import api from '../config/api';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface StudyRecord {
  id: number;
  date: string;
  subject: string;
  book: string;
  minutes: number;
}

const StudyPage: React.FC = () => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    subject: '',
    book: '',
    minutes: ''
  });
  const [records, setRecords] = useState<StudyRecord[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [message, setMessage] = useState('');

  const subjects = [
    '국어', '영어', '수학', '과학', '사회', '역사', '지리', '음악', '미술', '체육', '기타'
  ];

  useEffect(() => {
    fetchRecords();
    fetchStats();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await api.get('/api/study-records');
      setRecords(response.data);
    } catch (error) {
      console.error('학습 기록을 불러오는데 실패했습니다:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/api/stats/study');
      setStats(response.data);
    } catch (error) {
      console.error('통계를 불러오는데 실패했습니다:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      await api.post('/api/study-records', {
        ...formData,
        minutes: parseInt(formData.minutes)
      });
      
      setMessage('학습 기록이 저장되었습니다.');
      setFormData({
        date: new Date().toISOString().split('T')[0],
        subject: '',
        book: '',
        minutes: ''
      });
      fetchRecords();
      fetchStats();
    } catch (error) {
      setMessage('학습 기록 저장에 실패했습니다.');
    }
  };

  const subjectChartData = stats?.subjects ? {
    labels: stats.subjects.map((item: any) => item.subject),
    datasets: [
      {
        data: stats.subjects.map((item: any) => item.total_minutes),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
          '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384'
        ],
        borderWidth: 2,
        borderColor: '#fff'
      }
    ]
  } : null;

  const dailyChartData = stats?.daily ? {
    labels: stats.daily.slice(0, 7).map((item: any) => item.date),
    datasets: [
      {
        label: '학습시간 (분)',
        data: stats.daily.slice(0, 7).map((item: any) => item.total_minutes),
        backgroundColor: '#36A2EB',
        borderColor: '#36A2EB',
        borderWidth: 1
      }
    ]
  } : null;

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">학습시간 기록</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">학습 기록 입력</h2>
            
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
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  과목
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">과목을 선택하세요</option>
                  {subjects.map((subject) => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="book" className="block text-sm font-medium text-gray-700 mb-1">
                  문제집/교재
                </label>
                <input
                  type="text"
                  id="book"
                  name="book"
                  value={formData.book}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="문제집이나 교재명을 입력하세요"
                />
              </div>

              <div>
                <label htmlFor="minutes" className="block text-sm font-medium text-gray-700 mb-1">
                  학습시간 (분)
                </label>
                <input
                  type="number"
                  id="minutes"
                  name="minutes"
                  value={formData.minutes}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="분 단위로 입력하세요"
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
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors font-medium"
              >
                기록 저장
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {subjectChartData && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">과목별 학습량</h3>
                <div className="h-64">
                  <Doughnut 
                    data={subjectChartData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom' as const,
                        },
                      },
                    }}
                  />
                </div>
              </div>
            )}

            {dailyChartData && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">일일 학습량 (최근 7일)</h3>
                <div className="h-64">
                  <Bar 
                    data={dailyChartData} 
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
                        },
                      },
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">최근 학습 기록</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-3">날짜</th>
                    <th className="text-left p-3">과목</th>
                    <th className="text-left p-3">교재</th>
                    <th className="text-left p-3">시간(분)</th>
                  </tr>
                </thead>
                <tbody>
                  {records.slice(0, 10).map((record) => (
                    <tr key={record.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{record.date}</td>
                      <td className="p-3">{record.subject}</td>
                      <td className="p-3">{record.book || '-'}</td>
                      <td className="p-3 font-semibold">{record.minutes}분</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyPage;