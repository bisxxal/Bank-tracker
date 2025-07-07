'use client';
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { data: session } = useSession();
  const router = useRouter();
  if (session) {
    router.push("/");
  }
  return (
    <div className="flex flex-col items-center justify-center   p-4">
      <div>
      {session ? (
        <>
         <div className=" flex flex-col items-center justify-center min-h-screen p-4">
           <p>Signed in as {session.user?.email}</p>
          <button className=" bg-red-500 cursor-pointer rounded-4xl p-2 px-5" onClick={() => signOut()}>Sign out</button>
            <Link href="/" className=" text-blue-500 underline">Dashboard</Link>
         </div>
        </>
      ) : (
        <div className=" flex flex-col items-center justify-center mt-20 p-4">
        <Image src='/bank.png' alt='logo' width={140} height={140} className='hover:scale-125 my-10 drop-shadow-[0_5px_13px_rgba(0,0,0,0.25)] drop-shadow-amber-100 transition-all hover:-translate-y-10 inline-block ml-2' />
        <button className=" buttonbg cursor-pointer rounded-4xl p-2 px-5" onClick={() => signIn("google",{ callbackUrl: "/" })}>Sign in with Google</button>
        </div>
      )}
    </div>
    </div>
  );
}
 