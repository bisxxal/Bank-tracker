'use client'
import { getTransactionsBySelected } from '@/actions';
import { useQuery } from '@tanstack/react-query';
import {   TrendingDown, TrendingUp  } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { Area, CartesianGrid, Pie, PieChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend, AreaChart, BarChart, Bar } from 'recharts'
import { startOfMonth, endOfMonth } from "date-fns";
import DateButton from '@/components/dateButton';
import moment from 'moment';
import Loading from '@/components/ui/loading';
import { COLORS, COLORS2 } from '@/lib/utils';
import { TransactionTypeProps } from '@/lib/types';
const TrackerPage = () => {
  const today = new Date();
  const [startDate, setStartDate] = useState<Date>(startOfMonth(today));
  const [endDate, setEndDate] = useState<Date>(endOfMonth(today));

  const [typedata, setTypeData] = useState<any[]>([]);
  const [bankData, setBankData] = useState<any[]>([]);
  const [barData, setBarData] = useState<any[]>([]);

  const { data, isLoading } = useQuery({
    queryKey: ['trackerData', startDate, endDate],
    queryFn: async () => {
      const res = await getTransactionsBySelected(startDate, endDate)
      return res
    }
  })

  useEffect(() => {
    if (data) {

      const revData = data.reduce((acc: {name:string ,  amount:number}[], curr:TransactionTypeProps) => {
        const type = curr?.type || 'Unknown';
        const existing = acc.find((item) => item.name === type);
        if (existing) {
          existing.amount += curr.amount;
        } else {
          acc.push({ name: type, amount: curr.amount });
        }
        return acc;
      }, []);

      const bankData = data?.reduce((acc: {name:string , amount:number}[], curr:TransactionTypeProps) => {
        const bank = curr?.bank || 'Unknown';
        const existing = acc.find((item) => item.name === bank);
        if (existing) {
          existing.amount += curr.amount;
        } else {
          acc.push({ name: bank, amount: curr.amount });
        }
        return acc;
      }, []);

      const barData =  data?.reduce((acc: {name:string ,credit:number,  debit:number}[], curr:TransactionTypeProps) => {
        const date = moment(curr.date).format('DD/MM/YYYY');
        const existing = acc.find((item) => item.name === date);
        if (existing) {
          if (curr.type === 'credit') {
            existing.credit += curr.amount;
          } else if (curr.type === 'debit') {
            existing.debit += curr.amount;
          }
        } else {
          acc.push({
            name: date,
            credit: curr.type === 'credit' ? curr.amount : 0,
            debit: curr.type === 'debit' ? curr.amount : 0,
          });
        }
        return acc;
      }, []);
      setBarData(barData);
      setTypeData(revData);
      setBankData(bankData);
    }

  }, [data, startDate, endDate])

  if (isLoading) {
    return <div className=' h-screen overflow-hidden  p-4'>
      
      <Loading child=' h-[150px] w-[300px] !rounded-3xl ' parent=' !mt-[75px] !flex !justify-evenly !flex-row !w-full !gap-3 !items-center !my-4' boxes={2} />
      <Loading child='flex flex-col max-md:w-full w-[420px] h-[320px]  !rounded-3xl items-center justify-center ' parent=' !my-6 !flex-row max-md:flex-col  !flex !justify-evenly !items-center !flex-wrap !gap-4' boxes={2} />
      <Loading child='flex flex-col max-md:w-full w-full h-[400px] rounded-3xl items-center justify-center ' parent=' !my-6 !flex-row max-md:flex-col  !flex !justify-evenly !items-center !flex-wrap !gap-4' boxes={1} />
    </div>;
  }
  const totalCredit = typedata.reduce((acc, curr) => curr.name === 'credit' ? acc + curr.amount : acc, 0);
  const totalDebit = typedata.reduce((acc, curr) => curr.name === 'debit' ? acc + curr.amount : acc, 0);
  return (
    <div className='w-full overflow-hidden min-h-screen pb-20 p-4'>
      <DateButton startDate={startDate} endDate={endDate} setStartDate={setStartDate} setEndDate={setEndDate} />
      <div>
        <div className='flex justify-evenly w-full flex-warp gap-3 items-center my-4'>
          <div className='flex flex-col items-center  creditbg   center  h-[150px] w-[300px] rounded-3xl'>
            <h2 className='max-md:text-sm center gap-1'>Total Credited: 
              <TrendingUp size={30} className="text-green-400" /> 
              </h2>
            <p className=' text-white max-md:text-2xl text-3xl font-bold'>₹{totalCredit.toFixed(2)}</p>
          </div>
          <div className='flex flex-col items-center   debitbg   center   h-[150px] w-[300px] rounded-3xl'>
            <h2 className='max-md:text-sm center gap-1'>
              <TrendingDown size={30} className="text-red-400" />
              Total Debited:
            </h2>
            <span className='text-white max-md:text-2xl text-3xl font-bold'>₹{totalDebit.toFixed(2)} </span>
          </div>
        </div>

         
      </div>

      <div className='my-6  flex justify-evenly items-center flex-wrap gap-4'>
        <div className='flex flex-col   max-md:w-full bg-[#262538] border py-3 px-2 bordercolor rounded-3xl items-center justify-center'>
          <h1>Credit vs Debit</h1>
          <PieChart width={400} height={300}>
            <Pie
              data={typedata}
              dataKey="amount"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              innerRadius={70}
              paddingAngle={5}
              fill="#E11D47"
              label={(entry) => `${entry.name} (${(entry).amount})`}
            >
              {typedata.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}

            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff20',
                color: 'white',
                borderRadius: '5px',
                backdropFilter: 'blur(10px)',
                border: '1px solid transparent',
              }}
              itemStyle={{
                color: 'white',
                fontWeight: 'bold',
              }} />
          </PieChart>
        </div>

        <div className='flex flex-col   max-md:w-full bg-[#262538] border px-2 py-3 bordercolor rounded-3xl items-center justify-center'>
          <p>Bank Transaction</p>
          <PieChart width={400} height={300}>
            <Pie
              data={bankData}
              dataKey="amount"
              nameKey="name"
              cx="50%"
              cy="50%"
               outerRadius={120}
              innerRadius={70}
              paddingAngle={5}
              fill="red"
              label={(entry) => `${entry.name}-(${(entry).amount})`}
            >
              {typedata.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS2[index % COLORS2.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff20',
                color: 'white',
                borderRadius: '5px',
                backdropFilter: 'blur(10px)',
                border: '1px solid transparent',
              }}
              itemStyle={{
                color: 'white',
                fontWeight: 'bold',
              }} />
          </PieChart>
        </div>
      </div>
      <div className=' w-full h-[400px] border bordercolor rounded-3xl mb-4 card p-2 px-4 max-md:px-1 max-md:tex-xs'>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart width={730} height={250} data={barData}>
            {/* <CartesianGrid strokeDasharray="0 0 " /> */}
            <XAxis dataKey="name" fontSize={10} />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff20',
                color: 'white',
                borderRadius: '5px',
                backdropFilter: 'blur(10px)',
                border: '1px solid transparent',
              }}
              itemStyle={{
                color: 'white',
                fontWeight: 'bold',
              }} />
            <Legend />
            <Bar dataKey="credit" fill="#cba6f7" name={'credit'} />
            <Bar dataKey="debit" fill="#ef1d5c" name={'debit'} />
          </BarChart>
        </ResponsiveContainer >

      </div>

      <div className=' w-full h-[400px] border bordercolor rounded-3xl mb-4 card p-2 px-4 max-md:px-1 max-md:tex-xs'>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart width={1200} height={400} data={barData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
             <linearGradient id="colorcredit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E11D47" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#D44D66" stopOpacity={0} />
              </linearGradient>

              <linearGradient id="colordebit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#23D824" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#23D824" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" stroke="#ffffff28" />
            <YAxis />
            <Legend align="center" verticalAlign="top" wrapperStyle={{ paddingTop: "20px", paddingBottom: "40px" }} />
            {/* <CartesianGrid strokeDasharray="0 0" stroke="#ffffff28" /> */}
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff20',
                color: 'white',
                borderRadius: '5px',
                backdropFilter: 'blur(10px)',
                border: '1px solid transparent',
              }}
              itemStyle={{
                color: '#E11D47',
                fontWeight: 'bold',
                fontSize: '15px',
              }} />
            <Area
              type="monotone"
              dataKey="credit"
              stroke="#23D824"
              fillOpacity={0.2}
              fill="url(#colordebit)"
              stackId="2"
               dot={{ fill: '#23D824', strokeWidth: 1, r: 3 }}
            />
            <Area
              type="monotone"
              dataKey="debit"
              stroke="#E11D47"
              fillOpacity={0.5}
              fill="url(#colorcredit)"
              stackId="1"
               dot={{ fill: '#E11D47', strokeWidth: 1, r: 3 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>


    </div>
  )
}

export default TrackerPage