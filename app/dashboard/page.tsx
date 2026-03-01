import SignOutButton from "../SignOutButton";

export default function DashboardPage() {
  return (
    <main className="font-sans min-h-screen p-6">
      <div className="flex justify-end">
        <SignOutButton />
      </div>
    </main>
  );
}