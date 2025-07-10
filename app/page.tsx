import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function InboxPage() {
  const session = await getServerSession(authOptions);
  const accessToken = (session as any)?.accessToken;

  if (!accessToken) {
    return (
      <div className="relative flex w-full font-bold text-xl overflow-hidden h-screen justify-center items-center flex-col">
        <div className="absolute top-0 left-0 w-full flex items-center bg-[#080812] justify-center h-full max-md:flex-col overflow-hidden flex-wrap brightness-[0.5] contrast-[1.1] z-[-1]">
          <Image src='/bg1.png' alt='logo' width={1000} height={1240} className='w-1/2 max-md:w-full h-[300px] max-md:h-[270px] object-cover ' />
          <Image src='/bg3.png' alt='logo' width={1000} height={1240} className='w-1/2 h-[300px] max-md:w-full max-md:h-[270px] object-cover ' />
          <Image src='/bg4.png' alt='logo' width={1000} height={1240} className='w-1/2 h-[300px] max-md:w-full max-md:h-[270px] object-cover ' />
          <Image src='/bg5.png' alt='logo' width={1000} height={1240} className='w-1/2 max-md:w-full max-md:hidden h-[300px] object-cover ' />
          <div className="w-full">
            <Image src='/bg7.png' alt='logo' width={1000} height={1240} className='w-full object-bottom-left object-cover' />
          </div>
        </div>

        <div className="w- relative ">
          <h1 className="text-[130px] max-md:text-[65px] max-md:-left-4 max-md:top-0 -left-18 -top-18 font-extrabold textshadow whitespace-nowrap text-white absolute ">My Bank</h1>
          <Image src='/bank.png' alt='logo' width={240} height={240} className='mb-10 hover:scale-125 drop-shadow-[0_5px_13px_rgba(0,0,0,0.25)] drop-shadow-amber-100  transition-all duration-300 inline-block ml-2' />
        </div>
        <h1 className=" max-md:text-base text-xl textshadow mt-20">Add Bank. Track Transaction. Visualize.</h1>
      </div>
    )
  }
  redirect('/transaction');
}
