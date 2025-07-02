'use client';
import { signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link';
import React from 'react'

const Navbar = () => {
     const { data: session } = useSession()
     
  return (
    <div className=' w-full top-0 border-b border-white/20 left-0 fixed backdrop-blur-xl h-[60px] flex items-center justify-center '>
        <div className=' w-full  px-4 flex items-center justify-between'>
            <Link href={'/'} className=' text-2xl font-bold'>My Bank</Link>
            <div className=' flex items-center gap-4'>
            {session ? (
              <div className=' flex items-center gap-4'>
                 <Link href={'/transaction'} className=' px-3 py-1.5 rounded-full bg-blue-500 '>Transactions</Link>
                 <div className=' flex flex-col items-start'>
                    <p className=' text-sm'>Welcome, {session.user?.name}</p>
                    <p className=' text-xs'>Signed as <span className=' text-cyan-400'>{session.user?.email}</span></p>
                 </div>
                   <button className=" bg-red-500 cursor-pointer rounded-4xl p-2 px-5" onClick={() => signOut()}>Sign out</button>
              </div>
            ) : (
                <button className=" bg-blue-500 cursor-pointer rounded-4xl p-2 px-5" onClick={() => signIn("google")}>Sign in </button>
            )}
            </div>
        </div>
    </div>
  )
}

export default Navbar