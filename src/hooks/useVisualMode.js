import { useState } from "react";

export default function useVisualMode(initial) {
  const [history, setHistory] = useState([initial]);

  // Transition
  function transition(newMode, bool = false) {
    if (bool) {
      setHistory(prev => ([...prev.slice(0, -1)]))
    }
    setHistory(prev => ([...prev, newMode]));
  }


  // Back
  function back() {
    if (history.length <= 1) {
      return;
    } else {
      setHistory(prev => ([...prev.slice(0, -1)]));
    }
  }

  // Setting mode as the lest element in history
  const mode = history[history.length - 1];

  // Returning state, two functions
  return {
    mode,
    transition,
    back
  };
}