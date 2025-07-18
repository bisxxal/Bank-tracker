'use client'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Profile = () => {
  const { data: session, status } = useSession()
  return (
    <div className=' relative w-full min-h-screen overflow-hidden'>
      <div className='flex flex-col items-center justify-center h-full'>
        <h1 className='text-2xl font-bold mb-4'>User Profile</h1>
      </div>


      <div className="bg-[#1E1E2E]/80 mx-auto backdrop-blur-lg border border-[#313244]/50 rounded-2xl p-8 shadow-2xl max-w-md w-full text-center">
        <div>
          {status !== 'loading' && session && (
            <div className='flex flex-col items-center justify-center'>
              <Image src={session.user?.image!} alt='profile' width={100} height={100} className='rounded-full w-24 h-24' />
              <h2 className='text-xl font-semibold'>{session.user?.name}</h2>
              <p className='text-gray-600'>Signed as {session.user?.email}</p>
            </div>
          )}
        </div>

        <div className='flex !flex-col items-center w-full justify-center h-full'>
          <div className=' my-7 flex-warp max-md: flex-col w-full center gap-3'>
            <Link className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center space-x-2 transition-all duration-200 transform hover:scale-105"
              href={'/create'}>Create Transaction</Link>
            <Link className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center space-x-2 transition-all duration-200 transform hover:scale-105" href={'/bank'}>Bank Page</Link>
            <Link className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center space-x-2 transition-all duration-200 transform hover:scale-105" href={'/mail'}>View all mail</Link>
          </div>
        </div>
        <div className='flex flex-col items-center justify-center h-full'>
          <button className="w-full max-md:text-xs border border-red-500/50 text-red-500/80 cursor-pointer rounded-4xl bg-red-400/10  p-2 max-md:px-3 px-5" onClick={() => signOut()}>Sign out</button>
        </div>
      </div>
      <div className=' w-fit mx-auto mt-20 max-md:mt-32 flex items-center justify-center'>
        <Image src='/bank.png' alt='logo' width={60} height={60} className='hover:scale-125 mx-auto drop-shadow-[0_5px_10px_rgba(0,0,0,0.25)] drop-shadow-amber-100   transition-all inline-block ml-2' />
      </div>

    </div>
  )
}

export default Profile