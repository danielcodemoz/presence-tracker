import React, { useState } from 'react';
import { User } from '../types';
import { Users, Edit3, Trash2, Save, X, Plus } from 'lucide-react';
import { useTranslation } from '../utils/translations';
import { getThemeClasses } from '../utils/themes';

interface UserManagementProps {
  users: User[];
  onUsersChange: (users: User[]) => void;
  language: 'en' | 'pt';
  theme: string;
}

const UserManagement: React.FC<UserManagementProps> = ({
  users,
  onUsersChange,
  language,
  theme
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUserName, setNewUserName] = useState('');

  const t = useTranslation(language);
  const themeClasses = getThemeClasses(theme);

  const handleEdit = (user: User) => {
    setEditingId(user.id);
    setEditName(user.name);
  };

  const handleSave = (userId: string) => {
    if (editName.trim()) {
      const updatedUsers = users.map(user =>
        user.id === userId ? { ...user, name: editName.trim() } : user
      );
      onUsersChange(updatedUsers);
      setEditingId(null);
      setEditName('');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditName('');
  };

  const handleDelete = (userId: string) => {
    if (confirm(language === 'en' ? 'Are you sure you want to delete this user?' : 'Tem certeza que deseja excluir este usuário?')) {
      const updatedUsers = users.filter(user => user.id !== userId);
      onUsersChange(updatedUsers);
    }
  };

  const handleAddUser = () => {
    if (newUserName.trim()) {
      const newUser: User = {
        id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: newUserName.trim(),
        totalPresent: 0,
        totalAbsent: 0
      };
      onUsersChange([...users, newUser]);
      setNewUserName('');
      setShowAddForm(false);
    }
  };

  const handleCancelAdd = () => {
    setNewUserName('');
    setShowAddForm(false);
  };

  if (users.length === 0) {
    return (
      <div className={`rounded-xl shadow-lg border transition-all duration-300 ${themeClasses.card}`}>
        <div className="p-12 text-center">
          <Users className={`w-16 h-16 mx-auto mb-4 opacity-50 ${themeClasses.muted}`} />
          <h3 className="text-xl font-semibold mb-2">{t('noUsersAvailable')}</h3>
          <p className={themeClasses.muted}>
            {language === 'en' ? 'Add users using the form above to get started' : 'Adicione usuários usando o formulário acima para começar'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-xl shadow-lg border transition-all duration-300 ${themeClasses.card}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">
            {t('registeredUsers')} ({users.length})
          </h3>
          <button
            onClick={() => setShowAddForm(true)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:scale-105 ${themeClasses.button}`}
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'en' ? 'Add Single User' : 'Adicionar Usuário'}</span>
          </button>
        </div>

        {/* Add User Form */}
        {showAddForm && (
          <div className={`mb-6 p-4 rounded-lg border ${themeClasses.border}`}>
            <h4 className="font-medium mb-3">{language === 'en' ? 'Add New User' : 'Adicionar Novo Usuário'}</h4>
            <div className="flex items-center space-x-3">
              <input
                type="text"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                placeholder={language === 'en' ? 'Enter user name' : 'Digite o nome do usuário'}
                className={`flex-1 px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${themeClasses.input}`}
                onKeyPress={(e) => e.key === 'Enter' && handleAddUser()}
              />
              <button
                onClick={handleAddUser}
                disabled={!newUserName.trim()}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  newUserName.trim()
                    ? `${themeClasses.button} hover:shadow-lg hover:scale-105`
                    : `cursor-not-allowed ${theme === 'light' ? 'bg-gray-200 text-gray-400' : 'bg-gray-700 text-gray-500'}`
                }`}
              >
                <Save className="w-4 h-4" />
                <span>{t('save')}</span>
              </button>
              <button
                onClick={handleCancelAdd}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-200 hover:shadow-md ${themeClasses.border} ${themeClasses.cardHover}`}
              >
                <X className="w-4 h-4" />
                <span>{t('cancel')}</span>
              </button>
            </div>
          </div>
        )}

        {/* Users List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user, index) => (
            <div
              key={user.id}
              className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${themeClasses.card} ${themeClasses.border} ${themeClasses.cardHover}`}
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                  ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500'][index % 5]
                }`}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  {editingId === user.id ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className={`w-full px-2 py-1 rounded border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${themeClasses.input}`}
                      onKeyPress={(e) => e.key === 'Enter' && handleSave(user.id)}
                      autoFocus
                    />
                  ) : (
                    <div className="font-medium">{user.name}</div>
                  )}
                </div>
              </div>

              <div className="flex justify-between text-sm mb-3">
                <span className="text-green-500">{t('present')}: {user.totalPresent}</span>
                <span className="text-red-500">{t('absent')}: {user.totalAbsent}</span>
              </div>

              <div className="flex items-center justify-end space-x-2">
                {editingId === user.id ? (
                  <>
                    <button
                      onClick={() => handleSave(user.id)}
                      className="p-1 rounded transition-colors text-green-600 hover:bg-green-100"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleCancel}
                      className="p-1 rounded transition-colors text-gray-600 hover:bg-gray-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEdit(user)}
                      className={`p-1 rounded transition-colors ${themeClasses.cardHover}`}
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="p-1 rounded transition-colors text-red-500 hover:bg-red-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;