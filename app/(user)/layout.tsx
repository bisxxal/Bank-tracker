import type { Metadata } from "next";   
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import BottomBar from "@/components/buttombar";
 
export const metadata: Metadata = {
  title: "TransactionPage", 
};

export default async function   UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
 const session = await getServerSession(authOptions);

 if (!session) {
    redirect("/login");
 }
    
  return ( 
    <main>
        <div className=" mt-[75px] ">
        {children}
        </div>
        
    </main>
  );
}
