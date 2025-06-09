import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { User, PresenceData } from '../types';
import { TrendingUp, Users, Calendar, Award } from 'lucide-react';
import { useTranslation } from '../utils/translations';
import { getThemeClasses } from '../utils/themes';

interface AnalyticsProps {
  users: User[];
  presenceData: PresenceData;
  selectedDays: number[];
  language: 'en' | 'pt';
  theme: string;
}

const Analytics: React.FC<AnalyticsProps> = ({ users, presenceData, selectedDays, language, theme }) => {
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];
  
  const t = useTranslation(language);
  const themeClasses = getThemeClasses(theme);

  // Calculate user attendance data
  const userAttendanceData = users.map(user => {
    const total = user.totalPresent + user.totalAbsent;
    const rate = total > 0 ? Math.round((user.totalPresent / total) * 100) : 0;
    
    return {
      name: user.name.length > 10 ? user.name.substring(0, 10) + '...' : user.name,
      fullName: user.name,
      present: user.totalPresent,
      absent: user.totalAbsent,
      rate: rate
    };
  });

  // Calculate overall statistics
  const totalUsers = users.length;
  const totalPresent = users.reduce((sum, user) => sum + user.totalPresent, 0);
  const totalAbsent = users.reduce((sum, user) => sum + user.totalAbsent, 0);
  const overallRate = totalPresent + totalAbsent > 0 ? Math.round((totalPresent / (totalPresent + totalAbsent)) * 100) : 0;

  // Calculate daily attendance trends
  const dailyTrends = selectedDays.map(day => {
    let presentCount = 0;
    let absentCount = 0;
    
    users.forEach(user => {
      const status = presenceData[user.id]?.[day];
      if (status === 'present') presentCount++;
      else if (status === 'absent') absentCount++;
    });
    
    return {
      day: `${language === 'en' ? 'Day' : 'Dia'} ${day}`,
      present: presentCount,
      absent: absentCount,
      total: presentCount + absentCount,
      rate: presentCount + absentCount > 0 ? Math.round((presentCount / (presentCount + absentCount)) * 100) : 0
    };
  });

  // Pie chart data for overall distribution
  const pieData = [
    { name: t('present'), value: totalPresent, color: '#10B981' },
    { name: t('absent'), value: totalAbsent, color: '#EF4444' }
  ];

  // Top performers
  const topPerformers = [...userAttendanceData]
    .sort((a, b) => b.rate - a.rate)
    .slice(0, 5);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-3 rounded-lg shadow-lg border ${themeClasses.card} ${themeClasses.border}`}>
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (users.length === 0 || selectedDays.length === 0) {
    return (
      <div className={`rounded-xl shadow-lg border transition-all duration-300 ${themeClasses.card}`}>
        <div className="p-12 text-center">
          <TrendingUp className={`w-16 h-16 mx-auto mb-4 opacity-50 ${themeClasses.muted}`} />
          <h3 className="text-xl font-semibold mb-2">{t('noAnalyticsAvailable')}</h3>
          <p className={themeClasses.muted}>
            {t('addUsersToSeeAnalytics')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className={`p-6 rounded-xl shadow-lg border transition-all duration-300 ${themeClasses.card}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${themeClasses.muted}`}>
                {t('totalUsers')}
              </p>
              <p className="text-3xl font-bold text-blue-600">{totalUsers}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className={`p-6 rounded-xl shadow-lg border transition-all duration-300 ${themeClasses.card}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${themeClasses.muted}`}>
                {t('overallAttendance')}
              </p>
              <p className="text-3xl font-bold text-green-600">{overallRate}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className={`p-6 rounded-xl shadow-lg border transition-all duration-300 ${themeClasses.card}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${themeClasses.muted}`}>
                {t('daysTracked')}
              </p>
              <p className="text-3xl font-bold text-purple-600">{selectedDays.length}</p>
            </div>
            <Calendar className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className={`p-6 rounded-xl shadow-lg border transition-all duration-300 ${themeClasses.card}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${themeClasses.muted}`}>
                {t('totalRecords')}
              </p>
              <p className="text-3xl font-bold text-orange-600">{totalPresent + totalAbsent}</p>
            </div>
            <Award className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Attendance Bar Chart */}
        <div className={`p-6 rounded-xl shadow-lg border transition-all duration-300 ${themeClasses.card}`}>
          <h3 className="text-lg font-semibold mb-4">{t('userAttendanceComparison')}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={userAttendanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme === 'light' ? '#E5E7EB' : '#374151'} />
              <XAxis 
                dataKey="name" 
                stroke={theme === 'light' ? '#6B7280' : '#9CA3AF'}
                fontSize={12}
              />
              <YAxis stroke={theme === 'light' ? '#6B7280' : '#9CA3AF'} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="present" fill="#10B981" name={t('present')} radius={[2, 2, 0, 0]} />
              <Bar dataKey="absent" fill="#EF4444" name={t('absent')} radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Overall Distribution Pie Chart */}
        <div className={`p-6 rounded-xl shadow-lg border transition-all duration-300 ${themeClasses.card}`}>
          <h3 className="text-lg font-semibold mb-4">{t('overallDistribution')}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Daily Trends and Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Attendance Trends */}
        <div className={`lg:col-span-2 p-6 rounded-xl shadow-lg border transition-all duration-300 ${themeClasses.card}`}>
          <h3 className="text-lg font-semibold mb-4">{t('dailyAttendanceTrends')}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme === 'light' ? '#E5E7EB' : '#374151'} />
              <XAxis 
                dataKey="day" 
                stroke={theme === 'light' ? '#6B7280' : '#9CA3AF'}
                fontSize={12}
              />
              <YAxis stroke={theme === 'light' ? '#6B7280' : '#9CA3AF'} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="present" 
                stroke="#10B981" 
                name={t('present')}
                strokeWidth={3}
                dot={{ fill: '#10B981', r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="absent" 
                stroke="#EF4444" 
                name={t('absent')}
                strokeWidth={3}
                dot={{ fill: '#EF4444', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Performers */}
        <div className={`p-6 rounded-xl shadow-lg border transition-all duration-300 ${themeClasses.card}`}>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2 text-yellow-500" />
            {t('topPerformers')}
          </h3>
          <div className="space-y-4">
            {topPerformers.map((user, index) => (
              <div
                key={user.fullName}
                className={`flex items-center justify-between p-3 rounded-lg ${themeClasses.card}`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                    index === 0 ? 'bg-yellow-500' : 
                    index === 1 ? 'bg-gray-400' : 
                    index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{user.fullName}</div>
                    <div className="text-sm text-gray-500">
                      {user.present}P / {user.absent}A
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">{user.rate}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;