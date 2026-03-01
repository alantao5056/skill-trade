"use client";

import Link from "next/link";
import {
  VscHome,
  VscAccount,
} from "react-icons/vsc";
import { MdMeetingRoom } from "react-icons/md";

export default function NavBar() {
  const items = [
    { icon: <VscHome size={18} />, label: "Home", href: "/" },
    { icon: <MdMeetingRoom size={18} />, label: "Meetings", href: "/meetings" },
    { icon: <VscAccount size={18} />, label: "Profile", href: "/profile" },
  ];

  return (
    <nav className="relative z-10 bg-teal-600 text-white flex justify-around py-4">
      {items.map((item, index) => (
        <Link
          key={index}
          href={item.href}
          className="flex flex-col items-center hover:text-orange-300 transition"
        >
          {item.icon}
          <span className="text-sm mt-1">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}