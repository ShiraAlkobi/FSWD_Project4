// ============================================================
//  TextPreview.jsx
//  Shows the styled text result above the keyboard.
//  Reacts to BOTH keyboard state (style) and text state (content).
//
//  Props it READS:
//    text       – the current string from textReducer
//    font       – font id  (from keyboardReducer)
//    size       – size id
//    bold, italic, underline – booleans
//    color      – color id
//
//  It never dispatches anything — it is purely display.
// ============================================================

import React from "react";
import { FONT_OPTIONS, SIZE_OPTIONS, COLOR_OPTIONS } from "../../data/keyboardData.js";

export function TextPreview({ text, font, size, bold, italic, underline, color }) {
  // Look up the actual CSS values from the data arrays
  const activeFont  = FONT_OPTIONS.find(f => f.id === font);
  const activeSize  = SIZE_OPTIONS.find(s => s.id === size);
  const activeColor = COLOR_OPTIONS.find(c => c.id === color);

  const textStyle = {
    fontFamily:     activeFont?.css   ?? "sans-serif",
    fontSize:       activeSize?.px    ?? 16,
    fontWeight:     bold      ? 700   : 400,
    fontStyle:      italic    ? "italic"    : "normal",
    textDecoration: underline ? "underline" : "none",
    color:          activeColor?.hex  ?? "#1a1a1a",
    minHeight:      32,
    marginTop:      6,
    wordBreak:      "break-all",
    whiteSpace:     "pre-wrap",
  };

  return (
    <div style={{
      background:   "#ffffff",
      border:       "1.5px solid #e0ddd6",
      borderRadius: 12,
      padding:      "12px 16px",
      marginBottom: 10,
      minHeight:    64,
    }}>
      <span style={{ fontSize: 10, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.07em" }}>
        Preview
      </span>

      <div style={textStyle}>
        {text
          ? text
          : <span style={{ color: "#aaa", fontStyle: "italic", fontSize: 14 }}>Start typing…</span>
        }
      </div>
    </div>
  );
}
