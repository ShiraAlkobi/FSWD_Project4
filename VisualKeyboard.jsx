// ============================================================
//  VisualKeyboard.jsx  ← THE CONDUCTOR
//
//  This is the only file that:
//    1. Holds state (via useReducer)
//    2. Knows that all the row components exist
//    3. Passes data DOWN to rows and receives events UP from rows
//
//  The rows themselves are "dumb" — they only know about their
//  own slice of state. VisualKeyboard wires them all together.
//
//  DATA FLOW (the most important thing to understand):
//
//    ┌─────────────────────────────────────────────┐
//    │           VisualKeyboard                    │
//    │   kbState ──────────────────────────────┐   │
//    │   txtState ─────────────────────────┐   │   │
//    │                                     ▼   ▼   │
//    │  [TextPreview]  receives text + all style   │
//    │  [LanguageRow]  receives language + dispatch │
//    │  [StyleRow]     receives font/size/B/I/U     │
//    │  [ColorRow]     receives color + dispatch    │
//    │  [CharacterGrid] receives lang+shift+onChar  │
//    │  [ActionRow]    receives named callbacks     │
//    │                                             │
//    │  User clicks → row fires event UP           │
//    │  → reducer updates state                    │
//    │  → React re-renders only what changed       │
//    └─────────────────────────────────────────────┘
// ============================================================

import React, { useReducer, useCallback } from "react";

import { keyboardReducer, INITIAL_KB_STATE } from "../state/keyboardReducer.js";
import { textReducer,     INITIAL_TEXT_STATE } from "../state/textReducer.js";

import { TextPreview   } from "./rows/TextPreview.jsx";
import { LanguageRow   } from "./rows/LanguageRow.jsx";
import { StyleRow      } from "./rows/StyleRow.jsx";
import { ColorRow      } from "./rows/ColorRow.jsx";
import { CharacterGrid } from "./rows/CharacterGrid.jsx";
import { ActionRow     } from "./rows/ActionRow.jsx";
import { Separator     } from "./ui/Key.jsx";

export default function VisualKeyboard() {
  // ── Two independent state machines ──────────────────────────
  //    kbDispatch  → changes HOW the keyboard is configured
  //    txtDispatch → changes WHAT TEXT has been typed
  const [kbState,  kbDispatch]  = useReducer(keyboardReducer, INITIAL_KB_STATE);
  const [txtState, txtDispatch] = useReducer(textReducer,     INITIAL_TEXT_STATE);

  // ── handleChar: called when user presses a character key ─────
  //  1. Appends the character to the text buffer
  //  2. Auto-releases Shift after typing one uppercase letter
  const handleChar = useCallback((char) => {
    txtDispatch({ type: "APPEND", char });
    if (kbState.shifted && kbState.language === "en") {
      kbDispatch({ type: "TOGGLE_SHIFT" });
    }
  }, [kbState.shifted, kbState.language]);

  // ── Render ───────────────────────────────────────────────────
  return (
    <div style={{
      fontFamily: "'Segoe UI', sans-serif",
      maxWidth:   660,
      margin:     "0 auto",
      padding:    "1rem 0",
    }}>

      {/* Preview sits above the keyboard, always visible */}
      <TextPreview
        text={txtState.text}
        font={kbState.font}
        size={kbState.size}
        bold={kbState.bold}
        italic={kbState.italic}
        underline={kbState.underline}
        color={kbState.color}
      />

      {/* The keyboard panel */}
      <div style={{
        background:    "#f8f7f4",
        border:        "1.5px solid #e0ddd6",
        borderRadius:  14,
        padding:       "12px 14px",
        display:       "flex",
        flexDirection: "column",
      }}>
        {/*
          Each row gets ONLY the state slice it needs.
          None of these rows import from each other.
        */}
        <LanguageRow
          language={kbState.language}
          dispatch={kbDispatch}
        />

        <Separator />

        <StyleRow
          font={kbState.font}
          size={kbState.size}
          bold={kbState.bold}
          italic={kbState.italic}
          underline={kbState.underline}
          dispatch={kbDispatch}
        />

        <Separator />

        <ColorRow
          color={kbState.color}
          dispatch={kbDispatch}
          onApplyAll={() => {
            // Part A: will re-style entire text buffer here
            console.log("Apply color to all — implement in Part A");
          }}
        />

        <Separator />

        <CharacterGrid
          language={kbState.language}
          shifted={kbState.shifted}
          dispatch={kbDispatch}
          onChar={handleChar}
        />

        <Separator />

        <ActionRow
          onDeleteChar={() => txtDispatch({ type: "DELETE_CHAR" })}
          onDeleteWord={() => txtDispatch({ type: "DELETE_WORD" })}
          onClearAll={()   => txtDispatch({ type: "CLEAR"       })}
          onUndo={()       => txtDispatch({ type: "UNDO"        })}
          onFind={()    => alert("Find dialog — add your modal component here")}
          onReplace={() => alert("Replace dialog — add your modal component here")}
        />
      </div>
    </div>
  );
}
