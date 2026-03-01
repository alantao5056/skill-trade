"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

export default function SignOutButton() {
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
      className="btn-secondary text-sm"
    >
      Sign Out
    </button>
  );
}
