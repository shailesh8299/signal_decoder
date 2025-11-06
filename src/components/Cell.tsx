import React from "react";
import type { CellProps } from "../types";

/**
  Cell component
  Supports flashing prop (boolean). When true, the cell gets a 'flashing' class
    which the CSS will animate and display the index larger so the user can see it while showing.
    States: active (rule), selected (user), result (feedback), flashing (blink)
 */
const Cell: React.FC<CellProps> = ({ index, selected, active = false, flashing = false, disabled = false, result, onToggle }) => {
  const handleClick = () => {
    if (disabled) return;
    onToggle(index);
  };

  const className = [
    "sd-cell",
    active ? "active" : "",
    selected ? "selected" : "",
    disabled ? "disabled" : "",
    result ? `result-${result}` : "",
    flashing ? "flashing" : ""
  ].join(" ").trim();

  return (
    <button
      aria-label={`cell-${index}`}
      onClick={handleClick}
      className={className}
      title={`Index ${index}`}
      type="button"
    >
      {/* always render the index, but CSS will enlarge/contrast it when flashing */}
      <span className="cell-label">{index}</span>
    </button>
  );
};

export default Cell;
