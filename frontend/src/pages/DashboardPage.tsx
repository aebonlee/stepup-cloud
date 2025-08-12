import React, { useState, useEffect } from 'react';
// 타임스탬프 업데이트 - 2025.01.12 16:30
import api from '../config/api';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
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
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface StudyStats {
  daily: { date: string; total_minutes: number }[];
  subjects: { subject: string; total_minutes: number }[];
  weekly: { week: string; total_minutes: number }[];
}

interface ReadingStats {
  monthly: { month: string; book_count: number }[];
  categories: { category: string; book_count: number }[];
  totalReviews: number;
}

const DashboardPage: React.FC = () => {
  const [studyStats, setStudyStats] = useState<StudyStats | null>(null);
  const [readingStats, setReadingStats] = useState<ReadingStats | null>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllStats();
  }, []);

  const fetchAllStats = async () => {
    try {
      const [studyResponse, readingResponse, activitiesResponse] = await Promise.all([
        api.get('/api/stats/study'),
        api.get('/api/stats/reading'),
        api.get('/api/awards-activities')
      ]);

      setStudyStats(studyResponse.data);
      setReadingStats(readingResponse.data);
      setActivities(activitiesResponse.data);
    } catch (error) {
      console.error('통계 데이터를 불러오는데 실패했습니다:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  const totalStudyTime = studyStats?.subjects.reduce((sum, item) => sum + item.total_minutes, 0) || 0;
  const totalBooks = readingStats?.monthly.reduce((sum, item) => sum + item.book_count, 0) || 0;
  const totalActivities = activities.length;
  const awards = activities.filter(item => item.type === '입상').length;

  const weeklyStudyData = studyStats?.weekly ? {
    labels: studyStats.weekly.slice(-8).map(item => `${item.week}주차`),
    datasets: [
      {
        label: '주간 학습량 (분)',
        data: studyStats.weekly.slice(-8).map(item => item.total_minutes),
        borderColor: '#3B82F6',
        backgroundColor: '#3B82F620',
        borderWidth: 2,
        fill: true,
        tension: 0.3
      }
    ]
  } : null;

  const subjectStudyData = studyStats?.subjects ? {
    labels: studyStats.subjects.map(item => item.subject),
    datasets: [
      {
        label: '학습시간 (분)',
        data: studyStats.subjects.map(item => item.total_minutes),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
          '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384'
        ],
        borderWidth: 1
      }
    ]
  } : null;

  const readingCategoryData = readingStats?.categories ? {
    labels: readingStats.categories.map(item => item.category || '미분류'),
    datasets: [
      {
        data: readingStats.categories.map(item => item.book_count),
        backgroundColor: [
          '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4',
          '#84CC16', '#F97316', '#EC4899', '#6366F1', '#14B8A6'
        ],
        borderWidth: 2,
        borderColor: '#fff'
      }
    ]
  } : null;

  const monthlyReadingData = readingStats?.monthly ? {
    labels: readingStats.monthly.slice(-6).map(item => item.month),
    datasets: [
      {
        label: '월별 독서량',
        data: readingStats.monthly.slice(-6).map(item => item.book_count),
        backgroundColor: '#10B981',
        borderColor: '#10B981',
        borderWidth: 1
      }
    ]
  } : null;

  const recentActivities = activities.slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">종합 대시보드</h1>
        <p className="text-gray-600">학습, 독서, 활동의 종합적인 성장 분석</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">총 학습시간</p>
              <p className="text-3xl font-bold">{Math.floor(totalStudyTime / 60)}시간</p>
              <p className="text-blue-100 text-sm">{totalStudyTime % 60}분</p>
            </div>
            <div className="text-4xl opacity-80">📚</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">읽은 책</p>
              <p className="text-3xl font-bold">{totalBooks}권</p>
              <p className="text-green-100 text-sm">감상문 {readingStats?.totalReviews || 0}개</p>
            </div>
            <div className="text-4xl opacity-80">📖</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">입상 횟수</p>
              <p className="text-3xl font-bold">{awards}</p>
              <p className="text-purple-100 text-sm">수상 기록</p>
            </div>
            <div className="text-4xl opacity-80">🏆</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">총 활동</p>
              <p className="text-3xl font-bold">{totalActivities}</p>
              <p className="text-orange-100 text-sm">참여 기록</p>
            </div>
            <div className="text-4xl opacity-80">🎯</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {weeklyStudyData && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">주간별 학습량 추이</h2>
            <div className="h-80">
              <Line 
                data={weeklyStudyData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) => `${Math.floor(context.parsed.y / 60)}시간 ${context.parsed.y % 60}분`
                      }
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: (value) => `${Math.floor(Number(value) / 60)}h`
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        )}

        {monthlyReadingData && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">월별 독서량 (최근 6개월)</h2>
            <div className="h-80">
              <Bar 
                data={monthlyReadingData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        stepSize: 1
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {subjectStudyData && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">과목별 학습 분포</h2>
            <div className="h-64">
              <Bar 
                data={subjectStudyData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) => `${Math.floor(context.parsed.y / 60)}시간 ${context.parsed.y % 60}분`
                      }
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: (value) => `${Math.floor(Number(value) / 60)}h`
                      }
                    },
                    x: {
                      ticks: {
                        maxRotation: 45
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        )}

        {readingCategoryData && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">독서 카테고리 분포</h2>
            <div className="h-64">
              <Doughnut 
                data={readingCategoryData} 
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
                    }
                  }
                }}
              />
            </div>
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">최근 활동 기록</h2>
          <div className="space-y-3">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${
                    activity.type === '입상' ? 'bg-purple-500' : 'bg-blue-500'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {activity.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {activity.subject} • {activity.date}
                    </p>
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    activity.type === '입상' 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {activity.type}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm italic">아직 활동 기록이 없습니다.</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">성장 인사이트</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">🎯 학습 현황</h3>
            <p className="text-sm text-blue-700">
              {studyStats?.subjects.length ? 
                `${studyStats.subjects.length}개 과목을 학습하고 있으며, 
                 주로 ${studyStats.subjects[0]?.subject}에 집중하고 있습니다.` :
                '학습 기록을 추가하여 성장을 추적해보세요.'
              }
            </p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">📚 독서 습관</h3>
            <p className="text-sm text-green-700">
              {readingStats?.categories.length ? 
                `다양한 분야의 책을 읽고 있으며, 
                 ${readingStats.totalReviews}개의 감상문을 작성했습니다.` :
                '독서 기록을 시작하여 읽기 습관을 만들어보세요.'
              }
            </p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-800 mb-2">🏆 성과 달성</h3>
            <p className="text-sm text-purple-700">
              {awards > 0 ? 
                `총 ${awards}번의 입상 경험이 있으며, 
                 꾸준한 노력의 결과를 보여줍니다.` :
                '다양한 대회와 활동에 참여하여 경험을 쌓아보세요.'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;