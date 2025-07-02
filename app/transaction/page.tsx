import { getTransactions } from '@/actions';
import { SyncButton } from '@/components/syncButton';  
import { getLabelForDate } from '@/lib/dateformat';  
import moment from 'moment';
import React from 'react'

const TransactionPage =async () => { 
 
    const transations = await getTransactions()


  const groupedMessages = transations.reduce((acc: Record<string, typeof transations>, msg) => {
    const label = getLabelForDate(msg?.date);
    if (!acc[label]) acc[label] = [];
    acc[label].push(msg);
    return acc;
  }, {});


  return (
    <div> 
      <h1 className="text-center">Your Transactions {transations.length}</h1>
      <div className="flex flex-col gap-4 px-20 pt-10">
         
<SyncButton />

         {Object.entries(groupedMessages).map(([label, group]) => (
          <div key={label}>
            <div className="text-center border border-white/30 w-fit mx-auto rounded-full px-2 text-sm text-gray-500 font-semibold my-4">{label}</div>
            {group.map((msg) => (
              <div className="flex mb-3 justify-between items-center border rounded-2xl p-4" key={msg.id}>
                <div>
              <p><strong>Type:</strong> {msg.type}</p>
              <p><strong>Bank:</strong> {msg.bank}</p>
              <p><strong>Amount:</strong> ₹{msg.amount.toFixed(2)}</p>
              <p><strong>Date:</strong> {moment(msg.date).format('MMMM Do YYYY, h:mm:ss a')}</p>
            </div>
            <div className="border h-full rounded-3xl mr-3 p-2 px-4 flex flex-col justify-between">
              <strong>ID:</strong> {msg.id}
            </div>
              </div>
            ))}
          </div>
        ))}

          </div>
    </div>
  )
}

export default TransactionPage