import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDarkMode, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={`
        relative p-2 rounded-lg transition-all duration-300 hover:scale-105
        ${isDarkMode 
          ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }
      `}
      aria-label="Toggle theme"
    >
      <div className="relative w-6 h-6">
        <Sun className={`absolute inset-0 w-6 h-6 transition-opacity duration-300 ${isDarkMode ? 'opacity-0' : 'opacity-100'}`} />
        <Moon className={`absolute inset-0 w-6 h-6 transition-opacity duration-300 ${isDarkMode ? 'opacity-100' : 'opacity-0'}`} />
      </div>
    </button>
  );
};

export default ThemeToggle;