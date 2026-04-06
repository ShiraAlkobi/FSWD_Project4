// ============================================================
//  LanguageRow.jsx
//  Shows the language toggle buttons (EN / עב / 😀 / 123).
//
//  Props it READS:  language (string)
//  Props it FIRES:  dispatch({ type: "SET_LANGUAGE", id })
//
//  It knows nothing about fonts, colors, or text content.
// ============================================================

import { Key, Divider, RowLabel } from "./Key.jsx";
import { LANGUAGES } from "../keyboardData.js";

export function LanguageRow({ language, dispatch }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e0ddd6",
        borderRadius: 10,
        padding: 8,
      }}
    >
      <div style={{ display: "flex", gap: 5, alignItems: "center", flexWrap: "wrap" }}>
        {LANGUAGES.map((lang) => (
          <Key
            key={lang.id}
            label={lang.label}
            variant="lang"
            active={language === lang.id}
            onClick={() => dispatch({ type: "SET_LANGUAGE", id: lang.id })}
          />
        ))}
      </div>
    </div>
  );
}