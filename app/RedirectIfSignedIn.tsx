"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/context/UserContext";

export default function RedirectIfSignedIn({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (user && pathname === "/") {
      router.replace("/dashboard");
    }
  }, [user, loading, pathname, router]);

  return <>{children}</>;
}
