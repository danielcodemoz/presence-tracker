import React from 'react';
import { AppSettings } from '../types';
import { Settings as SettingsIcon, FileText } from 'lucide-react';
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
                {language === 'en' ? 'This title will appear on PDF reports' : 'Este título aparecerá nos relatórios PDF'}
              </p>
            </div>

            {/* Info about navbar controls */}
            <div className={`p-4 rounded-lg border-l-4 border-blue-500 ${
              theme === 'light' ? 'bg-blue-50' : 'bg-blue-900/20'
            }`}>
              <h4 className={`font-medium mb-2 ${theme === 'light' ? 'text-blue-800' : 'text-blue-300'}`}>
                💡 {language === 'en' ? 'Quick Access:' : 'Acesso Rápido:'}
              </h4>
              <ul className={`text-sm space-y-1 ${theme === 'light' ? 'text-blue-700' : 'text-blue-200'}`}>
                <li>• {language === 'en' ? 'Language and theme settings are now available in the top navigation bar' : 'Configurações de idioma e tema estão agora disponíveis na barra de navegação superior'}</li>
                <li>• {language === 'en' ? 'Look for the globe (🌐) and palette (🎨) icons in the header' : 'Procure pelos ícones de globo (🌐) e paleta (🎨) no cabeçalho'}</li>
              </ul>
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