import React, { useState } from 'react';
import { Account } from '../types';
import { User, Lock, X, Eye, EyeOff } from 'lucide-react';
import { useTranslation } from '../utils/translations';
import { getThemeClasses } from '../utils/themes';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (username: string, password: string) => boolean;
  language: 'en' | 'pt';
  theme: string;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin, language, theme }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const t = useTranslation(language);
  const themeClasses = getThemeClasses(theme);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }

    const success = onLogin(username, password);
    if (success) {
      setUsername('');
      setPassword('');
      onClose();
    } else {
      setError('Invalid username or password');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`rounded-xl shadow-2xl border max-w-md w-full mx-4 ${themeClasses.card}`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              <Lock className="w-6 h-6 mr-2 text-blue-500" />
              {t('signIn')}
            </h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${themeClasses.cardHover}`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${themeClasses.muted}`}>
                {t('username')}
              </label>
              <div className="relative">
                <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${themeClasses.muted}`} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${themeClasses.input}`}
                  placeholder={t('username')}
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${themeClasses.muted}`}>
                {t('password')}
              </label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${themeClasses.muted}`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-10 pr-12 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${themeClasses.input}`}
                  placeholder={t('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded ${themeClasses.muted}`}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-100 border border-red-300 text-red-700 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className={`w-full py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:scale-105 ${themeClasses.button}`}
            >
              {t('login')}
            </button>
          </form>

          <div className={`mt-6 p-4 rounded-lg border-l-4 border-blue-500 ${theme === 'light' ? 'bg-blue-50' : 'bg-blue-900/20'}`}>
            <h4 className={`font-medium mb-2 ${theme === 'light' ? 'text-blue-800' : 'text-blue-300'}`}>
              💡 Default Admin Credentials:
            </h4>
            <p className={`text-sm ${theme === 'light' ? 'text-blue-700' : 'text-blue-200'}`}>
              Username: <strong>admin</strong><br />
              Password: <strong>admin</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;