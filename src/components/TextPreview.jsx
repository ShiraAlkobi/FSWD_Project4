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

import { FONT_OPTIONS } from "../keyboardData.js";
import { SIZE_OPTIONS } from "../keyboardData.js";
import { COLOR_OPTIONS } from "../keyboardData.js";

function getStyle(style) {
  const activeFont = FONT_OPTIONS.find(f => f.id === style.font);
  const activeSize = SIZE_OPTIONS.find(s => s.id === style.size);
  const activeColor = COLOR_OPTIONS.find(c => c.id === style.color);

  return {
    fontFamily: activeFont?.css ?? "sans-serif",
    fontSize: activeSize?.px ?? 16,
    fontWeight: style.bold ? 700 : 400,
    fontStyle: style.italic ? "italic" : "normal",
    textDecoration: style.underline ? "underline" : "none",
    color: activeColor?.hex ?? "#1a1a1a",
    whiteSpace: "pre-wrap",
  };
}

export function TextPreview({ content }) {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1.5px solid #e0ddd6",
        borderRadius: 12,
        padding: "12px 16px",
        marginBottom: 10,
        minHeight: 64,
      }}
    >
      <span
        style={{
          fontSize: 10,
          color: "#aaa",
          textTransform: "uppercase",
          letterSpacing: "0.07em",
        }}
      >
        Preview
      </span>

      <div style={{ minHeight: 32, marginTop: 6, wordBreak: "break-all", whiteSpace: "pre-wrap" }}>
        {content.length > 0 ? (
          content.map((item, index) => (
            <span key={index} style={getStyle(item.style)}>
              {item.char}
            </span>
          ))
        ) : (
          <span style={{ color: "#aaa", fontStyle: "italic", fontSize: 14 }}>
            Start typing…
          </span>
        )}
      </div>
    </div>
  );
}