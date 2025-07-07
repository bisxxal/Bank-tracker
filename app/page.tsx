import { getServerSession } from "next-auth";
import Link from "next/link"
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function InboxPage() {
  const session = await getServerSession(authOptions);
  const accessToken = (session as any)?.accessToken;

  if (!accessToken) {
    return (
      <div className=" flex w-full font-bold text-xl overflow-hidden h-screen justify-center items-center flex-col">
        <Image src='/bank.png' alt='logo' width={140} height={140} className='mb-10 hover:scale-125 drop-shadow-[0_5px_13px_rgba(0,0,0,0.25)] drop-shadow-amber-100  transition-all inline-block ml-2' />
        <h2> Please login to view Dashbord .</h2>
        <Link href="/login" className="rounded-full text-[#89dceb] border-[#89dceb] bg-[#89dceb2b] border p-2 px-5 mt-4 ">
          Sign In
        </Link>

      </div>)
  }
  redirect('/transaction');
}
