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
  { id: 'sans',  label: 'Sans',  css: 'sans-serif'              },
  { id: 'serif', label: 'Serif', css: 'Georgia, serif'          },
  { id: 'mono',  label: 'Mono',  css: "'Courier New', monospace" },
]

export const SIZES = [
  { id: 'sm', label: 'A', px: 12 },
  { id: 'md', label: 'A', px: 16 },
  { id: 'lg', label: 'A', px: 22 },
  { id: 'xl', label: 'A', px: 30 },
]

export const COLORS = [
  { id: 'black',  hex: '#1a1a1a' },
  { id: 'blue',   hex: '#185FA5' },
  { id: 'green',  hex: '#3B6D11' },
  { id: 'red',    hex: '#993C1D' },
  { id: 'amber',  hex: '#BA7517' },
  { id: 'purple', hex: '#533AB7' },
]