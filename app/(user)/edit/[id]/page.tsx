'use client'
import { getTransactionById, updateTransaction } from '@/actions';
import Loading from '@/components/ui/loading';
import { toastError, toastSuccess } from '@/lib/toast';
import { banks, categories } from '@/lib/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker';

const EditPage = () => {
  const params = useParams<{ id: string }>()
  const id = params?.id || '';
  const router = useRouter()
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const { data, isLoading } = useQuery ({
    queryKey: ['fetchTransaction', id],
    queryFn: async () => {
      const res = await getTransactionById(id)
      return res
    }
  })
  
  const [types, setTypes] = useState<'debit' | 'credit'>(data?.type);
  const handelFormSubmit = (fromData: FormData) => {
    if(selectedDate){
      fromData.set('date2', selectedDate);
      CreateMutation.mutate(fromData);
    }
    else{
      toastError('Please select a date');
    }
  }
  const CreateMutation = useMutation({
    mutationFn: async (fromData: FormData) => {
      return await updateTransaction(fromData, id);
    },
    onSuccess: (data) => {
      localStorage.removeItem('paymentsData');
      if (data.status === 200) {
        toastSuccess('Transaction Updated successfully');
        queryClient.invalidateQueries({ queryKey: ['fetchTransaction'] });
        router.push('/transaction')
      }
    },

    onError: () => {
      toastError('Failed to update transaction');
    },
  });


  useEffect(() => {
    if (data?.type === 'debit' || data?.type === 'credit') {
      setTypes(data.type);
    }

     if (data?.date) {
    setSelectedDate(new Date(data.date)); // Ensure it's a Date object
  }
  }, [data]);

  if (isLoading) return <div className=' min-h-screen '>
    <Loading boxes={1} child='mt-10 max-md:mt-0 w-[70%] max-md:w-[95%] !rounded-3xl h-[80vh]' parent=' w-full h-screen' />
  </div>;


  return (
    <div className=' w-full min-h-screen pb-20 flex flex-col  items-center'>
      <h1 className="text-2xl font-bold center my-4">Update Transaction</h1>
      <form action={handelFormSubmit} className="space-y-4  w-[70%] border bordercolor max-md:w-[95%] mx-auto py-5 rounded-2xl flex px-4 flex-col">

        <div className=''>
          <label className="block text-sm font-medium ">Amount</label>
          <input required
            type="number"
            defaultValue={data?.amount || 0}
            name="amount"
            className={` ${types === 'credit' ? "text-green-500" : "text-red-500"} mt-1 font-bold  block w-full border bordercolor card p-2 rounded-md shadow-sm  `}
            placeholder="Enter amount"
          />
        </div>
        <div>
          <label className="block text-sm font-medium ">Transaction</label>
          <select required onChange={(e) => setTypes(e.target.value as 'credit' | 'debit')}
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
            {
              banks.map((i)=>{
                return(
                  <option key={i.value} value={i.value}>{i.name}</option>
                )
              })
            }
          </select>
        </div>

        {types === 'debit' && <div>
          <label className="block text-sm font-medium ">Category</label>
          <select name='category'
            defaultValue={data?.category || ''}
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

        {types === 'debit' && <div>
          <label className="block text-sm font-medium ">Spends on</label>
          <input
            type="text"
            name='send'
            defaultValue={data?.send || ''}
            className="mt-1 block w-full border bordercolor card p-2 rounded-md shadow-sm  "
            placeholder="Enter reason for spending "
          />
        </div>}

        <div>
          <label className="block text-sm font-medium "> {types === 'credit' ? 'Who sends you ' : 'Send to '} </label>
          <input
            type="text"
            defaultValue={data?.spendsOn || ''}
            name='spendsOn'
            className="mt-1 block w-full border bordercolor card p-2 rounded-md shadow-sm  "
            placeholder={types === 'credit' ? 'Sender name' : 'xyz private lim'}
          />
        </div>
 

        <div className=' max-md:flex flex-col items-center justify-center'>
          <label className="block text-sm font-medium ">Date</label>
          <DatePicker
            required
            name='date'
            selected={selectedDate}
            // selected={data?.date ? data?.date : selectedDate}
            onChange={(date: Date | null) => {
              setSelectedDate(date);
            }}
            showTimeInput
            calendarClassName='  customclass '
            popperClassName="customclass2"
            selectsStart
            className="border-2 bordercolor w-[150px] center max-md:w-[120px] rounded-xl px-2 py-1 card text-white"
            placeholderText="Select start date"
          />
        </div>
        <button
          type="submit"
          disabled={CreateMutation.isPending}
          className=" disabled:opacity-[0.5] center  px-4 py-2 buttonbg text-white rounded-full  transition duration-200"
        >
          {CreateMutation.isPending ? <Loader className=' animate-spin ' /> : 'Update Transaction'}
        </button>
      </form>
    </div>
  )
}

export default EditPage