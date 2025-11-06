export type Index = number;

export type ResultState = "correct" | "wrong" | "missed" | undefined;

// Props expected by each Cell component
export interface CellProps {
  index: Index;                      // unique position of this cell in the grid
  selected: boolean;                 // whether the user has toggled it on (user selection)
  active?: boolean;                  // whether this cell is part of the current level's rule (rule-driven)
  flashing?: boolean;                // should visually flash (blinking) right now
  disabled?: boolean;                // optional flag to prevent interaction
  result?: ResultState;              // visual result after checking the answer
  onToggle: (index: Index) => void;  // callback to toggle selection
}
