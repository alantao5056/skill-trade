"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

export default function ProfileIndexPage() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace(`/profile/${user.uid}`);
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="p-6 font-sans">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="p-6 font-sans">
        <p>Please sign in to view your profile.</p>
      </div>
    );
  }

  return <div className="p-6 font-sans">Redirecting…</div>;
}
