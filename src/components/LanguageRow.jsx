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
    <div>
      <RowLabel>Language</RowLabel>

      <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
        {LANGUAGES.map(lang => (
          <Key
            key={lang.id}
            label={lang.label}
            variant="lang"
            active={language === lang.id}          // highlight the active one
            onClick={() => dispatch({ type: "SET_LANGUAGE", id: lang.id })}
          />
        ))}

        <Divider />

        <span style={{ fontSize: 11, color: "#aaa" }}>
          {LANGUAGES.find(l => l.id === language)?.label} active
        </span>
      </div>
    </div>
  );
}
