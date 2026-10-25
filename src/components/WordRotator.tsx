"use client";

import { useEffect, useState } from "react";

const words = ["sekejap.", "instan.", "kilat.", "santai."];

export function WordRotator() {
  const [index, setIndex] = useState(0);
  const [turning, setTurning] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timeout: ReturnType<typeof setTimeout> | undefined;
    const interval = setInterval(() => {
      setTurning(true);
      timeout = setTimeout(() => {
        setIndex((value) => (value + 1) % words.length);
        setTurning(false);
      }, 500);
    }, 2400);

    return () => {
      clearInterval(interval);
      if (timeout) clearTimeout(timeout);
    };
  }, []);

  return (
    <span className={`rot ${turning ? "turning" : ""}`}>
      <span className="cur">{words[index]}</span>
      <span className="nxt" aria-hidden="true">
        {words[(index + 1) % words.length]}
      </span>
    </span>
  );
}
