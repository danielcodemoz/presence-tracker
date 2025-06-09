import React, { useState, useCallback, useMemo } from 'react';
import { User, PresenceData, Excuse, CellStatus } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { getDaysInMonth, getMonthName, getDayOfWeek } from './utils/dateUtils';
import { exportToCSV, exportToExcel, exportToPDF } from './utils/exportUtils';
import BulkNameInput from './components/BulkNameInput';
import ThemeToggle from './components/ThemeToggle';
import CalendarSelector from './components/CalendarSelector';
import PresenceTable from './components/PresenceTable';
import Analytics from './components/Analytics';
import ExcuseManager from './components/ExcuseManager';
import { 
  Users, 
  Calendar, 
  BarChart3, 
  Settings, 
  Download,
  Search,
  Filter,
  Plus,
  FileText,
  Table,
  FileSpreadsheet
} from 'lucide-react';

function App() {
  const [users, setUsers] = useLocalStorage<User[]>('presence-users', []);
  const [selectedDays, setSelectedDays] = useLocalStorage<number[]>('selected-days', []);
  const [presenceData, setPresenceData] = useLocalStorage<PresenceData>('presence-data', {});
  const [excuses, setExcuses] = useLocalStorage<Excuse[]>('excuses', []);
  const [currentMonth, setCurrentMonth] = useLocalStorage('current-month', new Date().getMonth());
  const [currentYear, setCurrentYear] = useLocalStorage('current-year', new Date().getFullYear());
  const [isDarkMode, setIsDarkMode] = useLocalStorage('dark-mode', false);
  
  const [activeTab, setActiveTab] = useState<'users' | 'calendar' | 'table' | 'analytics' | 'excuses'>('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [showExportMenu, setShowExportMenu] = useState(false);

  const filteredUsers = useMemo(() => {
    return users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const handleBulkNameSubmit = useCallback((names: string[]) => {
    const newUsers: User[] = names.map(name => ({
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      totalPresent: 0,
      totalAbsent: 0
    }));
    
    setUsers(prev => [...prev, ...newUsers]);
  }, [setUsers]);

  const handlePresenceToggle = useCallback((userId: string, day: number) => {
    // Check if user has excuse for this day
    const dayOfWeek = getDayOfWeek(day, currentMonth, currentYear);
    const hasExcuse = excuses.some(excuse => 
      excuse.userId === userId && excuse.dayOfWeek === dayOfWeek
    );
    
    if (hasExcuse) return; // Don't allow toggle if there's an excuse
    
    setPresenceData(prev => {
      const newData = { ...prev };
      if (!newData[userId]) newData[userId] = {};
      
      const currentStatus = newData[userId][day];
      const newStatus: CellStatus = 
        currentStatus === null ? 'present' :
        currentStatus === 'present' ? 'absent' : null;
      
      newData[userId][day] = newStatus;
      return newData;
    });

    // Update user totals
    setUsers(prev => prev.map(user => {
      if (user.id === userId) {
        const userPresenceData = presenceData[userId] || {};
        const presentCount = Object.values(userPresenceData).filter(status => status === 'present').length;
        const absentCount = Object.values(userPresenceData).filter(status => status === 'absent').length;
        
        return {
          ...user,
          totalPresent: presentCount,
          totalAbsent: absentCount
        };
      }
      return user;
    }));
  }, [excuses, currentMonth, currentYear, presenceData, setPresenceData, setUsers]);

  const handleExportCSV = () => exportToCSV(filteredUsers, presenceData, selectedDays);
  const handleExportExcel = () => exportToExcel(filteredUsers, presenceData, selectedDays);
  const handleExportPDF = () => exportToPDF(filteredUsers, presenceData, selectedDays);

  const tabs = [
    { id: 'users', label: 'Users', icon: Users },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'table', label: 'Tracking', icon: Table },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'excuses', label: 'Excuses', icon: Settings }
  ];

  const themeClasses = isDarkMode 
    ? 'bg-gray-900 text-white' 
    : 'bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-900';

  return (
    <div className={`min-h-screen transition-all duration-300 ${themeClasses}`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 backdrop-blur-md border-b transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gray-800/80 border-gray-700' 
          : 'bg-white/80 border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Presence Tracker
                </h1>
              </div>
              <div className="hidden md:flex items-center space-x-1">
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {getMonthName(currentMonth)} {currentYear}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`pl-10 pr-4 py-2 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>

              {/* Export Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                    isDarkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                      : 'bg-white hover:bg-gray-50 text-gray-700 shadow-sm'
                  }`}
                >
                  <Download className="w-5 h-5" />
                </button>
                
                {showExportMenu && (
                  <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg border z-10 ${
                    isDarkMode 
                      ? 'bg-gray-800 border-gray-700' 
                      : 'bg-white border-gray-200'
                  }`}>
                    <div className="py-1">
                      <button
                        onClick={() => { handleExportCSV(); setShowExportMenu(false); }}
                        className={`flex items-center w-full px-4 py-2 text-sm hover:bg-opacity-50 transition-colors ${
                          isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                        }`}
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Export CSV
                      </button>
                      <button
                        onClick={() => { handleExportExcel(); setShowExportMenu(false); }}
                        className={`flex items-center w-full px-4 py-2 text-sm hover:bg-opacity-50 transition-colors ${
                          isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                        }`}
                      >
                        <FileSpreadsheet className="w-4 h-4 mr-2" />
                        Export Excel
                      </button>
                      <button
                        onClick={() => { handleExportPDF(); setShowExportMenu(false); }}
                        className={`flex items-center w-full px-4 py-2 text-sm hover:bg-opacity-50 transition-colors ${
                          isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                        }`}
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Export PDF
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <ThemeToggle isDarkMode={isDarkMode} onToggle={() => setIsDarkMode(!isDarkMode)} />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-all duration-200 whitespace-nowrap ${
                  activeTab === id
                    ? 'border-blue-500 text-blue-600'
                    : `border-transparent ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className={`rounded-xl shadow-lg border transition-all duration-300 ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <Users className="w-6 h-6 mr-2 text-blue-500" />
                  User Management
                </h2>
                <BulkNameInput onSubmit={handleBulkNameSubmit} isDarkMode={isDarkMode} />
              </div>
            </div>

            {/* Users List */}
            {filteredUsers.length > 0 && (
              <div className={`rounded-xl shadow-lg border transition-all duration-300 ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Registered Users ({filteredUsers.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredUsers.map((user) => (
                      <div
                        key={user.id}
                        className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 hover:border-gray-500' 
                            : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-medium mb-2">{user.name}</div>
                        <div className="flex justify-between text-sm">
                          <span className="text-green-500">Present: {user.totalPresent}</span>
                          <span className="text-red-500">Absent: {user.totalAbsent}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'calendar' && (
          <CalendarSelector
            selectedDays={selectedDays}
            onDaysChange={setSelectedDays}
            currentMonth={currentMonth}
            currentYear={currentYear}
            onMonthChange={setCurrentMonth}
            onYearChange={setCurrentYear}
            isDarkMode={isDarkMode}
          />
        )}

        {activeTab === 'table' && (
          <PresenceTable
            users={filteredUsers}
            selectedDays={selectedDays}
            presenceData={presenceData}
            excuses={excuses}
            currentMonth={currentMonth}
            currentYear={currentYear}
            onPresenceToggle={handlePresenceToggle}
            isDarkMode={isDarkMode}
          />
        )}

        {activeTab === 'analytics' && (
          <Analytics
            users={filteredUsers}
            presenceData={presenceData}
            selectedDays={selectedDays}
            isDarkMode={isDarkMode}
          />
        )}

        {activeTab === 'excuses' && (
          <ExcuseManager
            users={users}
            excuses={excuses}
            onExcusesChange={setExcuses}
            isDarkMode={isDarkMode}
          />
        )}
      </main>
    </div>
  );
}

export default App;