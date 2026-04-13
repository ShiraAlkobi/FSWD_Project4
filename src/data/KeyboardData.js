// All static data lives here.
// To add a language, font, size, or color — just add a line to the right array.

export const LANGUAGES = [
  { id: 'en',    label: 'EN'  },
  { id: 'he',    label: 'עב'  },
  { id: 'emoji', label: '😀'  },
  { id: 'num',   label: '123' },
]

export const CHAR_LAYOUTS = {
  en:    [
    ['q','w','e','r','t','y','u','i','o','p'],
    ['a','s','d','f','g','h','j','k','l'],
    ['z','x','c','v','b','n','m'],
  ],
  EN:    [
    ['Q','W','E','R','T','Y','U','I','O','P'],
    ['A','S','D','F','G','H','J','K','L'],
    ['Z','X','C','V','B','N','M'],
  ],
  he:    [
    ['ק','ר','א','ט','ו','ן','ם','פ'],
    ['ש','ד','ג','כ','ע','י','ח','ל','ך','ף'],
    ['ז','ס','ב','ה','נ','מ','צ','ת','ץ'],
  ],
  emoji: [
    ['😀','😂','😍','😎','😭','🤔','😴','🥳'],
    ['👍','👎','🙌','💪','❤️','🔥','✨','💯'],
    ['🎉','🎶','🌈','🍕','🚀','⭐','💡','🏆'],
  ],
  num:   [
    ['1','2','3','4','5','6','7','8','9','0'],
    ['@','#','$','&','*','(',')','-'],
    ['.', ',','?','!','+','=','_','%'],
  ],
}

export const FONTS = [
  { id: 'sans',      label: 'Sans',      css: 'sans-serif'                },
  { id: 'serif',     label: 'Serif',     css: 'Georgia, serif'            },
  { id: 'mono',      label: 'Mono',      css: "'Courier New', monospace"   },
  { id: 'cursive',   label: 'Cursive',   css: "'Brush Script MT', cursive" },
  { id: 'trebuchet', label: 'Trebuchet', css: "'Trebuchet MS', sans-serif" },
]

export const SIZES = [
  { id: 'sm', label: 'A', px: 12 },
  { id: 'md', label: 'A', px: 16 },
  { id: 'lg', label: 'A', px: 22 },
  { id: 'xl', label: 'A', px: 30 },
]

export const COLORS = [
  { id: 'black',      hex: '#1a1a1a' },
  { id: 'dark-gray',  hex: '#4a4a4a' },
  { id: 'gray',       hex: '#7a7a7a' },
  { id: 'light-gray', hex: '#b0b0b0' },
  { id: 'white',      hex: '#ffffff' },

  { id: 'red',        hex: '#d32f2f' },
  { id: 'pink',       hex: '#e91e63' },
  { id: 'purple',     hex: '#7b1fa2' },
  { id: 'blue',       hex: '#1976d2' },
  { id: 'cyan',       hex: '#0097a7' },

  { id: 'teal',       hex: '#00897b' },
  { id: 'green',      hex: '#388e3c' },
  { id: 'lime',       hex: '#7cb342' },
  { id: 'yellow',     hex: '#fbc02d' },
  { id: 'amber',      hex: '#f57f17' },

  { id: 'orange',     hex: '#f57c00' },
  { id: 'brown',      hex: '#5d4037' },
  { id: 'indigo',     hex: '#3f51b5' },
  { id: 'deep-purple',hex: '#512da8' },
  { id: 'deep-orange',hex: '#e64a19' },
]