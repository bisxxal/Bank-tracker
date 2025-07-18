'use client';
import { deleteTransaction, getTransactionsBySelected } from '@/actions';
import DateButton from '@/components/dateButton';
import Loading from '@/components/ui/loading';
import SwipeRevealActions from '@/components/ui/swipeToDelete';
import { getLabelForDate } from '@/lib/dateformat';
import { TransactionTypeProps } from '@/lib/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { endOfMonth, startOfMonth } from 'date-fns';
import { TrendingDown, TrendingUp } from 'lucide-react';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast';

const TransactionPage = () => {
  const router = useRouter();
  const today = new Date();
  const queryClient = useQueryClient();
  const [startDate, setStartDate] = useState<Date>(startOfMonth(today));
  const [endDate, setEndDate] = useState<Date>(endOfMonth(today));
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<string | null>(null);
  const { data, isLoading } = useQuery({
    queryKey: ['trackerData', startDate, endDate],
    queryFn: async () => {
      const res = await getTransactionsBySelected(startDate, endDate)
      return res
    }
  })

  const groupedMessages = data?.reduce((acc: Record<string, typeof data>, msg: TransactionTypeProps) => {
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

  const banks = data?.reduce((acc: { bank: string, amount: number, type: string }[], curr: TransactionTypeProps) => {

    const existingBank = acc.find(item => item.bank === curr.bank && item.type === curr.type);
    if (existingBank) {
      acc[acc.indexOf(existingBank)].amount += curr.amount;
      return acc;
    }
    acc.push({ bank: curr.bank, amount: curr.amount, type: curr.type });

    return acc;
  }, [])


  const uniqueBanks = banks?.reduce((acc: { bank: string, creditAmount: number, debitAmount: number, credit: boolean, debit: boolean }[], curr: TransactionTypeProps) => {
    const bankEntry = acc.find(item => item.bank === curr.bank);
    if (bankEntry) {
      if (curr.type === 'credit') {
        bankEntry.credit = true;
        bankEntry.creditAmount += curr.amount;
      } else if (curr.type === 'debit') {
        bankEntry.debit = true;
        bankEntry.debitAmount += curr.amount;
      }
    } else {
      acc.push({
        bank: curr.bank,
        credit: curr.type === 'credit',
        debit: curr.type === 'debit',
        creditAmount: curr.type === 'credit' ? curr.amount : 0,
        debitAmount: curr.type === 'debit' ? curr.amount : 0
      });
    }
    return acc;
  }, []);
  const [openItemId, setOpenItemId] = useState<string | null>(null);
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const setItemRef = (id: string, ref: HTMLDivElement | null) => {
    itemRefs.current[id] = ref;
  };

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
    setShowDeleteConfirmation(id);
  };

  const handleUpdate = (id: string) => {
    router.push(`/edit/${id}`);
  };

  const handleOpen = (id: string) => {
    setOpenItemId(id);
  };


  return (
    <div className=' relative w-full min-h-screen'>

      {showDeleteConfirmation !== null && <div className=' bg-[#00000023] z-[10] top-10 fixed center backdrop-blur-[10px] w-full h-full'>
        <div className=' bg-[#26253897] w-fit mx-auto mt-20 p-6 rounded-3xl shadow-lg'>
          <h2> Are you want to delete the Transaction ?</h2>
          <div className='flex justify-center gap-4 mt-4'>
            <button
              className='bg-red-600/20 border border-red-500 text-white px-4 py-2 rounded-lg'
              onClick={() => {
                deleteMutation.mutateAsync(showDeleteConfirmation!);
                setShowDeleteConfirmation(null);
              }}
            >
              Delete
            </button>
            <button
              className='border border-gray-500 text-white px-4 py-2 rounded-lg'
              onClick={() => setShowDeleteConfirmation(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>}
      <h1 className="text-center">Your Transactions {data?.length}</h1>
      <div className="flex flex-col gap-4 px-14 max-md:px-2.5 pt-10">
        <DateButton startDate={startDate} endDate={endDate} setStartDate={setStartDate} setEndDate={setEndDate} />
        {uniqueBanks && !isLoading ?
          <div className='flex w-full overflow-x-auto gap-2'>
            {uniqueBanks.map((i: { bank: string, creditAmount: number, credit: boolean, debit: boolean, debitAmount: number }, index: number) => {
              const balance = i.creditAmount - i.debitAmount;
              const percentage = i.creditAmount > 0 ? (balance / i.creditAmount) * 100 : 0;
              const isPositive = balance >= 0;

              return (
                <div key={index} className=' bg-gradient-to-br from-[#4477ef] shadow-xl font-medium to-[#1703d293] rounded-3xl flex flex-col !items-start !justify-start !w-[250px] p-4'>
                  <p className='w-full text-center   text-xl text-white font-bold'>{i.bank} </p>
                  {i.credit && <p className='w-full text-green-500'>Credit: ₹{i.creditAmount.toFixed(2)}</p>}
                  {i.debit && <p className='w-full text-red-500'>Debit: ₹{i.debitAmount.toFixed(2)}</p>}
                  <p className='w-full text-gray-100 flex items-center gap-2'>Total: {balance.toFixed(2)}{' '}</p>
                  {percentage ? <p className={`font-semibold ${isPositive ? "text-green-500" : " text-red-500"} center `}> {isPositive ? <TrendingUp size={20} /> : <TrendingDown size={20} />} {percentage.toFixed(2)}%</p> : ''}
                </div>
              );
            })}

          </div> : isLoading ?
            <Loading boxes={2} child="h-28 !w-[250px] h-[150px] !rounded-3xl " parent="w-full !flex-row px-0   !justify-start " /> : <p>No Data found</p>
        }

        {groupedMessages && Object.entries(groupedMessages).length !== 0 && !isLoading ? Object?.entries(groupedMessages).map(([label, group]) => (
          <div key={label}>
            <div className="text-center border bordercolor bg-[#262538] w-fit mx-auto rounded-full px-2 text-sm basecolor2 font-semibold my-4">{label}</div>
            {group?.map((msg: TransactionTypeProps) => (
              <SwipeRevealActions
                key={msg.id}
                id={msg.id}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
                isOpen={openItemId === msg.id}
                onOpen={handleOpen}
                setRef={setItemRef}
              >
                <div className="flex  card max-md:items-start justify-between items-center border bordercolor rounded-2xl p-4" key={msg.id}>
                  <div>
                    <p><strong>Amount:</strong> <span className='  text-xl font-bold'>₹{msg.amount.toFixed(2)}</span> </p>
                    <p className={`${msg.type === 'credit' ? ' text-green-500 ' : ' text-red-500 '} capitalize `}><strong>Type:</strong> {msg.type}</p>
                    <p><strong>Bank:</strong> {msg.bank}</p>

                    {msg?.send && <p><strong> {msg.type === 'credit' ? ' Send By ' : ' Send to'}   : </strong> {msg.send}</p>}
                    {msg?.spendsOn && <p><strong> {msg.type === 'credit' ? ' Recived on ' : ' Spends On '}   :</strong> {msg.spendsOn}</p>}
                    {msg?.category && <p><strong>Category:</strong> {msg.category}</p>}
                    <p><strong>Date:</strong> {moment(msg.date).format('MMMM Do YYYY, h:mm:ss a')}</p>
                  </div>
                </div>
              </SwipeRevealActions>

            ))}
          </div>
        )) : (
          isLoading ?
            <Loading boxes={5} child="h-28 max-md:h-[200px] w-full !rounded-3xl " parent="w-full px-0 mt-13 " /> : <p className='mt-20 text-lg center '>No data found</p>
        )}

      </div>
    </div>
  )
}

export default TransactionPage
