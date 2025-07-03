'use client'
import { getTransactionById, updateTransaction } from '@/actions';
import Loading from '@/components/ui/loading';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useState } from 'react'
import DatePicker from 'react-datepicker';
import toast from 'react-hot-toast';

const EditPage = () => {

  const params = useParams<{ tag: string; item: string }>()

  const id = params?.id || '';
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const handelFormSubmit = (fromData: FormData) => {
    CreateMutation.mutate(fromData);
  }


  
  const CreateMutation = useMutation({
    mutationFn: async (fromData: FormData) => {
      return await updateTransaction(fromData , id);
    },
    onSuccess: (data) => {
      console.log(data)
      if (data.status === 200) {
        toast.success('Transaction created successfully');
        queryClient.invalidateQueries({ queryKey: ['fetchTransaction'] });
      }
    },

    onError: (error) => {
      toast.error('Failed to create transaction');
    },
  });
 const { data, isLoading, error } = useQuery({
    queryKey: ['fetchTransaction',],
    queryFn: async () => {
      const res = await getTransactionById(id)
      return res
    }
  })
  if (isLoading) return <div className=' min-h-screen '> 
   
   <Loading  boxes={1} child='mt-10 w-[70%] max-md:w-[95%]  rounded-3xl h-[80vh]' parent=' w-full h-screen' />
    </div>;
  return (
    <div className=' w-full min-h-screen flex flex-col justify-center items-center'>
      <h1 className="text-2xl font-bold center mb-4">Update Transaction</h1>
      <form action={handelFormSubmit} className="space-y-4  w-[70%] border bordercolor max-md:w-[95%] mx-auto py-5 rounded-2xl flex px-4 flex-col">

        <div className=''>
          <label className="block text-sm font-medium ">Amount</label>
          <input required
            type="number"
            defaultValue={data?.amount || ''}
            name="amount"
            className="mt-1 block w-full border bordercolor card p-2 rounded-md shadow-sm  "
            placeholder="Enter amount"
          />
        </div>
        <div>
          <label className="block text-sm font-medium ">Transaction</label>
          <select required
            defaultValue={data?.type || 'credit'}
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
            defaultValue={data?.bank ? data.bank : ''}
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
            defaultValue={data?.category || ''}
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
            defaultValue={data?.send || ''}
            className="mt-1 block w-full border bordercolor card p-2 rounded-md shadow-sm  "
            placeholder="Enter reason for spending or receiving"
          />
        </div>

        <div>
          <label className="block text-sm font-medium ">Send to / Recevied by (spends) </label>
          <input
            type="text"
            defaultValue={data?.spendsOn || ''}
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

            selected={data?.date ? data?.date : selectedDate}
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
          className=" disabled:opacity-[0.5] center  px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
        >
          {CreateMutation.isPending ? <Loader className=' animate-spin ' /> : 'Create Transaction'}
        </button>
      </form>
    </div>
  )
}

export default EditPage