import React from 'react';
import { AppSettings } from '../types';
import { Settings as SettingsIcon, Globe, Palette, FileText } from 'lucide-react';
import { useTranslation } from '../utils/translations';
import { getThemeClasses } from '../utils/themes';

interface SettingsProps {
  settings: AppSettings;
  onSettingsChange: (settings: AppSettings) => void;
  language: 'en' | 'pt';
  theme: string;
}

const Settings: React.FC<SettingsProps> = ({ settings, onSettingsChange, language, theme }) => {
  const t = useTranslation(language);
  const themeClasses = getThemeClasses(theme);

  const handleChange = (key: keyof AppSettings, value: any) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  const themes = [
    { value: 'light', label: t('light') },
    { value: 'dark', label: t('dark') },
    { value: 'blue', label: t('blue') },
    { value: 'green', label: t('green') },
    { value: 'purple', label: t('purple') }
  ];

  const languages = [
    { value: 'en', label: t('english') },
    { value: 'pt', label: t('portuguese') }
  ];

  return (
    <div className="space-y-6">
      <div className={`rounded-xl shadow-lg border transition-all duration-300 ${themeClasses.card}`}>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <SettingsIcon className="w-6 h-6 mr-2 text-blue-500" />
            {t('settings')}
          </h2>

          <div className="space-y-6">
            {/* Report Title */}
            <div>
              <label className={`block text-sm font-medium mb-2 flex items-center ${themeClasses.muted}`}>
                <FileText className="w-4 h-4 mr-2" />
                {t('reportTitle')}
              </label>
              <input
                type="text"
                value={settings.reportTitle}
                onChange={(e) => handleChange('reportTitle', e.target.value)}
                placeholder="e.g., School Name, Institution Name"
                className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${themeClasses.input}`}
              />
              <p className={`text-sm mt-1 ${themeClasses.muted}`}>
                This title will appear on PDF reports
              </p>
            </div>

            {/* Language */}
            <div>
              <label className={`block text-sm font-medium mb-2 flex items-center ${themeClasses.muted}`}>
                <Globe className="w-4 h-4 mr-2" />
                {t('language')}
              </label>
              <select
                value={settings.language}
                onChange={(e) => handleChange('language', e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${themeClasses.input}`}
              >
                {languages.map(lang => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Theme */}
            <div>
              <label className={`block text-sm font-medium mb-2 flex items-center ${themeClasses.muted}`}>
                <Palette className="w-4 h-4 mr-2" />
                {t('theme')}
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {themes.map(themeOption => (
                  <button
                    key={themeOption.value}
                    onClick={() => handleChange('theme', themeOption.value)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                      settings.theme === themeOption.value
                        ? 'border-blue-500 bg-blue-50'
                        : `border-gray-300 ${themeClasses.cardHover}`
                    }`}
                  >
                    <div className={`w-full h-8 rounded mb-2 ${
                      themeOption.value === 'light' ? 'bg-gradient-to-r from-blue-50 to-indigo-100' :
                      themeOption.value === 'dark' ? 'bg-gray-900' :
                      themeOption.value === 'blue' ? 'bg-gradient-to-r from-blue-900 to-blue-800' :
                      themeOption.value === 'green' ? 'bg-gradient-to-r from-emerald-900 to-green-800' :
                      'bg-gradient-to-r from-purple-900 to-violet-800'
                    }`}></div>
                    <div className="text-sm font-medium">{themeOption.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className={`mt-6 p-4 rounded-lg border ${themeClasses.border}`}>
            <h4 className="font-medium mb-2">{language === 'en' ? 'Preview' : 'Visualização'}</h4>
            <div className={`p-3 rounded border ${themeClasses.card}`}>
              <div className="text-lg font-bold mb-1">{settings.reportTitle || 'Sample Report Title'}</div>
              <div className={`text-sm ${themeClasses.muted}`}>
                {language === 'en' ? 'Presence/Absence Report' : 'Relatório de Presença/Ausência'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;