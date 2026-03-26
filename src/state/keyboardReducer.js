// ============================================================
//  keyboardReducer.js
//  Manages HOW THE KEYBOARD IS CONFIGURED:
//  language, shift, font, size, bold, italic, underline, color.
//
//  This is NOT about the text content — that lives in textReducer.
//  Rule: one reducer = one concern.
// ============================================================

export const INITIAL_KB_STATE = {
  language:  "en",
  shifted:   false,
  font:      "sans",
  size:      "md",
  bold:      false,
  italic:    false,
  underline: false,
  color:     "black",
};

// Each case handles exactly one user action.
// dispatch({ type: "SET_FONT", id: "serif" })  ← how callers use this
export function keyboardReducer(state, action) {
  switch (action.type) {
    case "SET_LANGUAGE":
      return { ...state, language: action.id, shifted: false };

    case "TOGGLE_SHIFT":
      return { ...state, shifted: !state.shifted };

    case "SET_FONT":
      return { ...state, font: action.id };

    case "SET_SIZE":
      return { ...state, size: action.id };

    case "TOGGLE_BOLD":
      return { ...state, bold: !state.bold };

    case "TOGGLE_ITALIC":
      return { ...state, italic: !state.italic };

    case "TOGGLE_UNDERLINE":
      return { ...state, underline: !state.underline };

    case "SET_COLOR":
      return { ...state, color: action.id };

    default:
      return state;
  }
}
