import { redirect } from "next/navigation";
import { currentUserId } from "@/lib/dummy-data";

export default function ProfileIndexPage() {
  redirect(`/profile/${currentUserId}`);
}
