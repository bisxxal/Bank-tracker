import { getServerSession } from "next-auth";
import Link from "next/link"
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function InboxPage() {
  const session = await getServerSession(authOptions);
  const accessToken = (session as any)?.accessToken;
  
  if (!accessToken) {
    return (
      <div className=" flex w-full font-bold text-xl min-h-screen justify-center items-center flex-col">Please login to view Dashbord .
        <Link href="/login" className="rounded-full text-[#89dceb] border-[#89dceb] bg-[#89dceb2b] border p-2 px-5 mt-4 ">
          Sign In
        </Link> 
      </div>)
  }
  redirect('/transaction');
}
 