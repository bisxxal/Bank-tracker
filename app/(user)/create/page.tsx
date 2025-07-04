'use client'
import { createTransaction } from '@/actions';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader } from 'lucide-react';
import React, { useState } from 'react'
import DatePicker from 'react-datepicker';
import toast from 'react-hot-toast';

const CreateTransaction = () => {
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const handelFormSubmit = (fromData: FormData) => {
    CreateMutation.mutate(fromData);
  }

  const CreateMutation = useMutation({
    mutationFn: async (fromData: FormData) => {
      return await createTransaction(fromData);
    },
    onSuccess: (data) => {
      console.log(data)
      if (data.status === 200) {
        toast.success('Transaction created successfully');
        queryClient.invalidateQueries({ queryKey: ['trackerData'] });
      }
    },

    onError: (error) => {
      toast.error('Failed to create transaction');
    },
  });

  return (
    <div className=' w-full min-h-screen flex flex-col justify-center items-center'>
      <h1 className="text-2xl font-bold center mb-4">Create Transaction</h1>

      <form action={handelFormSubmit} className="space-y-4  w-[70%] border bordercolor max-md:w-[95%] mx-auto py-5 rounded-2xl flex px-4 flex-col">

        <div className=''>
          <label className="block text-sm font-medium ">Amount</label>
          <input required
            type="number"
            name="amount"
            className="mt-1 block w-full border bordercolor card p-2 rounded-md shadow-sm  "
            placeholder="Enter amount"
          />
        </div>
        <div>
          <label className="block text-sm font-medium ">Transaction</label>
          <select required
            name='type'
            className="mt-1 block w-full border bordercolor card p-2 rounded-md shadow-sm "
          >
            <option value="credit">Credit</option>
            <option value="debit">Debit</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium ">Bank</label>
          <select name='bank' required
            className="mt-1 block w-full border bordercolor card p-2 rounded-md shadow-sm "
          >
            <option value="">Select bank</option>
            <option value="HDFCBANK">Hdfc</option>
            <option value="KOTAK">Kotak 811</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium ">Category</label>
          <select name='category'
            className="mt-1 block w-full border bordercolor card p-2 rounded-md shadow-sm "
          >
            <option value="">Select category</option>
            <option value="food">Food</option>
            <option value="transport">Transport</option>
            <option value="entertainment">Entertainment</option>
            <option value="utilities">Utilities</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium ">Spends on / Recevied </label>
          <input
            type="text"
            name='send'
            className="mt-1 block w-full border bordercolor card p-2 rounded-md shadow-sm  "
            placeholder="Enter reason for spending or receiving"
          />
        </div>

        <div>
          <label className="block text-sm font-medium ">Send to / Recevied by (spends) </label>
          <input
            type="text"
            name='spendsOn'
            className="mt-1 block w-full border bordercolor card p-2 rounded-md shadow-sm  "
            placeholder="Enter reason for spending or receiving"
          />
        </div>



        <div>
          <label className="block text-sm font-medium ">Date</label>
          <DatePicker
            required
            name='date'
            selected={selectedDate}
            onChange={(date: Date | null) => {
              setSelectedDate(date);
              // You can handle additional logic here
            }}
            selectsStart
            className="border-2 bordercolor w-[150px] center max-md:w-[120px] rounded-xl px-2 py-1 card text-white"
            placeholderText="Select start date"
          />
        </div>
        <button
          type="submit"
          disabled={CreateMutation.isPending}
          className=" disabled:opacity-[0.5] center  px-4 py-2 buttonbg text-white rounded-full transition duration-200"
        >
          {CreateMutation.isPending ? <Loader className=' animate-spin ' /> : 'Create Transaction'}
        </button>
      </form>
    </div>
  )
}

export default CreateTransaction