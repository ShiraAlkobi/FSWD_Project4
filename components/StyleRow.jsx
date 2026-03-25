// ============================================================
//  StyleRow.jsx
//  Font family + font size + Bold / Italic / Underline toggles.
//
//  Props it READS:  font, size, bold, italic, underline
//  Props it FIRES:  dispatch({ type: "SET_FONT" | "SET_SIZE" |
//                              "TOGGLE_BOLD" | "TOGGLE_ITALIC" |
//                              "TOGGLE_UNDERLINE" })
// ============================================================

import React from "react";
import { Key, Divider, RowLabel } from "../ui/Key.jsx";
import { FONT_OPTIONS, SIZE_OPTIONS } from "../../data/keyboardData.js";

export function StyleRow({ font, size, bold, italic, underline, dispatch }) {
  return (
    <div>
      <RowLabel>Style — from cursor</RowLabel>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, alignItems: "center" }}>

        {/* Font family buttons */}
        {FONT_OPTIONS.map(f => (
          <Key
            key={f.id}
            label={f.label}
            active={font === f.id}
            onClick={() => dispatch({ type: "SET_FONT", id: f.id })}
            extraStyle={{ fontFamily: f.css }}
          />
        ))}

        <Divider />

        {/* Font size buttons — each "A" is a different size */}
        {SIZE_OPTIONS.map(s => (
          <Key
            key={s.id}
            label="A"
            active={size === s.id}
            onClick={() => dispatch({ type: "SET_SIZE", id: s.id })}
            extraStyle={{ fontSize: s.px * 0.7 }}
          />
        ))}

        <Divider />

        {/* Bold / Italic / Underline toggles */}
        <Key label="B" active={bold}      onClick={() => dispatch({ type: "TOGGLE_BOLD"      })} extraStyle={{ fontWeight: 700 }} />
        <Key label="I" active={italic}    onClick={() => dispatch({ type: "TOGGLE_ITALIC"    })} extraStyle={{ fontStyle: "italic" }} />
        <Key label="U" active={underline} onClick={() => dispatch({ type: "TOGGLE_UNDERLINE" })} extraStyle={{ textDecoration: "underline" }} />

      </div>
    </div>
  );
}
