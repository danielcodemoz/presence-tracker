export const themes = {
  light: {
    name: 'Light',
    background: 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100',
    text: 'text-gray-900',
    card: 'bg-white/80 backdrop-blur-sm border-gray-200',
    cardHover: 'hover:bg-gray-50/80',
    input: 'bg-white/90 border-gray-300 text-gray-900 placeholder-gray-500',
    button: 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-lg',
    border: 'border-gray-200',
    header: 'bg-white/90 backdrop-blur-md border-gray-200',
    nav: 'border-gray-200 bg-white/50',
    muted: 'text-gray-600',
    accent: 'text-blue-600'
  },
  dark: {
    name: 'Dark',
    background: 'bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800',
    text: 'text-white',
    card: 'bg-gray-800/80 backdrop-blur-sm border-gray-700',
    cardHover: 'hover:bg-gray-700/80',
    input: 'bg-gray-700/90 border-gray-600 text-white placeholder-gray-400',
    button: 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-lg',
    border: 'border-gray-700',
    header: 'bg-gray-800/90 backdrop-blur-md border-gray-700',
    nav: 'border-gray-700 bg-gray-800/50',
    muted: 'text-gray-400',
    accent: 'text-blue-400'
  },
  blue: {
    name: 'Blue',
    background: 'bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-800',
    text: 'text-blue-50',
    card: 'bg-blue-800/60 backdrop-blur-sm border-blue-600/50',
    cardHover: 'hover:bg-blue-700/60',
    input: 'bg-blue-700/60 border-blue-500/50 text-blue-50 placeholder-blue-300',
    button: 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 shadow-lg',
    border: 'border-blue-600/50',
    header: 'bg-blue-800/80 backdrop-blur-md border-blue-600/50',
    nav: 'border-blue-600/50 bg-blue-800/40',
    muted: 'text-blue-300',
    accent: 'text-blue-200'
  },
  green: {
    name: 'Green',
    background: 'bg-gradient-to-br from-emerald-900 via-green-900 to-teal-800',
    text: 'text-emerald-50',
    card: 'bg-emerald-800/60 backdrop-blur-sm border-emerald-600/50',
    cardHover: 'hover:bg-emerald-700/60',
    input: 'bg-emerald-700/60 border-emerald-500/50 text-emerald-50 placeholder-emerald-300',
    button: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 shadow-lg',
    border: 'border-emerald-600/50',
    header: 'bg-emerald-800/80 backdrop-blur-md border-emerald-600/50',
    nav: 'border-emerald-600/50 bg-emerald-800/40',
    muted: 'text-emerald-300',
    accent: 'text-emerald-200'
  },
  purple: {
    name: 'Purple',
    background: 'bg-gradient-to-br from-purple-900 via-violet-900 to-indigo-800',
    text: 'text-purple-50',
    card: 'bg-purple-800/60 backdrop-blur-sm border-purple-600/50',
    cardHover: 'hover:bg-purple-700/60',
    input: 'bg-purple-700/60 border-purple-500/50 text-purple-50 placeholder-purple-300',
    button: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg',
    border: 'border-purple-600/50',
    header: 'bg-purple-800/80 backdrop-blur-md border-purple-600/50',
    nav: 'border-purple-600/50 bg-purple-800/40',
    muted: 'text-purple-300',
    accent: 'text-purple-200'
  }
};

export const getThemeClasses = (theme: string) => {
  return themes[theme as keyof typeof themes] || themes.light;
};