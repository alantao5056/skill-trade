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
      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
    >
      Sign out
    </button>
  );
}
