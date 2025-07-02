'use client';

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function LoginButton() {
  const { data: session } = useSession();

  return (
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
        <>
        <h1 className="text-2xl font-bold mb-4">Sign in to read your Gmail</h1>
        <button className=" bg-blue-500 cursor-pointer rounded-4xl p-2 px-5" onClick={() => signIn("google",{ callbackUrl: "/" })}>Sign in with Google</button>
        </>
      )}
    </div>
  );
}
