import Link from "next/link";

interface UserLinkProps {
  uid: string;
  name: string;
  className?: string;
}

export default function UserLink({ uid, name, className = "" }: UserLinkProps) {
  return (
    <Link
      href={`/profile/${uid}`}
      className={`hover:underline ${className}`}
    >
      {name}
    </Link>
  );
}
