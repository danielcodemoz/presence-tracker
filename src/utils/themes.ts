export const themes = {
  light: {
    name: 'Light',
    background: 'bg-gradient-to-br from-blue-50 to-indigo-100',
    text: 'text-gray-900',
    card: 'bg-white border-gray-200',
    cardHover: 'hover:bg-gray-50',
    input: 'bg-white border-gray-300 text-gray-900 placeholder-gray-500',
    button: 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700',
    border: 'border-gray-200',
    header: 'bg-white/80 border-gray-200',
    nav: 'border-gray-200',
    muted: 'text-gray-600',
    accent: 'text-blue-600'
  },
  dark: {
    name: 'Dark',
    background: 'bg-gray-900',
    text: 'text-white',
    card: 'bg-gray-800 border-gray-700',
    cardHover: 'hover:bg-gray-700',
    input: 'bg-gray-700 border-gray-600 text-white placeholder-gray-400',
    button: 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700',
    border: 'border-gray-700',
    header: 'bg-gray-800/80 border-gray-700',
    nav: 'border-gray-700',
    muted: 'text-gray-400',
    accent: 'text-blue-400'
  },
  blue: {
    name: 'Blue',
    background: 'bg-gradient-to-br from-blue-900 to-blue-800',
    text: 'text-blue-50',
    card: 'bg-blue-800/50 border-blue-600',
    cardHover: 'hover:bg-blue-700/50',
    input: 'bg-blue-700/50 border-blue-500 text-blue-50 placeholder-blue-300',
    button: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800',
    border: 'border-blue-600',
    header: 'bg-blue-800/80 border-blue-600',
    nav: 'border-blue-600',
    muted: 'text-blue-300',
    accent: 'text-blue-200'
  },
  green: {
    name: 'Green',
    background: 'bg-gradient-to-br from-emerald-900 to-green-800',
    text: 'text-emerald-50',
    card: 'bg-emerald-800/50 border-emerald-600',
    cardHover: 'hover:bg-emerald-700/50',
    input: 'bg-emerald-700/50 border-emerald-500 text-emerald-50 placeholder-emerald-300',
    button: 'bg-gradient-to-r from-emerald-600 to-green-700 text-white hover:from-emerald-700 hover:to-green-800',
    border: 'border-emerald-600',
    header: 'bg-emerald-800/80 border-emerald-600',
    nav: 'border-emerald-600',
    muted: 'text-emerald-300',
    accent: 'text-emerald-200'
  },
  purple: {
    name: 'Purple',
    background: 'bg-gradient-to-br from-purple-900 to-violet-800',
    text: 'text-purple-50',
    card: 'bg-purple-800/50 border-purple-600',
    cardHover: 'hover:bg-purple-700/50',
    input: 'bg-purple-700/50 border-purple-500 text-purple-50 placeholder-purple-300',
    button: 'bg-gradient-to-r from-purple-600 to-violet-700 text-white hover:from-purple-700 hover:to-violet-800',
    border: 'border-purple-600',
    header: 'bg-purple-800/80 border-purple-600',
    nav: 'border-purple-600',
    muted: 'text-purple-300',
    accent: 'text-purple-200'
  }
};

export const getThemeClasses = (theme: string) => {
  return themes[theme as keyof typeof themes] || themes.light;
};