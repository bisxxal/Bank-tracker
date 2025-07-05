'use client'
import Link from 'next/link'
import React from 'react'

const Profile = () => {
  return (
    <div className=' w-full min-h-screen '>
      <div className='flex flex-col items-center justify-center h-full'>
        <h1 className='text-2xl font-bold mb-4'>User Profile</h1>
      </div>

      <div className='flex flex-col items-center justify-center h-full'>
        <h1>Quick links</h1>

        <div className=' my-7 center gap-2'>
          <Link className=' buttonbg p-2 px-4 rounded-full' href={'/create'}>Create Transaction</Link>
          <Link className=' buttonbg p-2 px-4 rounded-full' href={'/bank'}>Bank Page</Link>

        </div>
      </div>
      <div className='flex flex-col items-center justify-center h-full'>
      </div>

    </div>
  )
}

export default Profile