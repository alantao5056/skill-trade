"use client";

import { useUser } from "@/context/UserContext";
import Landing from "@/app/components/landing/Landing";
import Dashboard from "@/app/components/dashboard/Dashboard";

export default function Home() {
  const { user, loading } = useUser();

  if (loading) return null;

  if (!user) return <Landing />;

  return <Dashboard />;
}
