"use client";

import React, { useEffect, useRef, useState } from "react";
import Ribbons from "./Ribbons";

type RibbonsWrapperProps = React.ComponentProps<typeof Ribbons>;

export default function RibbonsWrapper(props: RibbonsWrapperProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [hasSize, setHasSize] = useState(false);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const checkSize = () => {
      if (el.offsetWidth > 0 && el.offsetHeight > 0) {
        setHasSize(true);
      }
    };

    // Check immediately and after layout (rAF runs after paint)
    checkSize();
    const rafId = requestAnimationFrame(() => {
      checkSize();
      requestAnimationFrame(checkSize);
    });
    const ro = new ResizeObserver(checkSize);
    ro.observe(el);
    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, []);

  return (
    <div ref={wrapperRef} className="absolute inset-0 w-full h-full min-h-screen">
      {hasSize && <Ribbons {...props} />}
    </div>
  );
}
