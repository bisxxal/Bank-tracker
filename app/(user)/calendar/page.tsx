'use client'
import { getTransactionsBySelectedMonth } from '@/actions'
import Loading from '@/components/ui/loading'
import { TransactionTypeProps } from '@/lib/types'
import { useQuery } from '@tanstack/react-query'
import { ArrowDownLeft, ArrowDownRight } from 'lucide-react'
import moment from 'moment'
import React, { useEffect, useState } from 'react'

const CalendarPage = () => {
  const now = new Date()
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth())
  const [selectedYear, setSelectedYear] = useState(now.getFullYear())
  const [monthData, setMonthData] = useState<any[]>([])

  const { data, isLoading } = useQuery({
    queryKey: ['trackerDataMonth', selectedMonth, selectedYear],
    queryFn: async () => {
      const res = await getTransactionsBySelectedMonth(selectedMonth, selectedYear)
      return res
    }
  })

  useEffect(() => {
    if (data) {
      const revData = data?.reduce((acc: { name: string, amount: number, date: Date | string }[], curr: TransactionTypeProps) => {
        const type = curr?.type || 'Unknown';
        const date = moment(curr.date).format("YYYY-MM-DD");
        const existing = acc.find(
          (item) => item.name === type && item.date === date
        );
        if (existing) {
          existing.amount += curr.amount;
        } else {
          acc.push({ name: type, date, amount: curr.amount });
        }
        return acc;
      }, []);
      setMonthData(revData);
    }
  }, [data, selectedMonth, selectedYear]);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const getDaysInMonth = (month: number, year: number) => {
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    const days = []

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} />)
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const isToday =
        d === now.getDate() &&
        month === now.getMonth() &&
        year === now.getFullYear()

      days.push(
        !isLoading ?
          <div
            key={d}
            className={`text-center mt-2 max-md:mt-0 rounded-lg max-md:rounded-none w-full  h-40 max-md:h-28  flex flex-col hover:border-[white] items-start 
              ${isToday ? 'bg-blue-50 buttonbg text-white font-bold' : 'border hover:bg-[#181825] bg-[#1E1E2E] bordercolor   '
              }`}
          >
            <h1 className='items-start px-2 pt-1 justify-start w-ful h-1/2 font-extrabold text-4xl max-md:text-xl'>  {d}</h1>
            <div className='h-1/2 w-full p-2  justify-end flex flex-col items-end items-cente'>
              {monthData
                .filter((item) => moment(item.date).date() === d)
                .map((item, index) => (
                  <div key={index} className={`${item.name === 'credit' ? " text-green-500" : " text-red-500"} text-base items-center flex gap-1 max-md:gap-0.5 max-md:text-xs text-gray-190 `}>
                    {item.name === 'debit' && <ArrowDownRight className=' block max-md:hidden' color='#fb2c36' size={19} />} {item.amount} {item.name === 'credit' && <ArrowDownLeft className=' block max-md:hidden' color='#00c951' size={19} />}
                  </div>
                ))}
            </div>
          </div> : <Loading boxes={1} parent='items-start w-full' child='w-full h-40 max-md:h-28 max-md:rounded-none rounded-lg mt-2 max-md:mt-0 ' />
      )
    }

    return days
  }

  return (
    <div className=' pb-20 w-full min-h-screen'>
      <div className=" overflow-x-auto">
        <div className="flex  w-[90%] max-md:w-full mx-auto  justify-between items-center p-4">
          <h2 className="text-3xl max-md:lg font-bold">
            {new Date(selectedYear, selectedMonth).toLocaleString('default', {
              month: 'long',
            })}{' '}
            {selectedYear}
          </h2>
        </div>

        <div className="p-4 flex flex-wrap justify-between items-center gap-4 w-[90%] max-md:w-full mx-auto ">

          <div className='flex gap-2 items-center'>
            <select
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              value={selectedMonth}
              name="month"
              className="border bordercolor rounded-xl p-2"
            >
              {Array.from({ length: 12 }, (_, i) => {
                const monthName = new Date(0, i).toLocaleString('default', {
                  month: 'long',
                })
                return (
                  <option key={i} value={i}>
                    {monthName}
                  </option>
                )
              })}
            </select>

            <select
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              value={selectedYear}
              name="year"
              className="border bordercolor rounded-xl p-2"
            >
              {Array.from({ length: 6 }, (_, i) => {
                const year = now.getFullYear() - 5 + i
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                )
              })}
            </select>
          </div>

          <div className=' max-md:w-full  flex gap-2 items-center'>
            <div className='flex flex-col items-center bg-green-600/10 border-green-500/80 border creditbg center max-md:w-[170px] h-[60px] w-[150px] rounded-xl'>
              <h2 className='max-md:text-sm center gap-2'>Total Credited </h2>

              <p className='    max-md:text-lg text-xl font-bold'> ₹{monthData
                .filter(item => item.name === 'credit')
                .reduce((acc, curr) => acc + curr.amount, 0)
                .toFixed(2)}</p>
            </div>
            <div className='flex flex-col items-center bg-red-500/10 debitbg border border-red-500 center max-md:w-[170px]  h-[60px] w-[150px] rounded-xl'>
              <h2 className='max-md:text-sm center gap-2'>
                Total Debited
              </h2>
              <span className=' max-md:text-lg text-xl font-bold'>₹{monthData
                .filter(item => item.name === 'debit')
                .reduce((acc, curr) => acc + curr.amount, 0)
                .toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="grid  grid-cols-7 place-items-center w-[90%] max-md:w-full mx-auto  gap-x-2  max-md:gap-x-0  p-4 max-md:p-1">
          {daysOfWeek.map((day) => (
            <div
              key={day}
              className="font-semibold w-full h-10 card bordercolor center rounded  max-md:rounded-none border  max-md:mb-2 text-gray-400"
            >
              {day}
            </div>
          ))}
          {getDaysInMonth(selectedMonth, selectedYear)}
        </div>
      </div>
    </div>
  )
}

export default CalendarPage

