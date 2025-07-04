'use client'
import { AddBanks } from '@/actions'
import { banks } from '@/lib/utils'
import { useMutation } from '@tanstack/react-query'
import { Loader } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

const Profile = () => {
  const [show, setShow] = useState(false);
  const handelFormSubmit = (fromData: FormData) => {
    const name = fromData.get('name') as string;
    const email = fromData.get('email') as string;
    if (!name || !email) {
      toast.error('Name and MailId are required');
    }
    CreateMutation.mutate(fromData);
  }

  const CreateMutation = useMutation({
    mutationFn: async (fromData: FormData) => {
      return await AddBanks(fromData);
    },
    onSuccess: (data) => {
      console.log(data)
      if (data.status === 200) {
        toast.success('Bank added successfully');
      }
    },

    onError: (error) => {
      toast.error('Failed to add bank');
    },
  });

  return (
    <div className=' w-full min-h-screen '>
      <div className='flex flex-col items-center justify-center h-full'>
        <h1 className='text-2xl font-bold mb-4'>User Profile</h1>
      </div>

      <div className='flex flex-col items-center justify-center h-full'>
        <h1>Quick links</h1>

        <div className=' my-7 center gap-2'>
          <Link className=' buttonbg p-2 px-4 rounded-full' href={'/create'}>Create Transaction</Link>
          <button onClick={() => setShow(!show)} className=' buttonbg p-2 px-4 rounded-full '>
            {show ? 'Hide Form' : 'Add Bank'}
          </button>
        </div>
      </div>
      <div className='flex flex-col items-center justify-center h-full'>
      </div>
      {!show && <form action={handelFormSubmit} className="space-y-4  w-[70%] border bordercolor max-md:w-[95%] mx-auto py-5 rounded-2xl flex px-4 flex-col">
        <div>
          <label className="block text-sm font-medium ">Bank Name</label>
          <select required
            name='name'
            className="mt-1 block w-full border bordercolor card p-2 rounded-md shadow-sm "
          >
            <option value="">Select a Bank</option>
            {banks.map((bank) => (
              <option key={bank.value} value={bank.value}>
                {bank.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium ">Bank Mail ID </label>
          <input required
            type="email"
            name='email'
            className="mt-1 block w-full border bordercolor card p-2 rounded-md shadow-sm  "
            placeholder="Enter Bank mailId"
          />
        </div>


        <button
          type="submit"
          disabled={CreateMutation.isPending}
          className=" disabled:opacity-[0.5] center  px-4 py-2 buttonbg text-white rounded-full transition duration-200"
        >
          {CreateMutation.isPending ? <Loader className=' animate-spin ' /> : 'Add Bank'}
        </button>
      </form>}
    </div>
  )
}

export default Profile