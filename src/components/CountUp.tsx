"use client";

import { useEffect, useState } from "react";

export function CountUp({ to = 9 }: { to?: number }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(to);
      return;
    }

    let current = 0;
    let timeout: ReturnType<typeof setTimeout>;
    const tick = () => {
      current += 1;
      setValue(current);
      if (current < to) timeout = setTimeout(tick, 90);
    };

    timeout = setTimeout(tick, 600);
    return () => clearTimeout(timeout);
  }, [to]);

  return <>{value}</>;
}
