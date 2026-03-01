"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

export default function SignOutButton({ className }: { className?: string }) {
  const { signOut } = useUser();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.replace("/");
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className={`btn-secondary text-sm px-4 py-2 rounded-lg ${className ?? ""}`}
    >
      Sign Out
    </button>
  );
}
