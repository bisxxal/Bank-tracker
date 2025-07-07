import Transations from '@/components/transations';
import { getLabelForDate } from '@/lib/dateformat';
import { getBankEmails } from '@/lib/gmail';
import { extractFromEmail } from '@/lib/utils';
import moment from 'moment';
import React from 'react'

const MailPage = async() => {
    const {results:messages , banks } = await getBankEmails();
  
  const groupedMessages = messages.reduce((acc: Record<string, typeof messages>, msg) => {
    const label = getLabelForDate(msg?.date);
    if (!acc[label]) acc[label] = [];
    acc[label].push(msg);
    return acc;
  }, {});

  return (
     <div>
      <h1 className=" text-center ">Your Transactions {messages.length}</h1>
      <div className=" flex gap-5 w-fit mx-auto  border border-blue-500 bg-blue-600/30 justify-evenly items-center px-20   rounded-2xl">
       
        {
          banks?.map((bank: { name: string; mailId: string }) => {
            const matchingMessages = messages?.filter((msg) => {
              const from = extractFromEmail(msg.from);
              return from && bank.name && from.toLowerCase().includes(bank.name.toLowerCase());
            }) || [];

            return (
              <div key={bank.mailId} className="text-center  text-sm font-semibold my-2">
                <p>{bank.name}</p>
                <p className=' text-2xl'>{matchingMessages.length}</p>
              </div>
            );
          })
        }
      </div>
      <div className=" flex flex-col gap-4 px-20 max-md:px-2 pt-10">
        {Object.entries(groupedMessages) ? Object.entries(groupedMessages).map(([label, group]) => (
          <div key={label}>
            <div className="text-center border border-white/30 w-fit mx-auto rounded-full px-2 text-sm text-gray-500 font-semibold my-4">{label}</div>
            {group.map((msg) => (
              <div className="flex mb-3 max-md:flex-col   bordercolor card justify-between items-center border rounded-2xl p-4" key={msg.id}>
                <div>
                  <p><strong>Subject:</strong> {msg.subject}</p>
                  <p><strong>Body:</strong> {msg.body}</p>
                  <p><strong>id:</strong> {msg.id}</p>
                  <p><strong>Mail Id:</strong> {msg.from}</p>
                  <p><strong>Date:</strong> {moment(msg.date).format('MMMM Do YYYY, h:mm:ss a')}</p>
                </div>
                <div className=" flex flex-col justify-between max-md:mt-3  gap-2">
                  <div className="border max-md:w-full bg-[#262538] h-full rounded-2xl mr-3 p-2 px-4 flex flex-col justify-between">
                  <strong>Bank:</strong> {extractFromEmail(msg.from)}
                </div>
                <Transations body={msg.body} />
                </div>
              </div>
            ))}
          </div>
        )): <p>No mail found </p> }

      </div>
    </div>
  )
}

export default MailPage