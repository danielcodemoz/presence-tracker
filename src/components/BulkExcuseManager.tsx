import React, { useState } from 'react';
import { User, Excuse } from '../types';
import { Shield, Plus, Save, X, Users as UsersIcon, Calendar } from 'lucide-react';
import { useTranslation } from '../utils/translations';
import { getThemeClasses } from '../utils/themes';

interface BulkExcuseManagerProps {
  users: User[];
  excuses: Excuse[];
  onExcusesChange: (excuses: Excuse[]) => void;
  language: 'en' | 'pt';
  theme: string;
}

const BulkExcuseManager: React.FC<BulkExcuseManagerProps> = ({
  users,
  excuses,
  onExcusesChange,
  language,
  theme
}) => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [description, setDescription] = useState('');
  const [showForm, setShowForm] = useState(false);

  const t = useTranslation(language);
  const themeClasses = getThemeClasses(theme);

  const weekDays = [
    t('sunday'), t('monday'), t('tuesday'), t('wednesday'),
    t('thursday'), t('friday'), t('saturday')
  ];

  const handleUserToggle = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleDayToggle = (dayIndex: number) => {
    setSelectedDays(prev =>
      prev.includes(dayIndex)
        ? prev.filter(day => day !== dayIndex)
        : [...prev, dayIndex]
    );
  };

  const handleSelectAllUsers = () => {
    setSelectedUsers(users.map(user => user.id));
  };

  const handleClearUsers = () => {
    setSelectedUsers([]);
  };

  const handleSelectAllDays = () => {
    setSelectedDays([0, 1, 2, 3, 4, 5, 6]);
  };

  const handleSelectWeekdays = () => {
    setSelectedDays([1, 2, 3, 4, 5]); // Monday to Friday
  };

  const handleClearDays = () => {
    setSelectedDays([]);
  };

  const handleSubmit = () => {
    if (selectedUsers.length === 0 || selectedDays.length === 0 || !description.trim()) {
      return;
    }

    const newExcuses: Excuse[] = [];
    
    selectedUsers.forEach(userId => {
      selectedDays.forEach(dayOfWeek => {
        // Check if excuse already exists
        const existingExcuse = excuses.find(excuse => 
          excuse.userId === userId && excuse.dayOfWeek === dayOfWeek
        );
        
        if (!existingExcuse) {
          newExcuses.push({
            id: `excuse-${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${userId}-${dayOfWeek}`,
            userId,
            dayOfWeek,
            description: description.trim()
          });
        }
      });
    });

    onExcusesChange([...excuses, ...newExcuses]);
    
    // Reset form
    setSelectedUsers([]);
    setSelectedDays([]);
    setDescription('');
    setShowForm(false);
  };

  const handleCancel = () => {
    setSelectedUsers([]);
    setSelectedDays([]);
    setDescription('');
    setShowForm(false);
  };

  if (users.length === 0) {
    return (
      <div className={`rounded-xl shadow-lg border transition-all duration-300 ${themeClasses.card}`}>
        <div className="p-12 text-center">
          <Shield className={`w-16 h-16 mx-auto mb-4 opacity-50 ${themeClasses.muted}`} />
          <h3 className="text-xl font-semibold mb-2">{t('noUsersAvailable')}</h3>
          <p className={themeClasses.muted}>
            {t('addUsersFirst')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className={`rounded-xl shadow-lg border transition-all duration-300 ${themeClasses.card}`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center">
              <Shield className="w-5 h-5 mr-2 text-yellow-500" />
              {t('bulkExcuseManagement')}
            </h3>
            <button
              onClick={() => setShowForm(true)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:scale-105 ${themeClasses.button}`}
            >
              <Plus className="w-4 h-4" />
              <span>{t('addBulkExcuses')}</span>
            </button>
          </div>

          {showForm && (
            <div className={`p-4 rounded-lg border ${themeClasses.border}`}>
              <div className="space-y-6">
                {/* User Selection */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold flex items-center">
                      <UsersIcon className="w-4 h-4 mr-2" />
                      {t('selectUsers')} ({selectedUsers.length}/{users.length})
                    </h4>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSelectAllUsers}
                        className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      >
                        {t('selectAll')}
                      </button>
                      <button
                        onClick={handleClearUsers}
                        className={`px-3 py-1 text-sm rounded border transition-colors ${themeClasses.border} ${themeClasses.cardHover}`}
                      >
                        {t('clearAll')}
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {users.map(user => (
                      <label
                        key={user.id}
                        className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-all ${
                          selectedUsers.includes(user.id)
                            ? 'border-blue-500 bg-blue-50'
                            : `${themeClasses.border} ${themeClasses.cardHover}`
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => handleUserToggle(user.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium truncate">{user.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Day Selection */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {t('selectDays')} ({selectedDays.length}/7)
                    </h4>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSelectAllDays}
                        className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      >
                        {t('selectAll')}
                      </button>
                      <button
                        onClick={handleSelectWeekdays}
                        className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                      >
                        {t('weekdaysOnly')}
                      </button>
                      <button
                        onClick={handleClearDays}
                        className={`px-3 py-1 text-sm rounded border transition-colors ${themeClasses.border} ${themeClasses.cardHover}`}
                      >
                        {t('clearAll')}
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
                    {weekDays.map((day, index) => (
                      <label
                        key={index}
                        className={`flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-all ${
                          selectedDays.includes(index)
                            ? 'border-blue-500 bg-blue-50'
                            : `${themeClasses.border} ${themeClasses.cardHover}`
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedDays.includes(index)}
                          onChange={() => handleDayToggle(index)}
                          className="sr-only"
                        />
                        <span className="text-sm font-medium text-center">{day}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${themeClasses.muted}`}>
                    {t('description')}
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g., Medical appointment, Personal leave"
                    className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${themeClasses.input}`}
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleSubmit}
                    disabled={selectedUsers.length === 0 || selectedDays.length === 0 || !description.trim()}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      selectedUsers.length > 0 && selectedDays.length > 0 && description.trim()
                        ? `${themeClasses.button} hover:shadow-lg hover:scale-105`
                        : `cursor-not-allowed ${theme === 'light' ? 'bg-gray-200 text-gray-400' : 'bg-gray-700 text-gray-500'}`
                    }`}
                  >
                    <Save className="w-4 h-4" />
                    <span>
                      {t('addBulkExcuses')} ({selectedUsers.length} × {selectedDays.length})
                    </span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-200 hover:shadow-md ${themeClasses.border} ${themeClasses.cardHover}`}
                  >
                    <X className="w-4 h-4" />
                    <span>{t('cancel')}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className={`mt-6 p-4 rounded-lg border-l-4 border-yellow-500 ${
            theme === 'light' ? 'bg-yellow-50' : 'bg-yellow-900/20'
          }`}>
            <h4 className={`font-medium mb-2 ${theme === 'light' ? 'text-yellow-800' : 'text-yellow-300'}`}>
              💡 {language === 'en' ? 'Bulk Excuse Management:' : 'Gerenciamento em Lote de Justificativas:'}
            </h4>
            <ul className={`text-sm space-y-1 ${theme === 'light' ? 'text-yellow-700' : 'text-yellow-200'}`}>
              <li>• {language === 'en' ? 'Select multiple users and days at once' : 'Selecione múltiplos usuários e dias de uma vez'}</li>
              <li>• {language === 'en' ? 'Perfect for setting regular absences (e.g., medical appointments)' : 'Perfeito para definir ausências regulares (ex: consultas médicas)'}</li>
              <li>• {language === 'en' ? 'Existing excuses for the same user/day combinations will be skipped' : 'Justificativas existentes para as mesmas combinações usuário/dia serão ignoradas'}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkExcuseManager;