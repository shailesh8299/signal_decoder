import React, { useEffect, useMemo, useRef, useState } from "react";
import Cell from "./Cell";
import "../styles/grid.css";
import { getLevelIndices } from "../logic/levelRules";
import type { ResultState } from "../types";


const GRID_SIZE = 5;
const TOTAL = GRID_SIZE * GRID_SIZE;

const SHOW_DURATION = 10_000; // 10s show
const FLASH_INTERVAL = 600;
const WIN_DELAY = 1400;

type Mode = "idle" | "showing" | "selection" | "result";

const Grid: React.FC = () => {
  const [selectedSet, setSelectedSet] = useState<Set<number>>(new Set());
  const [level, setLevel] = useState<number>(1);
  const [resultMap, setResultMap] = useState<Record<number, ResultState>>({});
  const [flashOn, setFlashOn] = useState<boolean>(false);
  const [mode, setMode] = useState<Mode>("idle"); // start idle (user presses Start Game)

  const flashIntervalRef = useRef<number | null>(null);
  const showTimeoutRef = useRef<number | null>(null);
  const winTimeoutRef = useRef<number | null>(null);

  const activeSet = useMemo(() => getLevelIndices(level), [level]);

  // toggle selection (only in selection mode)
  const toggleCell = (index: number) => {
    if (mode !== "selection") return;
    setSelectedSet(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  // start showing (called when user presses Start Game or when moving to new level via Next Level)
  const startShowing = () => {
    // clear any previous timers
    if (flashIntervalRef.current) {
      window.clearInterval(flashIntervalRef.current);
      flashIntervalRef.current = null;
    }
    if (showTimeoutRef.current) {
      window.clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = null;
    }
    if (winTimeoutRef.current) {
      window.clearTimeout(winTimeoutRef.current);
      winTimeoutRef.current = null;
    }

    // reset state for the level
    setResultMap({});
    setSelectedSet(new Set());
    setMode("showing");
    setFlashOn(true);

    // start interval to toggle flashOn
    const fid = window.setInterval(() => setFlashOn(prev => !prev), FLASH_INTERVAL);
    flashIntervalRef.current = fid;

    // after SHOW_DURATION, stop flashing and allow selection
    const sid = window.setTimeout(() => {
      if (flashIntervalRef.current) {
        window.clearInterval(flashIntervalRef.current);
        flashIntervalRef.current = null;
      }
      setFlashOn(false);
      setMode("selection");
    }, SHOW_DURATION);
    showTimeoutRef.current = sid;
  };

  // effect: if level changes while we are not idle, restart showing automatically
  useEffect(() => {
    // If we're currently idle, don't auto-start
    if (mode === "idle") return;

    // start showing automatically when level changes (unless we are idle)
    startShowing();

    return () => {
      if (flashIntervalRef.current) {
        window.clearInterval(flashIntervalRef.current);
        flashIntervalRef.current = null;
      }
      if (showTimeoutRef.current) {
        window.clearTimeout(showTimeoutRef.current);
        showTimeoutRef.current = null;
      }
      if (winTimeoutRef.current) {
        window.clearTimeout(winTimeoutRef.current);
        winTimeoutRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level]);

  // helpers
  const isSelected = (i: number) => selectedSet.has(i);
  const isActive = (i: number) => activeSet.has(i);

  // checking answer
  const checkAnswer = () => {
    if (mode === "showing" || mode === "idle") return;

    const newResult: Record<number, ResultState> = {};

    for (const idx of selectedSet) {
      newResult[idx] = activeSet.has(idx) ? "correct" : "wrong";
    }
    for (const idx of activeSet) {
      if (!selectedSet.has(idx)) newResult[idx] = "missed";
    }

    setResultMap(newResult);
    setMode("result");

    const wrongCount = Object.values(newResult).filter(r => r === "wrong").length;
    const missedCount = Object.values(newResult).filter(r => r === "missed").length;

    // Only auto-advance when the user actually selected something and there are no wrong/missed.
    if (wrongCount === 0 && missedCount === 0 && selectedSet.size > 0) {
      const id = window.setTimeout(() => {
        setLevel(prev => (prev >= 5 ? 1 : prev + 1));
        // startShowing will run due to level effect (unless mode was idle)
      }, WIN_DELAY);
      winTimeoutRef.current = id;
    }
  };

  const nextLevel = () => {
    // clear timers
    if (flashIntervalRef.current) {
      window.clearInterval(flashIntervalRef.current);
      flashIntervalRef.current = null;
    }
    if (showTimeoutRef.current) {
      window.clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = null;
    }
    if (winTimeoutRef.current) {
      window.clearTimeout(winTimeoutRef.current);
      winTimeoutRef.current = null;
    }
    setLevel(prev => (prev >= 5 ? 1 : prev + 1));
    // startShowing will be invoked by effect above since mode !== 'idle' (we'll set to showing below)
    startShowing();
  };

  const resetAll = () => {
    if (flashIntervalRef.current) {
      window.clearInterval(flashIntervalRef.current);
      flashIntervalRef.current = null;
    }
    if (showTimeoutRef.current) {
      window.clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = null;
    }
    if (winTimeoutRef.current) {
      window.clearTimeout(winTimeoutRef.current);
      winTimeoutRef.current = null;
    }
    setSelectedSet(new Set());
    setResultMap({});
    setMode("idle");
    setFlashOn(false);
  };

  // cleanup on unmount
  useEffect(() => {
    return () => {
      if (flashIntervalRef.current) window.clearInterval(flashIntervalRef.current);
      if (showTimeoutRef.current) window.clearTimeout(showTimeoutRef.current);
      if (winTimeoutRef.current) window.clearTimeout(winTimeoutRef.current);
    };
  }, []);

  // result summaries
  const correctCount = Object.values(resultMap).filter(r => r === "correct").length;
  const wrongCount = Object.values(resultMap).filter(r => r === "wrong").length;
  const missedCount = Object.values(resultMap).filter(r => r === "missed").length;

  return (
    <div className="sd-grid-wrapper">
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <label style={{ fontWeight: 700 }}>Level:</label>
          <select
            value={level}
            onChange={(e) => {
              setLevel(Number(e.target.value));
              // if user manually changes level, start showing immediately
              if (mode !== "idle") {
                startShowing();
              }
            }}
            disabled={mode === "showing"} // don't allow changing while showing
            aria-label="Select level"
          >
            <option value={1}>1 — Even indices</option>
            <option value={2}>2 — Diagonals</option>
            <option value={3}>3 — Prime indices</option>
            <option value={4}>4 — Center cluster</option>
            <option value={5}>5 — (row+col) % 3 === 0</option>
          </select>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          {mode === "idle" ? (
            <button className="control-button" onClick={() => startShowing()}>Start Game</button>
          ) : (
            <button
              className="control-button"
              onClick={() => {
                // if showing currently, allow user to stop early and go to selection
                if (mode === "showing") {
                  if (flashIntervalRef.current) {
                    window.clearInterval(flashIntervalRef.current);
                    flashIntervalRef.current = null;
                  }
                  if (showTimeoutRef.current) {
                    window.clearTimeout(showTimeoutRef.current);
                    showTimeoutRef.current = null;
                  }
                  setFlashOn(false);
                  setMode("selection");
                } else {
                  // replay the pattern
                  startShowing();
                }
              }}
            >
              {mode === "showing" ? "Stop and Select Early" : "Replay pattern"}
            </button>
          )}

          <button
            className="control-button"
            onClick={() => {
              setSelectedSet(new Set());
              setResultMap({});
            }}
            disabled={mode === "showing" || mode === "idle"}
          >
            Clear selections
          </button>

          <button
            className="control-button"
            onClick={checkAnswer}
            disabled={mode === "showing" || mode === "idle" || mode === "result"}
          >
            Check Answer
          </button>

          <button className="control-button" onClick={nextLevel}>Next Level</button>

          <button className="control-button" onClick={resetAll}>Reset Game</button>
        </div>
      </div>

      {/* Grid */}
      <div className="sd-grid" role="grid" style={{ "--n": GRID_SIZE } as React.CSSProperties}>
            {Array.from({ length: TOTAL }).map((_, i) => {
  // whether this index is part of the rule (always true for rule indices)
  const ruleActive = isActive(i);

  // should the cell visually flash right now?
  // only when showing and flashOn toggles
  const flashing = mode === "showing" && ruleActive && flashOn;

  // We only want the yellow "active" highlight visible while the game is SHOWING the pattern.
  // After showing ends (selection mode) we hide the yellow so the user must remember.

  const visibleActive = mode === "showing" ? ruleActive : false;

  // disable clicks while showing or when idle
  const disabled = mode === "showing" || mode === "idle";

  return (
    <Cell
      key={i}
      index={i}
      selected={isSelected(i)}
      active={visibleActive}     // show yellow only during the showing phase
      flashing={flashing}        // class that runs animation only during flashOn
      disabled={disabled}
      result={resultMap[i]}
      onToggle={toggleCell}
    />
  );
})}


      </div>

      {/* Info */}
      <div style={{ marginTop: 12 }}>
        <div><strong>Phase:</strong> {mode === "idle" ? "Idle (press Start)" : mode === "showing" ? "Showing (watch the flash)" : mode === "selection" ? "Selection (pick squares)" : "Result (feedback)"} </div>
        <div style={{ marginTop: 6 }}><strong>Active indices (rule):</strong> {Array.from(activeSet).sort((a,b)=>a-b).join(", ") || "—"}</div>
        <div style={{ marginTop: 6 }}><strong>Your selections:</strong> {Array.from(selectedSet).sort((a,b)=>a-b).join(", ") || "—"}</div>

        {mode === "result" && (
          <div style={{ marginTop: 8 }}>
            <strong>Results:</strong>{" "}
            <span>✅ {correctCount}</span>{" "}
            <span style={{ marginLeft: 8 }}>❌ {wrongCount}</span>{" "}
            <span style={{ marginLeft: 8 }}>ℹ️ missed {missedCount}</span>
            <p style={{ marginTop: 6, fontStyle: "italic", color: "#444" }}>
              Green = correct pick, Red = incorrect pick, Outlined = active but missed.
            </p>
          </div>
        )}

        {mode === "showing" && (
          <p style={{ marginTop: 8, fontStyle: "italic", color: "#666" }}>
            Watch carefully — the pattern will flash for a few seconds and then you'll be able to select squares.
          </p>
        )}
      </div>
    </div>
  );
};

export default Grid;
