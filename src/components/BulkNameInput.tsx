import React, { useState } from 'react';
import { UserPlus, Upload, X, Check } from 'lucide-react';
import { useTranslation } from '../utils/translations';
import { getThemeClasses } from '../utils/themes';

interface BulkNameInputProps {
  onSubmit: (names: string[]) => void;
  language: 'en' | 'pt';
  theme: string;
}

const BulkNameInput: React.FC<BulkNameInputProps> = ({ onSubmit, language, theme }) => {
  const [input, setInput] = useState('');
  const [preview, setPreview] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const t = useTranslation(language);
  const themeClasses = getThemeClasses(theme);

  const parseNames = (text: string): string[] => {
    return text
      .split(/[\n,;]+/)
      .map(name => name.trim())
      .filter(name => name.length > 0)
      .filter((name, index, arr) => arr.indexOf(name) === index); // Remove duplicates
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    const names = parseNames(value);
    setPreview(names);
    setShowPreview(names.length > 0);
  };

  const handleSubmit = () => {
    if (preview.length > 0) {
      onSubmit(preview);
      setInput('');
      setPreview([]);
      setShowPreview(false);
    }
  };

  const handleClear = () => {
    setInput('');
    setPreview([]);
    setShowPreview(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        handleInputChange(content);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center">
              <UserPlus className="w-5 h-5 mr-2 text-blue-500" />
              {t('addUsers')}
            </h3>
            <label className={`cursor-pointer flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all hover:shadow-md ${themeClasses.card} ${themeClasses.border} ${themeClasses.cardHover}`}>
              <Upload className="w-4 h-4" />
              <span className="text-sm">{t('uploadFile')}</span>
              <input
                type="file"
                accept=".txt"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          <div className="space-y-2">
            <label className={`block text-sm font-medium ${themeClasses.muted}`}>
              {t('enterNames')}
            </label>
            <textarea
              value={input}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="John Doe&#10;Jane Smith&#10;Mike Johnson&#10;&#10;Or paste a list separated by commas..."
              rows={8}
              className={`w-full px-4 py-3 rounded-lg border resize-none transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${themeClasses.input}`}
            />
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleSubmit}
              disabled={preview.length === 0}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                preview.length > 0
                  ? `${themeClasses.button} hover:shadow-lg hover:scale-105`
                  : `cursor-not-allowed ${theme === 'light' ? 'bg-gray-200 text-gray-400' : 'bg-gray-700 text-gray-500'}`
              }`}
            >
              <Check className="w-4 h-4" />
              <span>{t('addUser')} {preview.length} {t('users')}{preview.length !== 1 ? 's' : ''}</span>
            </button>
            
            {input && (
              <button
                onClick={handleClear}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg border transition-all duration-200 hover:shadow-md ${themeClasses.border} ${themeClasses.cardHover}`}
              >
                <X className="w-4 h-4" />
                <span>{t('clear')}</span>
              </button>
            )}
          </div>
        </div>

        {/* Preview Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            {t('preview')} {preview.length > 0 && `(${preview.length} ${t('users')})`}
          </h3>
          
          <div className={`min-h-[200px] p-4 rounded-lg border transition-all duration-300 ${themeClasses.card} ${themeClasses.border}`}>
            {preview.length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {preview.map((name, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${themeClasses.card} shadow-sm`}
                  >
                    <span className="font-medium">{name}</span>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`flex flex-col items-center justify-center h-full ${themeClasses.muted}`}>
                <UserPlus className="w-12 h-12 mb-2 opacity-50" />
                <p>{t('namesWillAppear')}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Usage Instructions */}
      <div className={`p-4 rounded-lg border-l-4 border-blue-500 ${theme === 'light' ? 'bg-blue-50' : 'bg-blue-900/20'}`}>
        <h4 className={`font-medium mb-2 ${theme === 'light' ? 'text-blue-800' : 'text-blue-300'}`}>
          💡 {t('tipsForBulkInput')}
        </h4>
        <ul className={`text-sm space-y-1 ${theme === 'light' ? 'text-blue-700' : 'text-blue-200'}`}>
          <li>• {t('oneNamePerLine')}</li>
          <li>• {t('separateWithCommas')}</li>
          <li>• {t('uploadTextFile')}</li>
          <li>• {t('duplicatesRemoved')}</li>
        </ul>
      </div>
    </div>
  );
};

export default BulkNameInput;