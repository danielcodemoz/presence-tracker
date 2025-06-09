import React, { useState } from 'react';
import { User, Excuse } from '../types';
import { Shield, Plus, Trash2, Edit3, Save, X } from 'lucide-react';
import { useTranslation } from '../utils/translations';
import { getThemeClasses } from '../utils/themes';

interface ExcuseManagerProps {
  users: User[];
  excuses: Excuse[];
  onExcusesChange: (excuses: Excuse[]) => void;
  language: 'en' | 'pt';
  theme: string;
}

const ExcuseManager: React.FC<ExcuseManagerProps> = ({
  users,
  excuses,
  onExcusesChange,
  language,
  theme
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    userId: '',
    dayOfWeek: 0,
    description: ''
  });

  const t = useTranslation(language);
  const themeClasses = getThemeClasses(theme);

  const weekDays = [
    t('sunday'), t('monday'), t('tuesday'), t('wednesday'),
    t('thursday'), t('friday'), t('saturday')
  ];

  const handleAddExcuse = () => {
    if (formData.userId && formData.description.trim()) {
      const newExcuse: Excuse = {
        id: `excuse-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        userId: formData.userId,
        dayOfWeek: formData.dayOfWeek,
        description: formData.description.trim()
      };

      onExcusesChange([...excuses, newExcuse]);
      setFormData({ userId: '', dayOfWeek: 0, description: '' });
      setShowAddForm(false);
    }
  };

  const handleEditExcuse = (excuse: Excuse) => {
    setFormData({
      userId: excuse.userId,
      dayOfWeek: excuse.dayOfWeek,
      description: excuse.description
    });
    setEditingId(excuse.id);
    setShowAddForm(true);
  };

  const handleUpdateExcuse = () => {
    if (editingId && formData.userId && formData.description.trim()) {
      const updatedExcuses = excuses.map(excuse =>
        excuse.id === editingId
          ? { ...excuse, userId: formData.userId, dayOfWeek: formData.dayOfWeek, description: formData.description.trim() }
          : excuse
      );

      onExcusesChange(updatedExcuses);
      setFormData({ userId: '', dayOfWeek: 0, description: '' });
      setShowAddForm(false);
      setEditingId(null);
    }
  };

  const handleDeleteExcuse = (excuseId: string) => {
    const updatedExcuses = excuses.filter(excuse => excuse.id !== excuseId);
    onExcusesChange(updatedExcuses);
  };

  const handleCancelEdit = () => {
    setFormData({ userId: '', dayOfWeek: 0, description: '' });
    setShowAddForm(false);
    setEditingId(null);
  };

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Unknown User';
  };

  const getUserExcuses = (userId: string) => {
    return excuses.filter(excuse => excuse.userId === userId);
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
            <h2 className="text-2xl font-bold flex items-center">
              <Shield className="w-6 h-6 mr-2 text-yellow-500" />
              {t('excuseManagement')}
            </h2>
            <button
              onClick={() => setShowAddForm(true)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:scale-105 ${themeClasses.button}`}
            >
              <Plus className="w-4 h-4" />
              <span>{t('addExcuse')}</span>
            </button>
          </div>

          {/* Add/Edit Form */}
          {showAddForm && (
            <div className={`mb-6 p-4 rounded-lg border ${themeClasses.card} ${themeClasses.border}`}>
              <h3 className="text-lg font-semibold mb-4">
                {editingId ? t('editExcuse') : t('addNewExcuse')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${themeClasses.muted}`}>
                    {t('user')}
                  </label>
                  <select
                    value={formData.userId}
                    onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${themeClasses.input}`}
                  >
                    <option value="">{language === 'en' ? 'Select User' : 'Selecionar Usuário'}</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>{user.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${themeClasses.muted}`}>
                    {t('dayOfWeek')}
                  </label>
                  <select
                    value={formData.dayOfWeek}
                    onChange={(e) => setFormData({ ...formData, dayOfWeek: parseInt(e.target.value) })}
                    className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${themeClasses.input}`}
                  >
                    {weekDays.map((day, index) => (
                      <option key={index} value={index}>{day}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${themeClasses.muted}`}>
                    {t('description')}
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="e.g., Medical appointment, Personal leave"
                    className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${themeClasses.input}`}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={editingId ? handleUpdateExcuse : handleAddExcuse}
                  disabled={!formData.userId || !formData.description.trim()}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    formData.userId && formData.description.trim()
                      ? `${themeClasses.button} hover:shadow-lg hover:scale-105`
                      : `cursor-not-allowed ${theme === 'light' ? 'bg-gray-200 text-gray-400' : 'bg-gray-700 text-gray-500'}`
                  }`}
                >
                  <Save className="w-4 h-4" />
                  <span>{editingId ? t('updateExcuse') : t('addExcuse')}</span>
                </button>
                <button
                  onClick={handleCancelEdit}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-200 hover:shadow-md ${themeClasses.border} ${themeClasses.cardHover}`}
                >
                  <X className="w-4 h-4" />
                  <span>{t('cancel')}</span>
                </button>
              </div>
            </div>
          )}

          {/* Excuses by User */}
          <div className="space-y-6">
            {users.map(user => {
              const userExcuses = getUserExcuses(user.id);
              return (
                <div
                  key={user.id}
                  className={`p-4 rounded-lg border ${themeClasses.card} ${themeClasses.border}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      {user.name}
                    </h3>
                    <span className={`text-sm px-2 py-1 rounded-full ${themeClasses.card} ${themeClasses.muted}`}>
                      {userExcuses.length} {t('excuse')}{userExcuses.length !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {userExcuses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {userExcuses.map(excuse => (
                        <div
                          key={excuse.id}
                          className={`p-3 rounded-lg border transition-all duration-200 hover:shadow-md ${themeClasses.card} ${themeClasses.border}`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="font-medium text-sm text-yellow-600">
                                {weekDays[excuse.dayOfWeek]}
                              </div>
                              <div className={`text-sm mt-1 ${themeClasses.text}`}>
                                {excuse.description}
                              </div>
                            </div>
                            <div className="flex items-center space-x-1 ml-2">
                              <button
                                onClick={() => handleEditExcuse(excuse)}
                                className={`p-1 rounded transition-colors ${themeClasses.cardHover} ${themeClasses.muted}`}
                              >
                                <Edit3 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleDeleteExcuse(excuse.id)}
                                className="p-1 rounded transition-colors text-red-500 hover:bg-red-100 hover:text-red-700"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={`text-center py-4 ${themeClasses.muted}`}>
                      <Shield className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">{t('noExcusesSet')}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Instructions */}
          <div className={`mt-6 p-4 rounded-lg border-l-4 border-yellow-500 ${
            theme === 'light' ? 'bg-yellow-50' : 'bg-yellow-900/20'
          }`}>
            <h4 className={`font-medium mb-2 ${theme === 'light' ? 'text-yellow-800' : 'text-yellow-300'}`}>
              💡 {t('howExcusesWork')}:
            </h4>
            <ul className={`text-sm space-y-1 ${theme === 'light' ? 'text-yellow-700' : 'text-yellow-200'}`}>
              <li>• {t('excusesBlockTracking')}</li>
              <li>• {t('usersWithExcuses')}</li>
              <li>• {t('daysExcluded')}</li>
              <li>• {t('perfectForRegular')}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExcuseManager;