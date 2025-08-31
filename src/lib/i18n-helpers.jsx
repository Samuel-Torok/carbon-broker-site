import React from "react";

// Renders <g>highlighted</g> segments with the gradient style
export function GText({ text }) {
  return text
    .split(/(<g>|<\/g>)/)
    .reduce((acc, part, i, arr) => {
      if (part === "<g>") return acc;
      if (part === "</g>") return acc;
      const isHighlighted = arr[i - 1] === "<g>";
      acc.push(
        isHighlighted
          ? <span key={i} className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400">{part}</span>
          : <span key={i}>{part}</span>
      );
      return acc;
    }, []);
}
