// ============================================================
//  keyboardData.js
//  Pure data — no React, no logic, no imports.
//  To add a language: add one object to LANGUAGES + one entry to CHAR_LAYOUTS.
//  To add a font/size/color: add one object to the matching array.
// ============================================================

export const LANGUAGES = [
  { id: "en",    label: "EN",  dir: "ltr" },
  { id: "he",    label: "עב",  dir: "rtl" },
  { id: "emoji", label: "😀",  dir: "ltr" },
  { id: "num",   label: "123", dir: "ltr" },
];

export const CHAR_LAYOUTS = {
  en: [
    ["q","w","e","r","t","y","u","i","o","p"],
    ["a","s","d","f","g","h","j","k","l"],
    ["z","x","c","v","b","n","m"],
  ],
  EN: [   // shifted English
    ["Q","W","E","R","T","Y","U","I","O","P"],
    ["A","S","D","F","G","H","J","K","L"],
    ["Z","X","C","V","B","N","M"],
  ],
  he: [
    ["ק","ר","א","ט","ו","ן","ם","פ"],
    ["ש","ד","ג","כ","ע","י","ח","ל","ך","ף"],
    ["ז","ס","ב","ה","נ","מ","צ","ת","ץ"],
  ],
  emoji: [
    ["😀","😂","😍","🥹","😎","😭","🤔","😴"],
    ["👍","👎","🙌","💪","🫶","❤️","🔥","✨"],
    ["🎉","🎶","🌈","🍕","🚀","⭐","💡","🏆"],
  ],
  num: [
    ["1","2","3","4","5","6","7","8","9","0"],
    ["@","#","$","&","*","(",")","%"],
    [".","," ,"?","!","-","+","=","_"],
  ],
};

export const FONT_OPTIONS = [
  { id: "sans",  label: "Sans",  css: "'Segoe UI', sans-serif"    },
  { id: "serif", label: "Serif", css: "Georgia, serif"             },
  { id: "mono",  label: "Mono",  css: "'Courier New', monospace"   },
];

export const SIZE_OPTIONS = [
  { id: "sm", label: "A", px: 12 },
  { id: "md", label: "A", px: 16 },
  { id: "lg", label: "A", px: 22 },
  { id: "xl", label: "A", px: 30 },
];

export const COLOR_OPTIONS = [
  { id: "black",  hex: "#1a1a1a" },
  { id: "blue",   hex: "#185FA5" },
  { id: "green",  hex: "#3B6D11" },
  { id: "red",    hex: "#993C1D" },
  { id: "amber",  hex: "#BA7517" },
  { id: "purple", hex: "#533AB7" },
];
