import React from 'react';
import { User, PresenceData, Excuse, CellStatus } from '../types';
import { getDayOfWeek } from '../utils/dateUtils';
import { Check, X, Minus, Lock } from 'lucide-react';

interface PresenceTableProps {
  users: User[];
  selectedDays: number[];
  presenceData: PresenceData;
  excuses: Excuse[];
  currentMonth: number;
  currentYear: number;
  onPresenceToggle: (userId: string, day: number) => void;
  isDarkMode: boolean;
}

const PresenceTable: React.FC<PresenceTableProps> = ({
  users,
  selectedDays,
  presenceData,
  excuses,
  currentMonth,
  currentYear,
  onPresenceToggle,
  isDarkMode
}) => {
  if (users.length === 0 || selectedDays.length === 0) {
    return (
      <div className={`rounded-xl shadow-lg border transition-all duration-300 ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="p-12 text-center">
          <div className={`mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <Check className="w-16 h-16 mx-auto opacity-50" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Ready to Track Presence</h3>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {users.length === 0 && selectedDays.length === 0 
              ? 'Add users and select days to start tracking'
              : users.length === 0 
                ? 'Add some users to get started'
                : 'Select days to track from the Calendar tab'
            }
          </p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: CellStatus) => {
    switch (status) {
      case 'present':
        return 'bg-green-500 hover:bg-green-600 text-white';
      case 'absent':
        return 'bg-red-500 hover:bg-red-600 text-white';
      default:
        return isDarkMode 
          ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
          : 'bg-gray-100 hover:bg-gray-200 text-gray-700';
    }
  };

  const getStatusIcon = (status: CellStatus) => {
    switch (status) {
      case 'present':
        return <Check className="w-4 h-4" />;
      case 'absent':
        return <X className="w-4 h-4" />;
      default:
        return <Minus className="w-4 h-4" />;
    }
  };

  const hasExcuse = (userId: string, day: number) => {
    const dayOfWeek = getDayOfWeek(day, currentMonth, currentYear);
    return excuses.some(excuse => excuse.userId === userId && excuse.dayOfWeek === dayOfWeek);
  };

  const getUserExcuse = (userId: string, day: number) => {
    const dayOfWeek = getDayOfWeek(day, currentMonth, currentYear);
    return excuses.find(excuse => excuse.userId === userId && excuse.dayOfWeek === dayOfWeek);
  };

  return (
    <div className="space-y-6">
      <div className={`rounded-xl shadow-lg border transition-all duration-300 ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              <Check className="w-6 h-6 mr-2 text-green-500" />
              Presence Tracking
            </h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span>Present</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span>Absent</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className={`w-3 h-3 rounded ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
                  <span>Not Set</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Lock className="w-3 h-3 text-yellow-500" />
                  <span>Excused</span>
                </div>
              </div>
            </div>
          </div>

          {/* Table Container with Horizontal Scroll */}
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <th className={`text-left py-4 px-4 font-semibold ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Name
                  </th>
                  {selectedDays.map(day => (
                    <th key={day} className={`text-center py-4 px-2 font-semibold min-w-[60px] ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      <div className="text-sm">Day</div>
                      <div className="text-lg">{day}</div>
                    </th>
                  ))}
                  <th className={`text-center py-4 px-4 font-semibold ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Summary
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, userIndex) => (
                  <tr 
                    key={user.id} 
                    className={`border-b transition-colors hover:bg-opacity-50 ${
                      isDarkMode 
                        ? 'border-gray-700 hover:bg-gray-700' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <td className={`py-4 px-4 font-medium ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-900'
                    }`}>
                      <div className="flex items-center space-x-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                          ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500'][userIndex % 5]
                        }`}>
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span>{user.name}</span>
                      </div>
                    </td>
                    {selectedDays.map(day => {
                      const status = presenceData[user.id]?.[day] || null;
                      const isExcused = hasExcuse(user.id, day);
                      const excuse = getUserExcuse(user.id, day);
                      
                      return (
                        <td key={day} className="py-2 px-2 text-center">
                          {isExcused ? (
                            <div 
                              className={`relative w-10 h-10 mx-auto rounded-lg flex items-center justify-center cursor-help ${
                                isDarkMode ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-700'
                              }`}
                              title={excuse?.description || 'Excused'}
                            >
                              <Lock className="w-4 h-4" />
                            </div>
                          ) : (
                            <button
                              onClick={() => onPresenceToggle(user.id, day)}
                              className={`w-10 h-10 mx-auto rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-md ${
                                getStatusColor(status)
                              }`}
                            >
                              {getStatusIcon(status)}
                            </button>
                          )}
                        </td>
                      );
                    })}
                    <td className="py-4 px-4 text-center">
                      <div className="space-y-1">
                        <div className="flex items-center justify-center space-x-4 text-sm">
                          <span className="flex items-center space-x-1 text-green-600">
                            <Check className="w-4 h-4" />
                            <span className="font-semibold">{user.totalPresent}</span>
                          </span>
                          <span className="flex items-center space-x-1 text-red-600">
                            <X className="w-4 h-4" />
                            <span className="font-semibold">{user.totalAbsent}</span>
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {Math.round((user.totalPresent / (user.totalPresent + user.totalAbsent)) * 100) || 0}% present
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Statistics */}
          <div className={`mt-6 p-4 rounded-lg border ${
            isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
          }`}>
            <h4 className="font-semibold mb-3">Quick Stats</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{users.length}</div>
                <div className="text-sm text-gray-500">Total Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {users.reduce((sum, user) => sum + user.totalPresent, 0)}
                </div>
                <div className="text-sm text-gray-500">Total Present</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {users.reduce((sum, user) => sum + user.totalAbsent, 0)}
                </div>
                <div className="text-sm text-gray-500">Total Absent</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{selectedDays.length}</div>
                <div className="text-sm text-gray-500">Days Tracked</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PresenceTable;