"use client";

import { useRouter } from "next/navigation";
import { VscHome, VscAccount } from "react-icons/vsc";
import { MdMeetingRoom } from "react-icons/md";
import Dock from "@/app/components/ui/Dock";

export default function NavBar() {
  const router = useRouter();

  const items = [
    {
      icon: <VscHome size={18} />,
      label: "Home",
      onClick: () => router.push("/"),
    },
    {
      icon: <MdMeetingRoom size={18} />,
      label: "Meetings",
      onClick: () => router.push("/meetings"),
    },
    {
      icon: <VscAccount size={18} />,
      label: "Profile",
      onClick: () => router.push("/profile"),
    },
  ];

  return (
    <div className="dock-nav z-10 flex justify-center items-end pointer-events-none pb-2">
      <div className="pointer-events-auto min-h-[100px] flex items-end">
        <Dock
          items={items}
          panelHeight={80}
          baseItemSize={60}
          magnification={70}
        />
      </div>
    </div>
  );
}
