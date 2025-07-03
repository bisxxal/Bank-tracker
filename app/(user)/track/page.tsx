'use client'
import { getTransactionsBySelected } from '@/actions';
import { useQuery } from '@tanstack/react-query';
import { ArrowDownLeft, ArrowDownRight, Loader } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { Area, CartesianGrid, Pie, PieChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend, AreaChart, BarChart, Bar } from 'recharts'
import { startOfMonth, endOfMonth } from "date-fns";
import { extractFromEmail } from '@/lib/utils';
import DateButton from '@/components/dateButton';
import moment from 'moment';
const TrackerPage = () => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  const COLORS2 = ['#d0ed57', '#a4de6c', '#8dd1e1', '#ffc658', '#ff8042',];
  const data2 = [
    {
      "name": "12/01/2023",
      "credit": 4000,
      "debit": 2400,
      "amount": 2400
    },
    {
      "name": "12/02/2023",
      "credit": 3000,
      "debit": 1398,
      "amount": 2210
    },
    {
      "name": "12/03/2023",
      "credit": 2000,
      "debit": 9800,
      "amount": 2290
    },
    {
      "name": "12/04/2023",
      "credit": 2780,
      "debit": 3908,
      "amount": 2000
    },
    {
      "name": "12/05/2023",
      "credit": 1890,
      "debit": 4800,
      "amount": 2181
    },
    {
      "name": "12/06/2023",
      "credit": 2390,
      "debit": 3800,
      "amount": 2500
    },
    {
      "name": "12/07/2023",
      "credit": 3490,
      "debit": 4300,
      "amount": 2100
    }
  ]
  // const [selectedYear, setSelectedYear] = useState(currentYear);
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
    <div className='w-full overflow-hidden min-h-screen p-4'>
      <DateButton startDate={startDate} endDate={endDate} setStartDate={setStartDate} setEndDate={setEndDate} />
      <div>
        <div className='flex justify-evenly w-full flex-warp gap-3 items-center my-4'>
          <div className='bg-green-600/10 border-green-500/80 border center text-white h-[150px] w-[300px] rounded-lg'>
            Total Credit: ₹{totalCredit.toFixed(2)}
            <ArrowDownLeft color='#00c951' size={30} />
          </div>
          <div className='bg-red-500/10 border border-red-500 center text-white h-[150px] w-[300px] rounded-lg'>
            <ArrowDownRight color='#fb2c36' size={30} />
            Total Debit: ₹{totalDebit.toFixed(2)}
          </div>
        </div>
      </div>

      {/* <ResponsiveContainer width="100%" height="50vh"> */}

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
         
          <div className=' w-full h-[400px] '>
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


        {
          data && data.map((item: any, index: number) => (
            <div key={index} className='bg-white/10 p-4 rounded-lg my-2'>
              <h1 className='text-lg font-semibold'>{item?.title}</h1>
              <p className='text-sm text-gray-400'>Date: {moment(item?.date).format('DD/MM/YYYY')}</p>
              <p className='text-sm text-gray-400'>Amount: ₹{item?.amount.toFixed(2)}</p>
              <p className='text-sm text-gray-400'>Type: {item?.type}</p>
              <p className='text-sm text-gray-400'>Bank: {extractFromEmail(item?.bank)}</p>
            </div>
          ))
        }

    </div>
  )
}

export default TrackerPage