// ============================================================
//  ActionRow.jsx
//  Delete operations + Undo + Find + Replace.
//
//  This row fires NAMED callbacks (not dispatch) because each
//  button does something fundamentally different:
//    - delete/undo  → modify the text buffer (textReducer)
//    - find/replace → open a UI dialog (local UI state)
//  Using named callbacks keeps ActionRow decoupled from both.
//
//  Props (all callbacks):
//    onDeleteChar  — remove last character
//    onDeleteWord  — remove last word
//    onClearAll    — wipe entire text
//    onUndo        — restore previous text state
//    onFind        — open find dialog
//    onReplace     — open replace dialog
// ============================================================

import React from "react";
import { Key, Divider, RowLabel } from "../ui/Key.jsx";

export function ActionRow({ onDeleteChar, onDeleteWord, onClearAll, onUndo, onFind, onReplace }) {
  return (
    <div>
      <RowLabel>Actions</RowLabel>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, alignItems: "center" }}>

        {/* Destructive actions — red */}
        <Key label="⌫ Char"  variant="danger" onClick={onDeleteChar} />
        <Key label="⌫ Word"  variant="danger" onClick={onDeleteWord} />
        <Key label="✕ Clear" variant="danger" onClick={onClearAll}   />

        <Divider />

        {/* History + search — green */}
        <Key label="↩ Undo"    variant="action" wide onClick={onUndo}    />
        <Key label="🔍 Find"   variant="action"      onClick={onFind}    />
        <Key label="⇄ Replace" variant="action"      onClick={onReplace} />

      </div>
    </div>
  );
}
