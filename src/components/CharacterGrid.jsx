// ============================================================
//  CharacterGrid.jsx
//  The main character rows (3 rows of letters/emoji/numbers)
//  plus the bottom row: Shift, Space, Enter.
//
//  Props it READS:  language, shifted
//  Props it FIRES:  dispatch({ type: "TOGGLE_SHIFT" })
//                   onChar(char)  ← sends the typed character UP to the parent
//
//  This component does NOT touch the text directly.
//  It just says "the user pressed X" and the parent handles it.
// ============================================================

import { Key, Divider, RowLabel } from "./Key.jsx";
import { CHAR_LAYOUTS } from "../keyboardData.js";

export function CharacterGrid({ language, shifted, dispatch, onChar }) {
  // Pick the right layout:
  //   - English + shift  → use the "EN" (uppercase) layout
  //   - anything else    → use the language id directly
  const layoutKey = (language === "en" && shifted) ? "EN" : language;
  const rows = CHAR_LAYOUTS[layoutKey] ?? CHAR_LAYOUTS["en"];

  return (
    <div>
      <RowLabel>Characters</RowLabel>

      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>

        {/* The 3 character rows */}
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            style={{ display: "flex", gap: 5, justifyContent: "center", flexWrap: "wrap" }}
          >
            {row.map((char, charIndex) => (
              <Key
                key={charIndex}
                label={char}
                onClick={() => onChar(char)}   // fire the char up to the parent
              />
            ))}
          </div>
        ))}

        {/* Bottom row: Shift / Space / Enter */}
        <div style={{ display: "flex", gap: 5, marginTop: 2 }}>
          {language === "en" && (
            <Key
              label="⇧ Shift"
              variant={shifted ? "default" : "special"}
              active={shifted}
              wide
              onClick={() => dispatch({ type: "TOGGLE_SHIFT" })}
            />
          )}
          <Key label="space" flex onClick={() => onChar(" ")} />
          <Key label="↵"     wide  variant="special" onClick={() => onChar("\n")} />
        </div>

      </div>
    </div>
  );
}
