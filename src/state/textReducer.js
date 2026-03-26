// ============================================================
//  textReducer.js
//  Manages the ACTUAL TEXT CONTENT the user is typing.
//  Completely separate from keyboard config — these two
//  concerns never mix.
//
//  Also owns the undo history stack (last 50 states).
// ============================================================

export const INITIAL_TEXT_STATE = {
  content: [],
  history: [],
};

function cloneContent(content) {
  return content.map(item => ({
    char: item.char,
    style: { ...item.style }
  }));
}

function save(state, newContent) {
  return {
    content: newContent,
    history: [...state.history.slice(-49), cloneContent(state.content)],
  };
}

export function textReducer(state, action) {
  switch (action.type) {
    case "APPEND": {
      const newChar = {
        char: action.char,
        style: { ...action.style },
      };

      return save(state, [...state.content, newChar]);
    }

    case "DELETE_CHAR":
      return save(state, state.content.slice(0, -1));

    case "DELETE_WORD": {
      const content = [...state.content];

      while (content.length > 0 && /\s/.test(content[content.length - 1].char)) {
        content.pop();
      }

      while (content.length > 0 && !/\s/.test(content[content.length - 1].char)) {
        content.pop();
      }

      return save(state, content);
    }

    case "CLEAR":
      return save(state, []);

    case "UNDO":
      if (state.history.length === 0) return state;
      return {
        content: state.history[state.history.length - 1],
        history: state.history.slice(0, -1),
      };

    case "APPLY_STYLE_TO_ALL": {
      const newContent = state.content.map(item => ({
        ...item,
        style: { ...action.style },
      }));

      return save(state, newContent);
    }

    case "REPLACE_ONE": {
      const { index, findText, replaceText, style } = action;

      if (!findText) return state;

      const currentText = state.content.map(item => item.char).join("");
      if (index < 0 || index >= currentText.length) return state;

      const before = state.content.slice(0, index);
      const after = state.content.slice(index + findText.length);

      const replacement = [...replaceText].map(char => ({
      char,
      style: { ...style },
    }));

    return save(state, [...before, ...replacement, ...after]);
  }

    case "REPLACE_ALL": {
      const { findText, replaceText, style } = action;

      if (!findText) return state;

  const currentText = state.content.map(item => item.char).join("");
  if (!currentText.includes(findText)) return state;

  const result = [];
  let i = 0;

  while (i < state.content.length) {
    const sliceText = state.content
      .slice(i, i + findText.length)
      .map(item => item.char)
      .join("");

    if (sliceText === findText) {
      for (const char of replaceText) {
        result.push({
          char,
          style: { ...style },
        });
      }
      i += findText.length;
    } else {
      result.push({
        char: state.content[i].char,
        style: { ...state.content[i].style },
      });
      i += 1;
    }
  }

  return save(state, result);
}

    default:
      return state;
  }
}