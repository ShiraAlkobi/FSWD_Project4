import React, { useReducer, useCallback, useMemo, useState } from "react";

import { keyboardReducer, INITIAL_KB_STATE } from "./state/keyboardReducer.js";
import { textReducer, INITIAL_TEXT_STATE } from "./state/textReducer.js";

import { TextPreview } from "./components/TextPreview.jsx";
import { LanguageRow } from "./components/LanguageRow.jsx";
import { StyleRow } from "./components/StyleRow.jsx";
import { ColorRow } from "./components/ColorRow.jsx";
import { CharacterGrid } from "./components/CharacterGrid.jsx";
import { ActionRow } from "./components/ActionRow.jsx";
import { Separator } from "./components/Key.jsx";

export default function App() {
  const [kbState, kbDispatch] = useReducer(keyboardReducer, INITIAL_KB_STATE);
  const [txtState, txtDispatch] = useReducer(textReducer, INITIAL_TEXT_STATE);

  const [showFind, setShowFind] = useState(false);
  const [showReplace, setShowReplace] = useState(false);

  const [findValue, setFindValue] = useState("");
  const [replaceValue, setReplaceValue] = useState("");

  const [foundIndexes, setFoundIndexes] = useState([]);
  const [currentMatch, setCurrentMatch] = useState(0);

  const currentTypingStyle = useMemo(
    () => ({
      font: kbState.font,
      size: kbState.size,
      bold: kbState.bold,
      italic: kbState.italic,
      underline: kbState.underline,
      color: kbState.color,
    }),
    [
      kbState.font,
      kbState.size,
      kbState.bold,
      kbState.italic,
      kbState.underline,
      kbState.color,
    ]
  );

  const plainText = useMemo(
    () => txtState.content.map((item) => item.char).join(""),
    [txtState.content]
  );

  const handleChar = useCallback(
    (char) => {
      txtDispatch({
        type: "APPEND",
        char,
        style: currentTypingStyle,
      });

      if (kbState.shifted && kbState.language === "en") {
        kbDispatch({ type: "TOGGLE_SHIFT" });
      }
    },
    [currentTypingStyle, kbState.shifted, kbState.language]
  );

  const runFind = useCallback(() => {
    if (!findValue) {
      setFoundIndexes([]);
      setCurrentMatch(0);
      return;
    }

    const indexes = [];
    let start = 0;

    while (true) {
      const idx = plainText.indexOf(findValue, start);
      if (idx === -1) break;
      indexes.push(idx);
      start = idx + 1;
    }

    setFoundIndexes(indexes);
    setCurrentMatch(0);
  }, [findValue, plainText]);

  const nextMatch = useCallback(() => {
    if (foundIndexes.length === 0) return;
    setCurrentMatch((prev) => (prev + 1) % foundIndexes.length);
  }, [foundIndexes]);

  const prevMatch = useCallback(() => {
    if (foundIndexes.length === 0) return;
    setCurrentMatch((prev) => (prev - 1 + foundIndexes.length) % foundIndexes.length);
  }, [foundIndexes]);

  const replaceCurrent = useCallback(() => {
    if (foundIndexes.length === 0 || !findValue) return;

    const index = foundIndexes[currentMatch];

    txtDispatch({
      type: "REPLACE_ONE",
      index,
      findText: findValue,
      replaceText: replaceValue,
      style: currentTypingStyle,
    });

    setTimeout(() => {
      const updatedText = plainText.replace(findValue, replaceValue);
      const indexes = [];
      let start = 0;

      while (true) {
        const idx = updatedText.indexOf(findValue, start);
        if (idx === -1) break;
        indexes.push(idx);
        start = idx + 1;
      }

      setFoundIndexes(indexes);
      setCurrentMatch(0);
    }, 0);
  }, [
    foundIndexes,
    currentMatch,
    findValue,
    replaceValue,
    currentTypingStyle,
    plainText,
  ]);

  const replaceAll = useCallback(() => {
    if (!findValue) return;

    txtDispatch({
      type: "REPLACE_ALL",
      findText: findValue,
      replaceText: replaceValue,
      style: currentTypingStyle,
    });

    setFoundIndexes([]);
    setCurrentMatch(0);
  }, [findValue, replaceValue, currentTypingStyle]);

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', sans-serif",
        maxWidth: 660,
        margin: "0 auto",
        padding: "1rem 0",
      }}
    >
      <TextPreview content={txtState.content} />

      {(showFind || showReplace) && (
        <div
          style={{
            background: "#ffffff",
            border: "1.5px solid #e0ddd6",
            borderRadius: 12,
            padding: 12,
            marginBottom: 10,
          }}
        >
          <div style={{ fontSize: 12, marginBottom: 8, fontWeight: 600 }}>
            {showReplace ? "Replace" : "Find"}
          </div>

          <input
            type="text"
            value={findValue}
            onChange={(e) => setFindValue(e.target.value)}
            placeholder="Find text"
            style={{
              width: "100%",
              padding: "8px 10px",
              borderRadius: 8,
              border: "1px solid #ccc",
              marginBottom: 8,
              boxSizing: "border-box",
            }}
          />

          {showReplace && (
            <input
              type="text"
              value={replaceValue}
              onChange={(e) => setReplaceValue(e.target.value)}
              placeholder="Replace with"
              style={{
                width: "100%",
                padding: "8px 10px",
                borderRadius: 8,
                border: "1px solid #ccc",
                marginBottom: 8,
                boxSizing: "border-box",
              }}
            />
          )}

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button onClick={runFind}>Search</button>
            <button onClick={prevMatch}>Prev</button>
            <button onClick={nextMatch}>Next</button>

            {showReplace && (
              <>
                <button onClick={replaceCurrent}>Replace current</button>
                <button onClick={replaceAll}>Replace all</button>
              </>
            )}

            <button
              onClick={() => {
                setShowFind(false);
                setShowReplace(false);
              }}
            >
              Close
            </button>
          </div>

          <div style={{ marginTop: 8, fontSize: 12, color: "#666" }}>
            {findValue
              ? `Found ${foundIndexes.length} match(es)${
                  foundIndexes.length ? `, current: ${currentMatch + 1}` : ""
                }`
              : "Enter text to search"}
          </div>
        </div>
      )}

      <div
        style={{
          background: "#f8f7f4",
          border: "1.5px solid #e0ddd6",
          borderRadius: 14,
          padding: "12px 14px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <LanguageRow language={kbState.language} dispatch={kbDispatch} />

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
            txtDispatch({
              type: "APPLY_STYLE_TO_ALL",
              style: currentTypingStyle,
            });
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
          onClearAll={() => txtDispatch({ type: "CLEAR" })}
          onUndo={() => txtDispatch({ type: "UNDO" })}
          onFind={() => {
            setShowFind(true);
            setShowReplace(false);
          }}
          onReplace={() => {
            setShowReplace(true);
            setShowFind(false);
          }}
        />
      </div>
    </div>
  );
}