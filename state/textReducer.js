// ============================================================
//  textReducer.js
//  Manages the ACTUAL TEXT CONTENT the user is typing.
//  Completely separate from keyboard config — these two
//  concerns never mix.
//
//  Also owns the undo history stack (last 50 states).
// ============================================================

export const INITIAL_TEXT_STATE = {
  text:    "",
  history: [],   // array of previous `text` strings, oldest first
};

// Helper: saves current text into history, returns new state
function save(state, newText) {
  return {
    text: newText,
    history: [...state.history.slice(-49), state.text],
  };
}

export function textReducer(state, action) {
  switch (action.type) {

    // User pressed a character key
    case "APPEND":
      return save(state, state.text + action.char);

    // ⌫ Char — remove the last character
    case "DELETE_CHAR":
      return save(state, state.text.slice(0, -1));

    // ⌫ Word — remove the last word (everything after the last space)
    case "DELETE_WORD": {
      const trimmed = state.text.trimEnd();
      const lastSpace = trimmed.lastIndexOf(" ");
      const newText = lastSpace === -1 ? "" : trimmed.slice(0, lastSpace + 1);
      return save(state, newText);
    }

    // ✕ Clear — wipe everything (still undoable)
    case "CLEAR":
      return save(state, "");

    // ↩ Undo — pop the top of history stack
    case "UNDO":
      if (state.history.length === 0) return state;
      return {
        text:    state.history[state.history.length - 1],
        history: state.history.slice(0, -1),
      };

    default:
      return state;
  }
}
