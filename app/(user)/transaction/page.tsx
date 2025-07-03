'use client';
import { deleteTransaction, getTransactionsBySelected } from '@/actions';
import DateButton from '@/components/dateButton';
import { SyncButton } from '@/components/syncButton';
import Loading from '@/components/ui/loading';
import { getLabelForDate } from '@/lib/dateformat';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { endOfMonth, startOfMonth } from 'date-fns';
import { Loader } from 'lucide-react';
import moment from 'moment';
import Link from 'next/link';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
const TransactionPage = () => {
  const today = new Date();
  const queryClient = useQueryClient();
  const [startDate, setStartDate] = useState<Date>(startOfMonth(today));
  const [endDate, setEndDate] = useState<Date>(endOfMonth(today));

  const { data, isLoading } = useQuery({
    queryKey: ['trackerData', startDate, endDate],
    queryFn: async () => {
      const res = await getTransactionsBySelected(startDate, endDate)

      return res
    }
  })

  const groupedMessages = data?.reduce((acc: Record<string, typeof data>, msg) => {
    const label = getLabelForDate(msg?.date  );
    if (!acc[label]) acc[label] = [];
    acc[label].push(msg);
    return acc;
  }, {});

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await deleteTransaction(id);
    },
    onSuccess: () => {
      toast.success('Transaction deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['trackerData'] });
    },

    onError: (error) => {
      toast.error('Failed to delete transaction');
    },
  });
  return (
    <div className=' w-full min-h-screen'>
      <h1 className="text-center">Your Transactions {data?.length}</h1>
      <div className="flex flex-col gap-4 px-20 max-md:px-2 pt-10">
        <SyncButton />

        <DateButton startDate={startDate} endDate={endDate} setStartDate={setStartDate} setEndDate={setEndDate} />

        {groupedMessages && Object.entries(groupedMessages).length !== 0 && !isLoading ? Object?.entries(groupedMessages).map(([label, group]) => (
          <div key={label}>
            <div className="text-center border bordercolor w-fit mx-auto rounded-full px-2 text-sm basecolor2 font-semibold my-4">{label}</div>
            {group.map((msg) => (
              <div className="flex max-md:flex-col card max-md:items-start mb-3 justify-between items-center border bordercolor rounded-2xl p-4" key={msg.id}>
                <div>
                  <p><strong>Amount:</strong> <span className='  text-xl font-bold'>₹{msg.amount.toFixed(2)}</span> </p>
                  <p className={`${msg.type=== 'credit' ? ' text-green-500 ' :' text-red-500 ' } capitalize `}><strong>Type:</strong> {msg.type}</p>
                  <p><strong>Bank:</strong> {msg.bank}</p>

                  { msg?.send && <p><strong> {msg.type=== 'credit' ? ' Send By ' :' Send to' }   : </strong> {msg.send}</p>}
                  { msg?.spendsOn && <p><strong> {msg.type=== 'credit' ? ' Recived on ' :' Spends On ' }   :</strong> {msg.spendsOn}</p>}
                  { msg?.category && <p><strong>Category:</strong> {msg.category}</p>}
                  <p><strong>Date:</strong> {moment(msg.date).format('MMMM Do YYYY, h:mm:ss a')}</p>
                </div>
                <div className="border h-full bg-[#262538] border-[#cba6f7] w-fit rounded-3xl flex-col max-md:w-full mr-3 p-2 px-4 flex gap-3 center justify-between">
                 <p> <strong>ID:</strong> {msg.id}</p>
                 <div className=' flex gap-2 justify-between items-center'>
                   <button onClick={() => deleteMutation.mutateAsync(msg.id)} className=' p-2 px-4 border border-red-500 rounded-full'>
                    {deleteMutation.isPending ? <Loader className=' animate-spin ' /> : 'Delete'}
                  </button>
                   <Link href={`/edit/${msg.id}`} className=' p-2 px-4 border border-green-500 rounded-full'>
                 update
                  </Link>
                 </div>
                </div>
              </div>
            ))}
          </div>
        )) : (
          isLoading ?
            <Loading boxes={5} child="h-28 max-md:h-[200px] w-full rounded-3xl " parent="w-full px-0 mt-13 " /> : <p className='mt-20 text-lg center '>No data found</p>
        )}

      </div>
    </div>
  )
}

export default TransactionPage