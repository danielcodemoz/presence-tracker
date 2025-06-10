import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { User, PresenceData, Excuse, CellStatus, Account, AuthState, AppSettings } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { getDaysInMonth, getMonthName, getDayOfWeek } from './utils/dateUtils';
import { exportToCSV, exportToExcel, exportToPDF } from './utils/exportUtils';
import { useTranslation } from './utils/translations';
import { getThemeClasses } from './utils/themes';
import BulkNameInput from './components/BulkNameInput';
import CalendarSelector from './components/CalendarSelector';
import PresenceTable from './components/PresenceTable';
import Analytics from './components/Analytics';
import ExcuseManager from './components/ExcuseManager';
import BulkExcuseManager from './components/BulkExcuseManager';
import AuthModal from './components/AuthModal';
import AccountManagement from './components/AccountManagement';
import Settings from './components/Settings';
import UserManagement from './components/UserManagement';
import { 
  Users, 
  Calendar, 
  BarChart3, 
  Settings as SettingsIcon, 
  Download,
  Search,
  Plus,
  FileText,
  Table,
  FileSpreadsheet,
  LogOut,
  Shield,
  User as UserIcon,
  Globe,
  Palette,
  Heart
} from 'lucide-react';

function App() {
  // Authentication state
  const [authState, setAuthState] = useLocalStorage<AuthState>('auth-state', {
    isAuthenticated: false,
    currentUser: null,
    accounts: [
      {
        id: 'admin-default',
        username: 'admin',
        password: 'admin',
        role: 'admin',
        createdAt: new Date().toISOString()
      }
    ]
  });

  // App settings
  const [settings, setSettings] = useLocalStorage<AppSettings>('app-settings', {
    reportTitle: '',
    language: 'en',
    theme: 'light'
  });

  // User data (scoped to current user)
  const userDataKey = authState.currentUser ? `user-data-${authState.currentUser.id}` : 'user-data-guest';
  const [users, setUsers] = useLocalStorage<User[]>(`${userDataKey}-users`, []);
  const [selectedDays, setSelectedDays] = useLocalStorage<number[]>(`${userDataKey}-selected-days`, []);
  const [presenceData, setPresenceData] = useLocalStorage<PresenceData>(`${userDataKey}-presence-data`, {});
  const [excuses, setExcuses] = useLocalStorage<Excuse[]>(`${userDataKey}-excuses`, []);
  const [currentMonth, setCurrentMonth] = useLocalStorage(`${userDataKey}-current-month`, new Date().getMonth());
  const [currentYear, setCurrentYear] = useLocalStorage(`${userDataKey}-current-year`, new Date().getFullYear());
  
  const [activeTab, setActiveTab] = useState<'users' | 'calendar' | 'table' | 'analytics' | 'excuses' | 'accounts' | 'settings'>('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(!authState.isAuthenticated);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const t = useTranslation(settings.language);
  const themeClasses = getThemeClasses(settings.theme);

  // Update auth modal visibility when auth state changes
  useEffect(() => {
    setShowAuthModal(!authState.isAuthenticated);
  }, [authState.isAuthenticated]);

  const filteredUsers = useMemo(() => {
    return users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const handleLogin = useCallback((username: string, password: string): boolean => {
    const account = authState.accounts.find(acc => 
      acc.username === username && acc.password === password
    );
    
    if (account) {
      setAuthState({
        ...authState,
        isAuthenticated: true,
        currentUser: account
      });
      return true;
    }
    return false;
  }, [authState, setAuthState]);

  const handleLogout = useCallback(() => {
    setAuthState({
      ...authState,
      isAuthenticated: false,
      currentUser: null
    });
    setActiveTab('users');
  }, [authState, setAuthState]);

  const handleAccountsChange = useCallback((accounts: Account[]) => {
    setAuthState({
      ...authState,
      accounts
    });
  }, [authState, setAuthState]);

  const handleBulkNameSubmit = useCallback((names: string[]) => {
    const newUsers: User[] = names.map(name => ({
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      totalPresent: 0,
      totalAbsent: 0
    }));
    
    setUsers(prev => [...prev, ...newUsers]);
  }, [setUsers]);

  const handleUsersChange = useCallback((updatedUsers: User[]) => {
    setUsers(updatedUsers);
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
        currentStatus === null || currentStatus === undefined ? 'present' :
        currentStatus === 'present' ? 'absent' : 
        currentStatus === 'absent' ? null : 'present';
      
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

  const handleLanguageChange = (language: 'en' | 'pt') => {
    setSettings({ ...settings, language });
    setShowLanguageMenu(false);
  };

  const handleThemeChange = (theme: string) => {
    setSettings({ ...settings, theme });
    setShowThemeMenu(false);
  };

  const handleExportCSV = () => exportToCSV(filteredUsers, presenceData, selectedDays, settings.reportTitle);
  const handleExportExcel = () => exportToExcel(filteredUsers, presenceData, selectedDays, settings.reportTitle);
  const handleExportPDF = () => exportToPDF(filteredUsers, presenceData, selectedDays, settings.reportTitle);

  const tabs = [
    { id: 'users', label: t('users'), icon: Users },
    { id: 'calendar', label: t('calendar'), icon: Calendar },
    { id: 'table', label: t('tracking'), icon: Table },
    { id: 'analytics', label: t('analytics'), icon: BarChart3 },
    { id: 'excuses', label: t('excuses'), icon: Shield },
    ...(authState.currentUser?.role === 'admin' ? [{ id: 'accounts', label: t('accountManagement'), icon: UserIcon }] : []),
    { id: 'settings', label: t('settings'), icon: SettingsIcon }
  ];

  const themes = [
    { value: 'light', label: t('light'), gradient: 'from-blue-50 to-indigo-100' },
    { value: 'dark', label: t('dark'), gradient: 'from-gray-800 to-gray-900' },
    { value: 'blue', label: t('blue'), gradient: 'from-blue-900 to-blue-800' },
    { value: 'green', label: t('green'), gradient: 'from-emerald-900 to-green-800' },
    { value: 'purple', label: t('purple'), gradient: 'from-purple-900 to-violet-800' }
  ];

  if (!authState.isAuthenticated) {
    return (
      <div className={`min-h-screen transition-all duration-300 ${themeClasses.background} ${themeClasses.text}`}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2">{t('presenceTracker')}</h1>
            <p className={`mb-8 ${themeClasses.muted}`}>
              {settings.language === 'en' ? 'Please sign in to continue' : 'Faça login para continuar'}
            </p>
          </div>
        </div>
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => {}}
          onLogin={handleLogin}
          language={settings.language}
          theme={settings.theme}
        />
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-all duration-300 ${themeClasses.background} ${themeClasses.text}`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 backdrop-blur-md border-b transition-all duration-300 ${themeClasses.header} ${themeClasses.border}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {t('presenceTracker')}
                </h1>
              </div>
              <div className="hidden md:flex items-center space-x-1">
                <span className={`text-sm ${themeClasses.muted}`}>
                  {getMonthName(currentMonth)} {currentYear}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${themeClasses.muted}`} />
                <input
                  type="text"
                  placeholder={`${t('search')} ${t('users').toLowerCase()}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`pl-10 pr-4 py-2 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${themeClasses.input}`}
                />
              </div>

              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                  className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${themeClasses.card} ${themeClasses.cardHover} shadow-sm`}
                  title={t('language')}
                >
                  <Globe className="w-5 h-5" />
                </button>
                
                {showLanguageMenu && (
                  <div className={`absolute right-0 mt-2 w-32 rounded-lg shadow-lg border z-10 ${themeClasses.card} ${themeClasses.border}`}>
                    <div className="py-1">
                      <button
                        onClick={() => handleLanguageChange('en')}
                        className={`flex items-center w-full px-4 py-2 text-sm transition-colors ${
                          settings.language === 'en' ? 'bg-blue-500 text-white' : themeClasses.cardHover
                        }`}
                      >
                        🇺🇸 English
                      </button>
                      <button
                        onClick={() => handleLanguageChange('pt')}
                        className={`flex items-center w-full px-4 py-2 text-sm transition-colors ${
                          settings.language === 'pt' ? 'bg-blue-500 text-white' : themeClasses.cardHover
                        }`}
                      >
                        🇧🇷 Português
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Theme Selector */}
              <div className="relative">
                <button
                  onClick={() => setShowThemeMenu(!showThemeMenu)}
                  className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${themeClasses.card} ${themeClasses.cardHover} shadow-sm`}
                  title={t('theme')}
                >
                  <Palette className="w-5 h-5" />
                </button>
                
                {showThemeMenu && (
                  <div className={`absolute right-0 mt-2 w-40 rounded-lg shadow-lg border z-10 ${themeClasses.card} ${themeClasses.border}`}>
                    <div className="py-1">
                      {themes.map(theme => (
                        <button
                          key={theme.value}
                          onClick={() => handleThemeChange(theme.value)}
                          className={`flex items-center w-full px-4 py-2 text-sm transition-colors ${
                            settings.theme === theme.value ? 'bg-blue-500 text-white' : themeClasses.cardHover
                          }`}
                        >
                          <div className={`w-4 h-4 rounded mr-2 bg-gradient-to-r ${theme.gradient}`}></div>
                          {theme.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Export Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${themeClasses.card} ${themeClasses.cardHover} shadow-sm`}
                >
                  <Download className="w-5 h-5" />
                </button>
                
                {showExportMenu && (
                  <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg border z-10 ${themeClasses.card} ${themeClasses.border}`}>
                    <div className="py-1">
                      <button
                        onClick={() => { handleExportCSV(); setShowExportMenu(false); }}
                        className={`flex items-center w-full px-4 py-2 text-sm hover:bg-opacity-50 transition-colors ${themeClasses.cardHover}`}
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        {t('exportCSV')}
                      </button>
                      <button
                        onClick={() => { handleExportExcel(); setShowExportMenu(false); }}
                        className={`flex items-center w-full px-4 py-2 text-sm hover:bg-opacity-50 transition-colors ${themeClasses.cardHover}`}
                      >
                        <FileSpreadsheet className="w-4 h-4 mr-2" />
                        {t('exportExcel')}
                      </button>
                      <button
                        onClick={() => { handleExportPDF(); setShowExportMenu(false); }}
                        className={`flex items-center w-full px-4 py-2 text-sm hover:bg-opacity-50 transition-colors ${themeClasses.cardHover}`}
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        {t('exportPDF')}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* User Menu */}
              <div className="flex items-center space-x-2">
                <span className={`text-sm ${themeClasses.muted}`}>
                  {authState.currentUser?.username}
                </span>
                <button
                  onClick={handleLogout}
                  className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${themeClasses.card} ${themeClasses.cardHover} shadow-sm`}
                  title={t('signOut')}
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className={`border-b ${themeClasses.nav}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-all duration-200 whitespace-nowrap ${
                  activeTab === id
                    ? 'border-blue-500 text-blue-600'
                    : `border-transparent ${themeClasses.muted} hover:text-current`
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
            <div className={`rounded-xl shadow-lg border transition-all duration-300 ${themeClasses.card}`}>
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <Users className="w-6 h-6 mr-2 text-blue-500" />
                  {t('userManagement')}
                </h2>
                <BulkNameInput 
                  onSubmit={handleBulkNameSubmit} 
                  language={settings.language}
                  theme={settings.theme}
                />
              </div>
            </div>

            {/* User Management Component */}
            <UserManagement
              users={users}
              onUsersChange={handleUsersChange}
              language={settings.language}
              theme={settings.theme}
            />
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
            language={settings.language}
            theme={settings.theme}
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
            language={settings.language}
            theme={settings.theme}
          />
        )}

        {activeTab === 'analytics' && (
          <Analytics
            users={filteredUsers}
            presenceData={presenceData}
            selectedDays={selectedDays}
            language={settings.language}
            theme={settings.theme}
          />
        )}

        {activeTab === 'excuses' && (
          <div className="space-y-6">
            <BulkExcuseManager
              users={users}
              excuses={excuses}
              onExcusesChange={setExcuses}
              language={settings.language}
              theme={settings.theme}
            />
            <ExcuseManager
              users={users}
              excuses={excuses}
              onExcusesChange={setExcuses}
              language={settings.language}
              theme={settings.theme}
            />
          </div>
        )}

        {activeTab === 'accounts' && authState.currentUser && (
          <AccountManagement
            accounts={authState.accounts}
            currentUser={authState.currentUser}
            onAccountsChange={handleAccountsChange}
            language={settings.language}
            theme={settings.theme}
          />
        )}

        {activeTab === 'settings' && (
          <Settings
            settings={settings}
            onSettingsChange={setSettings}
            language={settings.language}
            theme={settings.theme}
          />
        )}
      </main>

      {/* Footer */}
      <footer className={`border-t mt-16 ${themeClasses.border}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <p className={`text-sm flex items-center justify-center space-x-1 ${themeClasses.muted}`}>
              <span>{settings.language === 'en' ? 'Developed with' : 'Desenvolvido com'}</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>{settings.language === 'en' ? 'by' : 'por'}</span>
              <span className="font-semibold text-blue-600">Daniel258</span>
              <span>🇲🇿</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;