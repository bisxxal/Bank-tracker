'use client';
import { deleteTransaction, getTransactionsBySelected } from '@/actions';
import DateButton from '@/components/dateButton';
import { SyncButton } from '@/components/syncButton';
import Loading from '@/components/ui/loading';
import SwipeRevealActions from '@/components/ui/swipeToDelete';
import { getLabelForDate } from '@/lib/dateformat';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { endOfMonth, startOfMonth } from 'date-fns';
import { Loader } from 'lucide-react';
import moment from 'moment';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast';

const TransactionPage = () => {
  const router = useRouter();
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
    const label = getLabelForDate(String(msg?.date ?? ''));
    if (!acc[label]) acc[label] = [];
    acc[label].push(msg);
    return acc;
  }, {});

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await deleteTransaction(id);
    },
    onSuccess: (data) => {
      if (data.status === 200) {
        toast.success('Transaction deleted successfully');
        queryClient.invalidateQueries({ queryKey: ['trackerData'] });
      }
    },

    onError: (error) => {
      toast.error('Failed to delete transaction');
    },
  });


  const [openItemId, setOpenItemId] = useState<string | null>(null);
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Set reference to swipe items
  const setItemRef = (id: string, ref: HTMLDivElement | null) => {
    itemRefs.current[id] = ref;
  };

  // Close open swipe on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (!openItemId) return;

      const openRef = itemRefs.current[openItemId];
      if (openRef && !openRef.contains(e.target as Node)) {
        setOpenItemId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [openItemId]);

  const handleDelete = (id: string) => {
    deleteMutation.mutateAsync(id)
  };

  const handleUpdate = (id: string) => {
    router.push(`/edit/${id}`);
  };

  const handleOpen = (id: string) => {
    setOpenItemId(id);
  };

  return (
    <div className=' w-full min-h-screen'>
      <h1 className="text-center">Your Transactions {data?.length}</h1>
      <div className="flex flex-col gap-4 px-14 max-md:px-2.5 pt-10">
        <SyncButton />

        <DateButton startDate={startDate} endDate={endDate} setStartDate={setStartDate} setEndDate={setEndDate} />

        {groupedMessages && Object.entries(groupedMessages).length !== 0 && !isLoading ? Object?.entries(groupedMessages).map(([label, group]) => (
          <div key={label}>
            <div className="text-center border bordercolor bg-[#262538] w-fit mx-auto rounded-full px-2 text-sm basecolor2 font-semibold my-4">{label}</div>
            {group.map((msg) => (
              <SwipeRevealActions
                key={msg.id}
                id={msg.id}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
                isOpen={openItemId === msg.id}
                onOpen={handleOpen}
                setRef={setItemRef}
              >
                <div className="flex card max-md:items-start justify-between items-center border bordercolor rounded-2xl p-4" key={msg.id}>
                  <div>
                    <p><strong>Amount:</strong> <span className='  text-xl font-bold'>₹{msg.amount.toFixed(2)}</span> </p>
                    <p className={`${msg.type === 'credit' ? ' text-green-500 ' : ' text-red-500 '} capitalize `}><strong>Type:</strong> {msg.type}</p>
                    <p><strong>Bank:</strong> {msg.bank}</p>

                    {msg?.send && <p><strong> {msg.type === 'credit' ? ' Send By ' : ' Send to'}   : </strong> {msg.send}</p>}
                    {msg?.spendsOn && <p><strong> {msg.type === 'credit' ? ' Recived on ' : ' Spends On '}   :</strong> {msg.spendsOn}</p>}
                    {msg?.category && <p><strong>Category:</strong> {msg.category}</p>}
                    <p><strong>Date:</strong> {moment(msg.date).format('MMMM Do YYYY, h:mm:ss a')}</p>
                  </div>
                  {/* <div className="border h-full bg-[#262538] border-[#cba6f7]/50 w-fit rounded-full flex-col p-2 flex gap-3 center justify-between">
                   <p>Id : <span className='text-sm text-[#cba6f7]'>{msg.id}</span></p>
                  </div> */}
                </div>
              </SwipeRevealActions>

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
