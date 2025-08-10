import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Doughnut } from 'react-chartjs-2';
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

interface Activity {
  id: number;
  date: string;
  title: string;
  type: string;
  subject: string;
  hours: number;
}

const ActivitiesPage: React.FC = () => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    title: '',
    type: '',
    subject: '',
    hours: ''
  });
  const [activities, setActivities] = useState<Activity[]>([]);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'activity' | 'award'>('activity');

  const subjects = [
    '국어', '영어', '수학', '과학', '사회', '역사', '지리', '음악', '미술', '체육', '종합', '기타'
  ];

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/awards-activities', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setActivities(response.data);
    } catch (error) {
      console.error('활동/입상 기록을 불러오는데 실패했습니다:', error);
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
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/awards-activities', 
        {
          ...formData,
          hours: formData.hours ? parseInt(formData.hours) : null
        }, 
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setMessage('기록이 저장되었습니다.');
      setFormData({
        date: new Date().toISOString().split('T')[0],
        title: '',
        type: '',
        subject: '',
        hours: ''
      });
      fetchActivities();
    } catch (error) {
      setMessage('기록 저장에 실패했습니다.');
    }
  };

  const awards = activities.filter(item => item.type === '입상');
  const activityRecords = activities.filter(item => item.type === '활동');

  const subjectStats = activities.reduce((acc, item) => {
    const subject = item.subject || '기타';
    acc[subject] = (acc[subject] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const subjectChartData = Object.keys(subjectStats).length > 0 ? {
    labels: Object.keys(subjectStats),
    datasets: [
      {
        data: Object.values(subjectStats),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
          '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384'
        ],
        borderWidth: 2,
        borderColor: '#fff'
      }
    ]
  } : null;

  const monthlyData = activities.reduce((acc, item) => {
    const month = item.date.substring(0, 7);
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const monthlyChartData = Object.keys(monthlyData).length > 0 ? {
    labels: Object.keys(monthlyData).slice(-6),
    datasets: [
      {
        label: '활동/입상 수',
        data: Object.values(monthlyData).slice(-6),
        backgroundColor: '#36A2EB',
        borderColor: '#36A2EB',
        borderWidth: 1
      }
    ]
  } : null;

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">입상 및 활동 정보</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex mb-4">
              <button
                type="button"
                onClick={() => setActiveTab('activity')}
                className={`flex-1 py-2 px-4 rounded-l-lg font-medium ${
                  activeTab === 'activity' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                활동 정보
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('award')}
                className={`flex-1 py-2 px-4 rounded-r-lg font-medium ${
                  activeTab === 'award' ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                입상 정보
              </button>
            </div>

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
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  {activeTab === 'activity' ? '활동명' : '대회/입상명'}
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={activeTab === 'activity' ? '참여한 활동을 입력하세요' : '대회명이나 입상 내용을 입력하세요'}
                />
              </div>

              <input
                type="hidden"
                name="type"
                value={activeTab === 'activity' ? '활동' : '입상'}
                onChange={handleChange}
              />

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  구분 (과목)
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">구분을 선택하세요</option>
                  {subjects.map((subject) => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              {activeTab === 'activity' && (
                <div>
                  <label htmlFor="hours" className="block text-sm font-medium text-gray-700 mb-1">
                    활동 시간 (시간, 선택사항)
                  </label>
                  <input
                    type="number"
                    id="hours"
                    name="hours"
                    value={formData.hours}
                    onChange={handleChange}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="시간 단위로 입력하세요 (선택사항)"
                  />
                </div>
              )}

              {message && (
                <div className={`text-sm p-2 rounded ${
                  message.includes('실패') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                }`}>
                  {message}
                </div>
              )}

              <button
                type="submit"
                className={`w-full text-white py-2 px-4 rounded-md font-medium transition-colors ${
                  activeTab === 'activity' 
                    ? 'bg-blue-500 hover:bg-blue-600' 
                    : 'bg-purple-500 hover:bg-purple-600'
                }`}
              >
                기록 저장
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">전체 활동/입상</h3>
              <p className="text-3xl font-bold text-blue-600">{activities.length}</p>
              <p className="text-sm text-gray-600">총 기록 수</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">활동 기록</h3>
              <p className="text-3xl font-bold text-green-600">{activityRecords.length}</p>
              <p className="text-sm text-gray-600">참여 활동 수</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">입상 기록</h3>
              <p className="text-3xl font-bold text-purple-600">{awards.length}</p>
              <p className="text-sm text-gray-600">입상 횟수</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {subjectChartData && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">과목별 활동 분포</h3>
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

            {monthlyChartData && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">월별 활동량</h3>
                <div className="h-64">
                  <Bar 
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
                        },
                      },
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">🏆</span>
                입상 기록
              </h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {awards.length > 0 ? (
                  awards.map((award) => (
                    <div key={award.id} className="border-l-4 border-purple-500 pl-3">
                      <div className="font-semibold text-gray-800">{award.title}</div>
                      <div className="text-sm text-gray-600">
                        {award.subject} • {award.date}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic">아직 입상 기록이 없습니다.</p>
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">📚</span>
                활동 기록
              </h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {activityRecords.length > 0 ? (
                  activityRecords.map((activity) => (
                    <div key={activity.id} className="border-l-4 border-blue-500 pl-3">
                      <div className="font-semibold text-gray-800">{activity.title}</div>
                      <div className="text-sm text-gray-600">
                        {activity.subject}
                        {activity.hours && ` • ${activity.hours}시간`}
                        <span className="ml-2">{activity.date}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic">아직 활동 기록이 없습니다.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivitiesPage;