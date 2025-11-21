'use client'
import { createTransaction } from '@/actions';
import { toastError, toastSuccess } from '@/lib/toast';
import { banks, categories } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader } from 'lucide-react';
import React, { useState } from 'react'
import DatePicker from 'react-datepicker';

const CreateTransaction = () => {
  const [type , setType] = useState<'credit' | 'debit'>('debit');
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  const handelFormSubmit = (formData: FormData) => {
    if(selectedDate){
      formData.set('date2', selectedDate); 
      CreateMutation.mutate(formData);
    }
  }

  const CreateMutation = useMutation({
    mutationFn: async (fromData: FormData) => {
      return await createTransaction(fromData);
    },
    onSuccess: (data) => {
      localStorage.removeItem('paymentsData');
      if (data.status === 200) {
        toastSuccess('Transaction created successfully');
        queryClient.invalidateQueries({ queryKey: ['trackerData'] });
      }
    },
    onError: (error) => {
      toastError('Failed to create transaction');
    },
  });

  return (
    <div className=' w-full min-h-screen mb-20 flex flex-col items-center'>
      <h1 className="text-2xl font-bold center  my-4">Create Transaction</h1>

      <form action={handelFormSubmit} className="space-y-4  w-[70%] border bordercolor max-md:w-[95%] mx-auto py-5 rounded-2xl flex px-4 flex-col">
        <div className=''>
          <label className="block text-sm font-medium ">Amount</label>
          <input required
            type="number"
            name="amount"
            className={` ${type==='credit'? "text-green-500" :"text-red-500"} mt-1 font-bold  block w-full border bordercolor card p-2 rounded-md shadow-sm  `}
            placeholder="Enter amount"
          />
        </div>
        <div>
          <label className="block text-sm font-medium ">Transaction</label>
          <select onChange={(e)=>setType(e.target.value as 'credit' | 'debit')} required
            name='type'
            className="mt-1 block w-full border bordercolor card p-2 rounded-md shadow-sm "
          >
            <option value="debit">Debit</option>
            <option value="credit">Credit</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium ">Bank</label>
          <select name='bank' required
            className="mt-1 block w-full border bordercolor card p-2 rounded-md shadow-sm "
          >
            <option value="">Select bank</option>
             {
              banks.map((i)=>{
                return(
                  <option key={i.value} value={i.value}>{i.name}</option>
                )
              })
             }
          </select>
        </div>

       { type === 'debit' && <div>
          <label className="block text-sm font-medium ">Category</label>
          <select name='category'
            className="mt-1 block w-full border bordercolor card p-2 rounded-md shadow-sm "
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.name}
              </option>
            ))}
          </select>
        </div>}

       <div>
          <label className="block text-sm font-medium ">
            {type === 'credit' ? 'Who sends you ' : 'Send On ' }  </label>
          <input
            type="text"
            name='send'
            className="mt-1 block w-full border bordercolor card p-2 rounded-md shadow-sm  "
            placeholder={type === 'credit' ? 'Sender name' : 'Enter reason for spending'}
          />
        </div>
        <div className=' max-md:flex flex-col items-center justify-center'>
          <label className="block text-sm font-medium ">Date</label>
          <DatePicker
            required
            showTimeInput
            name='date'
            selected={selectedDate}
            calendarClassName='  customclass '
            popperClassName="customclass2"
            onChange={(date: Date | null) => {
              setSelectedDate(date); 
            }}
            selectsStart
            className="border-2 bordercolor placeholder:text-xs w-[150px] center max-md:w-[120px] rounded-xl px-2 py-1 card text-white"
            placeholderText="Select date"
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