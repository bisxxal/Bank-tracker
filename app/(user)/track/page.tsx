'use client'
import { getTransactionsBySelected } from '@/actions';
import { useQuery } from '@tanstack/react-query';
import { ArrowDownLeft, ArrowDownRight, Loader } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { Area, CartesianGrid, Pie, PieChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend, AreaChart, BarChart, Bar } from 'recharts'
import { startOfMonth, endOfMonth } from "date-fns";
import DateButton from '@/components/dateButton';
import moment from 'moment';
const TrackerPage = () => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  const COLORS2 = ['#d0ed57', '#a4de6c', '#8dd1e1', '#ffc658', '#ff8042',];
    
  const today = new Date();
  const [startDate, setStartDate] = useState<Date>(startOfMonth(today));
  const [endDate, setEndDate] = useState<Date>(endOfMonth(today));

  const [typedata, setTypeData] = useState<any[]>([]);
  const [bankData, setBankData] = useState<any[]>([]);
  const [barData, setBarData] = useState<any[]>([]);

  // const quary  = new QueryClient()
  const { data, isLoading, error } = useQuery({
    queryKey: ['trackerData', startDate, endDate],
    queryFn: async () => {
      const res = await getTransactionsBySelected(startDate, endDate)

      return res
    }
  })

  useEffect(() => {
    if (data) {

      const revData = data.reduce((acc: any[], curr) => {
        const type = curr?.type || 'Unknown';
        const existing = acc.find((item) => item.name === type);
        if (existing) {
          existing.amount += curr.amount;
        } else {
          acc.push({ name: type, amount: curr.amount });
        }
        return acc;
      }, []);

      const bankData = data.reduce((acc: any[], curr) => {
        const bank = curr?.bank || 'Unknown';
        const existing = acc.find((item) => item.name === bank);
        if (existing) {
          existing.amount += curr.amount;
        } else {
          acc.push({ name: bank, amount: curr.amount });
        }
        return acc;
      }, []);

      const barData = data.reduce((acc: any[], curr) => {
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

      console.log(barData, "Bar data")
      setTypeData(revData);
      setBankData(bankData);
    }

  }, [data, startDate, endDate])

  if (isLoading) {
    return <div className=' h-screen center'><Loader className=' animate-spin ' /></div>;
  }
  const totalCredit = typedata.reduce((acc, curr) => curr.name === 'credit' ? acc + curr.amount : acc, 0);
  const totalDebit = typedata.reduce((acc, curr) => curr.name === 'debit' ? acc + curr.amount : acc, 0);

  return (
    <div className='w-full overflow-hidden min-h-screen pb-20 p-4'>
      <DateButton startDate={startDate} endDate={endDate} setStartDate={setStartDate} setEndDate={setEndDate} />
      <div>
        <div className='flex justify-evenly w-full flex-warp gap-3 items-center my-4'>
          <div className='flex flex-col items-center bg-green-600/10 border-green-500/80 border center text-white h-[150px] w-[300px] rounded-3xl'>
          <h2 className=' center gap-2'>Total Credit: <ArrowDownLeft color='#00c951' size={30} /></h2>
            <p className=' text-2xl font-bold'>₹{totalCredit.toFixed(2)}</p>
          </div>
          <div className='flex flex-col items-center bg-red-500/10 border border-red-500 center text-white h-[150px] w-[300px] rounded-3xl'>
            <h2 className=' center gap-2'>
            <ArrowDownRight color='#fb2c36' size={30} />
            Total Debit:
            </h2>
             <span className=' text-2xl font-bold'>₹{totalDebit.toFixed(2)} </span> 
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
              outerRadius={100}
              fill="#8884d8"
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
              outerRadius={100}
              fill="red"
              label={(entry) => `${entry.name}-(${(entry).amount})`}
            >
              {typedata.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS2[index % COLORS.length]} />
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

      <div className=' w-full h-[400px] border bordercolor rounded-3xl mb-4 card p-2 px-4'>
         <ResponsiveContainer width="100%" height="100%">
        <BarChart width={730} height={250} data={barData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
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
         
          <div className=' w-full h-[400px] border bordercolor rounded-3xl mb-4 card p-2 px-4'>
           <ResponsiveContainer width="100%" height="100%">
        <AreaChart width={1200} height={400}
          data={barData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
          <CartesianGrid strokeDasharray="1 1" stroke="#ffffff28" />
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
            dataKey="debit"
            stroke="#23D824"
            fillOpacity={0.2}
            fill="url(#colordebit)"
            stackId="2"
          />
          <Area
            type="monotone"
            dataKey="credit"
            stroke="#E11D47"
            fillOpacity={0.5}
            fill="url(#colorcredit)"
            stackId="1"
          />
        </AreaChart>
        </ResponsiveContainer>
         </div>

     
    </div>
  )
}

export default TrackerPage