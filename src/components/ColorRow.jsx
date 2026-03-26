// ============================================================
//  ColorRow.jsx
//  Color swatches + "Apply to all" button.
//
//  Props it READS:  color (string id)
//  Props it FIRES:  dispatch({ type: "SET_COLOR", id })
//                   onApplyAll() — hook for Part A: re-style entire text buffer
// ============================================================

import { Key, Divider, RowLabel } from "./Key.jsx";
import {COLOR_OPTIONS} from "../keyboardData.js";


export function ColorRow({ color, dispatch, onApplyAll }) {
  return (
    <div>
      <RowLabel>Color</RowLabel>

      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>

        {COLOR_OPTIONS.map(c => (
          <button
            key={c.id}
            title={c.id}
            onClick={() => dispatch({ type: "SET_COLOR", id: c.id })}
            style={{
              width:      26,
              height:     26,
              borderRadius: "50%",
              background: c.hex,
              cursor:     "pointer",
              border:     color === c.id ? "3px solid #7F77DD"   : "2px solid transparent",
              outline:    color === c.id ? `2px solid ${c.hex}55` : "none",
              transition: "all 0.12s",
            }}
          />
        ))}

        <Divider />

        {/* Applies the current color to the entire text buffer — wired in App */}
        <Key
          label="Apply to all"
          variant="special"
          wide
          onClick={onApplyAll}
        />
      </div>
    </div>
  );
}
