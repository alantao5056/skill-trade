import User from "../User";
import { currentUserId } from "@/lib/dummy-data";

type PageProps = {
  params: Promise<{ userId: string }>;
};

export default async function ProfilePage({ params }: PageProps) {
  const { userId } = await params;
  return <User userId={userId} currentUserId={currentUserId} />;
}
