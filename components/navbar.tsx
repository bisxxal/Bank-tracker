'use client';
import { signIn, signOut, useSession } from 'next-auth/react'
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

const Navbar = () => {
     const { data: session } = useSession()
     
  return (
    <div className='z-[100] w-full top-0 border-b bordercolor -white/20 left-0 fixed backdrop-blur-xl h-[60px] flex items-center justify-center '>
        <div className=' w-full max-md:px-2 px-4 flex items-center justify-between'>
            <Link href={'/'} className='max-md:text-base text-2xl font-bold'>My Bank</Link>
            <div className=' flex items-center gap-4'>
            {session ? (
              <div className='max-md:text-xs flex items-center gap-4'>
                 <div className='max-md:text-xs flex flex-col items-start'>
                    <p className='max-md:text-xs text-sm'>Welcome, {session.user?.name}</p>
                    <p className='max-md:hidden flex text-xs'>Signed as <span className=' text-cyan-400'>{session.user?.email}</span></p>
                 </div>
                 <Link href={'/profile'} className=' rounded-full text-[#89dceb]  border border-[#89dceb] bg-[#89dceb2b] '>
                 <Image src={session.user?.image!} alt='profile' width={30} height={30} className='rounded-full' /> 
                 </Link>
                   <button className="max-md:text-xs border border-red-500 cursor-pointer rounded-4xl bg-red-400/10  p-2 max-md:px-3 px-5" onClick={() => signOut()}>Sign out</button>
              </div>
            ) : (
                <button className=" buttonbg cursor-pointer rounded-4xl p-2 px-5" onClick={() => signIn("google")}>Sign in </button>
            )}
            </div>
        </div>
    </div>
  )
}

export default Navbar