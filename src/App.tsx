import React from "react";
import Grid from "./components/Grid";
import ThemeToggle from "./components/ThemeToggle";
import "./styles/grid.css";

const App: React.FC = () => {
  return (
    <div style={{ padding: 20, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h1 style={{ margin: 0, display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 28 }}>🧠</span>
        <span style={{ fontSize: 42 }}>Signal Decoder</span>
        {/* Theme toggle to the right of the title */}
        <span style={{ marginLeft: 16 }}>
          <ThemeToggle />
        </span>
      </h1>

      <p style={{ marginTop: 12 }}>Watch patterns, remember them, and select squares.</p>

      <Grid />
    </div>
  );
};

export default App;
