import React from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { getDaysInMonth, getDayOfWeek } from '../utils/dateUtils';
import { useTranslation } from '../utils/translations';
import { getThemeClasses } from '../utils/themes';

interface CalendarSelectorProps {
  selectedDays: number[];
  onDaysChange: (days: number[]) => void;
  currentMonth: number;
  currentYear: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
  language: 'en' | 'pt';
  theme: string;
}

const CalendarSelector: React.FC<CalendarSelectorProps> = ({
  selectedDays,
  onDaysChange,
  currentMonth,
  currentYear,
  onMonthChange,
  onYearChange,
  language,
  theme
}) => {
  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDayOfWeek = getDayOfWeek(1, currentMonth, currentYear);
  
  const t = useTranslation(language);
  const themeClasses = getThemeClasses(theme);
  
  const weekDays = [
    t('sunday').slice(0, 3), t('monday').slice(0, 3), t('tuesday').slice(0, 3), 
    t('wednesday').slice(0, 3), t('thursday').slice(0, 3), t('friday').slice(0, 3), 
    t('saturday').slice(0, 3)
  ];
  
  const monthNames = [
    t('january'), t('february'), t('march'), t('april'), t('may'), t('june'),
    t('july'), t('august'), t('september'), t('october'), t('november'), t('december')
  ];

  const handleDayClick = (day: number) => {
    if (selectedDays.includes(day)) {
      onDaysChange(selectedDays.filter(d => d !== day));
    } else {
      onDaysChange([...selectedDays, day].sort((a, b) => a - b));
    }
  };

  const handleSelectAll = () => {
    const allDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    onDaysChange(allDays);
  };

  const handleClearAll = () => {
    onDaysChange([]);
  };

  const handleSelectWeekdays = () => {
    const weekdays = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const dayOfWeek = getDayOfWeek(day, currentMonth, currentYear);
      if (dayOfWeek >= 1 && dayOfWeek <= 5) { // Monday to Friday
        weekdays.push(day);
      }
    }
    onDaysChange(weekdays);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        onMonthChange(11);
        onYearChange(currentYear - 1);
      } else {
        onMonthChange(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        onMonthChange(0);
        onYearChange(currentYear + 1);
      } else {
        onMonthChange(currentMonth + 1);
      }
    }
  };

  // Generate calendar grid
  const calendarDays = [];
  
  // Empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.push(null);
  }
  
  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <div className="space-y-6">
      <div className={`rounded-xl shadow-lg border transition-all duration-300 ${themeClasses.card}`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              <CalendarIcon className="w-6 h-6 mr-2 text-blue-500" />
              {t('selectDaysToTrack')}
            </h2>
            <div className="flex items-center space-x-2">
              <span className={`text-sm px-3 py-1 rounded-full ${
                theme === 'light' ? 'bg-blue-100 text-blue-800' : 'bg-blue-900 text-blue-200'
              }`}>
                {selectedDays.length} {t('daysSelected')}
              </span>
            </div>
          </div>

          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigateMonth('prev')}
              className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${themeClasses.cardHover}`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="flex items-center space-x-4">
              <select
                value={currentMonth}
                onChange={(e) => onMonthChange(parseInt(e.target.value))}
                className={`px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${themeClasses.input}`}
              >
                {monthNames.map((month, index) => (
                  <option key={index} value={index}>{month}</option>
                ))}
              </select>
              
              <select
                value={currentYear}
                onChange={(e) => onYearChange(parseInt(e.target.value))}
                className={`px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${themeClasses.input}`}
              >
                {Array.from({ length: 11 }, (_, i) => currentYear - 5 + i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            
            <button
              onClick={() => navigateMonth('next')}
              className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${themeClasses.cardHover}`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={handleSelectAll}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 hover:shadow-lg hover:scale-105 text-sm font-medium"
            >
              {t('selectAll')}
            </button>
            <button
              onClick={handleSelectWeekdays}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 hover:shadow-lg hover:scale-105 text-sm font-medium"
            >
              {t('weekdaysOnly')}
            </button>
            <button
              onClick={handleClearAll}
              className={`px-4 py-2 rounded-lg border transition-all duration-200 hover:shadow-md text-sm font-medium ${themeClasses.border} ${themeClasses.cardHover}`}
            >
              {t('clearAll')}
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Week day headers */}
            {weekDays.map(day => (
              <div
                key={day}
                className={`p-3 text-center text-sm font-semibold ${themeClasses.muted}`}
              >
                {day}
              </div>
            ))}
            
            {/* Calendar days */}
            {calendarDays.map((day, index) => (
              <div key={index} className="aspect-square">
                {day ? (
                  <button
                    onClick={() => handleDayClick(day)}
                    className={`w-full h-full rounded-lg transition-all duration-200 hover:scale-105 text-sm font-medium ${
                      selectedDays.includes(day)
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                        : `${themeClasses.card} ${themeClasses.cardHover}`
                    }`}
                  >
                    {day}
                  </button>
                ) : (
                  <div></div>
                )}
              </div>
            ))}
          </div>

          {/* Selected Days Summary */}
          {selectedDays.length > 0 && (
            <div className={`mt-6 p-4 rounded-lg border ${themeClasses.card} ${themeClasses.border}`}>
              <h4 className="font-medium mb-2">{t('selectedDays')}:</h4>
              <div className="flex flex-wrap gap-1">
                {selectedDays.map(day => (
                  <span
                    key={day}
                    className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full"
                  >
                    {day}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarSelector;