import type { Metadata } from "next";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import BottomBar from "@/components/buttombar";
import Navbar from "@/components/navbar";
import { getCachedSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Dashboard | My bank",
};

export default async function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const session = await getServerSession(authOptions);

  // if (!session) {
  //   redirect("/login");
  // }
  const session = await getCachedSession();

  if (!session) {
    redirect("/login");
  }
  return (
    <main>
      <div className=" mt-[60px] ">
        <Navbar />
        {children}
      </div>
      <BottomBar />
    </main>
  );
}
