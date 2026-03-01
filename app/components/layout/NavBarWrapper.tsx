"use client";

import { useUser } from "@/context/UserContext";
import NavBar from "@/app/components/layout/NavBar";

export default function NavBarWrapper() {
  const { user, loading } = useUser();
  if (loading || !user) return null;
  return <NavBar />;
}
