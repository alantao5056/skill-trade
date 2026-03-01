"use client";

import { useUser } from "@/context/UserContext";
import Aurora from "@/app/components/ui/Aurora";

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useUser();
  const isLoggedIn = !loading && !!user;

  return (
    <div className={isLoggedIn ? "pb-28" : ""}>
      {isLoggedIn && (
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
