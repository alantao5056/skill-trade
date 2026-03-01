"use client";

import { usePathname } from "next/navigation";

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hasDock = pathname !== "/";

  return (
    <div className={hasDock ? "pb-28" : ""}>
      {children}
    </div>
  );
}
