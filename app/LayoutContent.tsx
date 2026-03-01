"use client";

import { usePathname } from "next/navigation";
import Aurora from "@/app/Aurora";

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hasDock = pathname !== "/";
  const showAurora = pathname !== "/";

  return (
    <div className={hasDock ? "pb-28" : ""}>
      {showAurora && (
        <div
          className="fixed inset-0 overflow-hidden pointer-events-none -z-10"
          aria-hidden
        >
          <Aurora
            colorStops={["#ed995f", "#9cd6d1", "#88d1cd"]}
            amplitude={0.6}
            blend={0.4}
          />
        </div>
      )}
      {children}
    </div>
  );
}
