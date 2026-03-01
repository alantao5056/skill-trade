import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import NavBarWrapper from "@/app/components/layout/NavBarWrapper";
import LayoutContent from "@/app/components/layout/LayoutContent";
import { UserProvider } from "@/context/UserContext";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "SkillTrade",
  description: "Trade skills with others.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-hidden">
      <body className={`${poppins.variable} font-sans antialiased min-h-screen overflow-hidden`}>
        <UserProvider>
          <NavBarWrapper />
          <LayoutContent>{children}</LayoutContent>
        </UserProvider>
      </body>
    </html>
  );
}
