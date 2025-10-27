'use client';
import { AlignRight } from 'lucide-react';
import {  useSession } from 'next-auth/react'
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

const Navbar = () => {
  const { data: session, status } = useSession()
  return (
    <div className='z-[100] w-full top-0  left-0 fixed backdrop-blur-xl h-[60px] flex items-center justify-center '>
      <div className=' w-full max-md:px-2 px-4 flex items-center justify-between'>
        <Link href={session?.user ? '/transaction' : '/'} className='max-md:text-xl  text-2xl center font-bold'>
          <Image src='/bank.png' alt='logo' width={40} height={40} className='hover:scale-125 drop-shadow-[0_5px_10px_rgba(0,0,0,0.25)] drop-shadow-amber-100  transition-all inline-block ml-2' />
        </Link>
        {status !== 'loading' && <div className=' flex items-center gap-4'>
          {session ? (
            <div className='max-md:text-xs flex items-center gap-4'>
              <div className='max-md:text-xs flex flex-col items-start'>
                <p className='max-md:hidden flex   text-sm'>Welcome,{session.user?.name}</p>
                <p className='max-md:hidden flex text-xs'>Signed as {" "}<span className=' text-cyan-400'>{" "} {session.user?.email}</span></p>
              </div>
              <Link href={'/profile'} className=' rounded-full   '>
                <Image src={session.user?.image!} alt='profile' width={30} height={30} className='rounded-full' />
              </Link>
              <div className='relative group '>
                <label className='bg-[#ffffff2d] p-1.5 rounded-lg flex cursor-pointer' htmlFor='is'>
                  <AlignRight className='text-gray-100' size={20} />
                </label>
                <input type="checkbox" hidden id="is" />
                <div className='group-has-checked:flex hidden appear absolute  py-3.5 w-  flex-col gap-2 border  text-white p-2 border-black/10 rounded-3xl bg-[#393b5ff0] !backdrop-blur-[15px] -left-[165px] '>
                  <Link className='text-sm hover:bg-indigo-500 bg-[#00000031] py-2 rounded-xl hover:text-[#e6e2eb] text-[#ddcaf5] px-6 center' href={`/track`}> Track </Link>
                  <Link className='text-sm hover:bg-indigo-500 bg-[#00000031] py-2 rounded-xl hover:text-[#e6e2eb] text-[#ddcaf5] center' href={`/bank`}> Add Bank</Link>
                  <Link className='text-sm hover:bg-indigo-500 bg-[#00000031] py-2 rounded-xl hover:text-[#e6e2eb] text-[#ddcaf5] px-6 center' href={`/transaction`}> Transaction </Link>
                  <Link className='text-sm hover:bg-indigo-500 bg-[#00000031] py-2 rounded-xl hover:text-[#e6e2eb] text-[#ddcaf5] center  ' href={`/calendar`}> View Calender </Link>
                  <Link className='text-sm hover:bg-indigo-500 bg-[#00000031] py-2 rounded-xl hover:text-[#e6e2eb] text-[#ddcaf5] center' href={`/category`}> View Category </Link>
                  <Link className='text-sm hover:bg-indigo-500 bg-[#00000031] py-2 rounded-xl hover:text-[#e6e2eb] text-[#ddcaf5] whitespace-nowrap center text-center px-2 ' href={`/create`}> Create transaction </Link>
                  <Link className='text-sm hover:bg-indigo-500 bg-[#00000031] py-2 rounded-xl hover:text-[#e6e2eb] text-[#ddcaf5] whitespace-nowrap center text-center px-2 ' href={`/syncmail`}> Sync Trancatioons </Link>
                  <Link className='text-sm hover:bg-indigo-500 bg-[#00000031] py-2 rounded-xl hover:text-[#e6e2eb] text-[#ddcaf5] whitespace-nowrap center text-center px-2 ' href={`/borrow`}>Borrow </Link>
                </div>
              </div>
            </div>
          ) : (
            <Link href="/login" className="rounded-full text-[#89dceb] border-[#89dceb] bg-[#89dceb2b] border p-2 px-5 text-sm max-md:px-3 ">
              Sign In
            </Link>
          )}
        </div>}
      </div>
    </div>
  )
}

export default Navbar