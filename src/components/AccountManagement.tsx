import React, { useState } from 'react';
import { Account } from '../types';
import { Users, Plus, Edit3, Trash2, Save, X, Shield, User } from 'lucide-react';
import { useTranslation } from '../utils/translations';
import { getThemeClasses } from '../utils/themes';

interface AccountManagementProps {
  accounts: Account[];
  currentUser: Account;
  onAccountsChange: (accounts: Account[]) => void;
  language: 'en' | 'pt';
  theme: string;
}

const AccountManagement: React.FC<AccountManagementProps> = ({
  accounts,
  currentUser,
  onAccountsChange,
  language,
  theme
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    role: 'user' as 'admin' | 'user'
  });
  const [error, setError] = useState('');

  const t = useTranslation(language);
  const themeClasses = getThemeClasses(theme);

  const handleSubmit = () => {
    setError('');
    
    if (!formData.username || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 3) {
      setError('Password must be at least 3 characters');
      return;
    }

    // Check if username already exists (except when editing)
    const existingAccount = accounts.find(acc => 
      acc.username === formData.username && acc.id !== editingId
    );
    if (existingAccount) {
      setError('Username already exists');
      return;
    }

    if (editingId) {
      // Update existing account
      const updatedAccounts = accounts.map(account =>
        account.id === editingId
          ? { ...account, username: formData.username, password: formData.password, role: formData.role }
          : account
      );
      onAccountsChange(updatedAccounts);
    } else {
      // Create new account
      const newAccount: Account = {
        id: `account-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        username: formData.username,
        password: formData.password,
        role: formData.role,
        createdAt: new Date().toISOString(),
        createdBy: currentUser.id
      };
      onAccountsChange([...accounts, newAccount]);
    }

    setFormData({ username: '', password: '', confirmPassword: '', role: 'user' });
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (account: Account) => {
    setFormData({
      username: account.username,
      password: account.password,
      confirmPassword: account.password,
      role: account.role
    });
    setEditingId(account.id);
    setShowForm(true);
    setError('');
  };

  const handleDelete = (accountId: string) => {
    if (accountId === currentUser.id) {
      setError('Cannot delete your own account');
      return;
    }
    
    if (confirm('Are you sure you want to delete this account?')) {
      const updatedAccounts = accounts.filter(account => account.id !== accountId);
      onAccountsChange(updatedAccounts);
    }
  };

  const handleCancel = () => {
    setFormData({ username: '', password: '', confirmPassword: '', role: 'user' });
    setShowForm(false);
    setEditingId(null);
    setError('');
  };

  if (currentUser.role !== 'admin') {
    return (
      <div className={`rounded-xl shadow-lg border transition-all duration-300 ${themeClasses.card}`}>
        <div className="p-12 text-center">
          <Shield className={`w-16 h-16 mx-auto mb-4 opacity-50 ${themeClasses.muted}`} />
          <h3 className="text-xl font-semibold mb-2">Access Denied</h3>
          <p className={themeClasses.muted}>
            Only administrators can manage accounts
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
              <Users className="w-6 h-6 mr-2 text-blue-500" />
              {t('accountManagement')}
            </h2>
            <button
              onClick={() => setShowForm(true)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:scale-105 ${themeClasses.button}`}
            >
              <Plus className="w-4 h-4" />
              <span>{t('createAccount')}</span>
            </button>
          </div>

          {/* Create/Edit Form */}
          {showForm && (
            <div className={`mb-6 p-4 rounded-lg border ${themeClasses.card} ${themeClasses.border}`}>
              <h3 className="text-lg font-semibold mb-4">
                {editingId ? t('editAccount') : t('createAccount')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${themeClasses.muted}`}>
                    {t('username')}
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${themeClasses.input}`}
                    placeholder={t('username')}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${themeClasses.muted}`}>
                    {t('role')}
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'user' })}
                    className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${themeClasses.input}`}
                  >
                    <option value="user">{t('user')}</option>
                    <option value="admin">{t('admin')}</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${themeClasses.muted}`}>
                    {t('password')}
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${themeClasses.input}`}
                    placeholder={t('password')}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${themeClasses.muted}`}>
                    {t('confirmPassword')}
                  </label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${themeClasses.input}`}
                    placeholder={t('confirmPassword')}
                  />
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-100 border border-red-300 text-red-700 text-sm">
                  {error}
                </div>
              )}

              <div className="flex items-center space-x-3">
                <button
                  onClick={handleSubmit}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:scale-105 ${themeClasses.button}`}
                >
                  <Save className="w-4 h-4" />
                  <span>{editingId ? t('save') : t('createAccount')}</span>
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
          )}

          {/* Accounts List */}
          <div className="space-y-4">
            {accounts.map((account) => (
              <div
                key={account.id}
                className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${themeClasses.card} ${themeClasses.border}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
                      account.role === 'admin' ? 'bg-red-500' : 'bg-blue-500'
                    }`}>
                      {account.role === 'admin' ? <Shield className="w-5 h-5" /> : <User className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="font-medium">{account.username}</div>
                      <div className={`text-sm ${themeClasses.muted}`}>
                        {t(account.role)} • {t('createdAt')}: {new Date(account.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(account)}
                      className={`p-2 rounded transition-colors ${themeClasses.cardHover}`}
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    {account.id !== currentUser.id && (
                      <button
                        onClick={() => handleDelete(account.id)}
                        className="p-2 rounded transition-colors text-red-500 hover:bg-red-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountManagement;