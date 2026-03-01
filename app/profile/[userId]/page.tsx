import User from "../User";

type PageProps = {
  params: Promise<{ userId: string }>;
};

export default async function ProfilePage({ params }: PageProps) {
  const { userId } = await params;
  return <User userId={userId} />;
}
