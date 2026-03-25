// ============================================================
//  Key.jsx   (shared UI primitive)
//  The single button component used by EVERY row in the keyboard.
//
//  Props:
//    label      – text shown on the button
//    variant    – color scheme: "default" | "lang" | "special" | "action" | "danger"
//    active     – true = highlighted (e.g. Bold is ON, EN is selected)
//    wide       – slightly wider minimum width
//    flex       – stretches to fill available space (used by space bar)
//    onClick    – callback
//    extraStyle – optional extra inline styles (e.g. fontSize for size buttons)
// ============================================================

import React from "react";

// Color scheme per variant.
// When active=true, the "active" scheme overrides whatever variant is set.
const VARIANT_STYLES = {
  default: { bg: "#ffffff",  border: "#e0ddd6", color: "#1a1a1a" },
  active:  { bg: "#EEEDFE",  border: "#7F77DD", color: "#3C3489" },
  lang:    { bg: "#E6F1FB",  border: "#85B7EB", color: "#185FA5" },
  special: { bg: "#FAECE7",  border: "#F0997B", color: "#993C1D" },
  action:  { bg: "#EAF3DE",  border: "#97C459", color: "#3B6D11" },
  danger:  { bg: "#FCEBEB",  border: "#F09595", color: "#A32D2D" },
};

export function Key({ label, variant = "default", active = false, wide = false, flex = false, onClick, extraStyle = {} }) {
  const scheme = active ? VARIANT_STYLES.active : (VARIANT_STYLES[variant] ?? VARIANT_STYLES.default);

  return (
    <button
      onClick={onClick}
      style={{
        display:        "inline-flex",
        alignItems:     "center",
        justifyContent: "center",
        height:         34,
        minWidth:       wide ? 62 : flex ? undefined : 34,
        flex:           flex ? 1 : undefined,
        padding:        "0 8px",
        borderRadius:   8,
        border:         `1.5px solid ${scheme.border}`,
        background:     scheme.bg,
        color:          scheme.color,
        fontFamily:     "inherit",
        fontSize:       13,
        fontWeight:     active ? 600 : 400,
        cursor:         "pointer",
        userSelect:     "none",
        whiteSpace:     "nowrap",
        transition:     "opacity 0.1s",
        ...extraStyle,
      }}
    >
      {label}
    </button>
  );
}

// ── Small layout helpers used by all rows ──────────────────────

// A thin vertical line between button groups
export function Divider() {
  return (
    <div style={{
      width:      1,
      height:     26,
      background: "#e0ddd6",
      margin:     "0 3px",
      alignSelf:  "center",
    }} />
  );
}

// A full-width horizontal line between rows
export function Separator() {
  return <div style={{ height: 1, background: "#e0ddd6", margin: "7px 0" }} />;
}

// Small uppercase label above each row ("Language", "Style", etc.)
export function RowLabel({ children }) {
  return (
    <div style={{
      fontSize:      10,
      color:         "#aaa",
      textTransform: "uppercase",
      letterSpacing: "0.07em",
      marginBottom:  4,
    }}>
      {children}
    </div>
  );
}
