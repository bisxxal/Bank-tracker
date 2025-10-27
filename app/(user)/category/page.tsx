'use client'
import { getTransactionsBySelectedMonth } from '@/actions'
import Download from '@/components/dowload'
import Loading from '@/components/ui/loading'
import { TransactionTypeProps } from '@/lib/types'
import { categories, COLORS, COLORS2 } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { Cell, Pie, PieChart, Tooltip } from 'recharts'

const CateGoryPage = () => {
    const now = new Date()
    const [selectedMonth, setSelectedMonth] = useState(now.getMonth())
    const [selectedYear, setSelectedYear] = useState(now.getFullYear())
    const [categoryData, setCategoryData] = useState<any[]>([])

    const { data, isLoading } = useQuery({
        queryKey: ['trackerDataMonth', selectedMonth, selectedYear],
        queryFn: async () => {
            const res = await getTransactionsBySelectedMonth(selectedMonth, selectedYear)
            return res
        }
    })

    useEffect(() => {
        if (data) {
            const revData = data?.reduce((acc: { name: string, amount: number, category: string, date: Date | string }[], curr: TransactionTypeProps) => {
                const type = curr?.type || 'Unknown';
                const date = moment(curr.date).format("YYYY-MM-DD");
                const category = curr.category ?? 'Others'; // Handle null or undefined category

                const existing = acc.find(
                    (item) => item.name === 'debit' && item.category === category
                );

                if (existing) {
                    existing.amount += curr.amount;
                } else {
                    if (type === 'debit') {
                        acc.push({ name: type, date, amount: curr.amount, category });
                    }
                }
                return acc;
            }, []);

            setCategoryData(revData);
        }
    }, [data, selectedMonth, selectedYear]);
    const totalAmount = categoryData.reduce((acc, curr) => acc + curr.amount, 0);

    const sortedCategories = categories
        .map((category) => {
            const categoryTotal = categoryData.reduce((acc, curr) => {
                const currCategory = curr.category ?? 'Others';
                return currCategory === category.value ? acc + curr.amount : acc;
            }, 0);

            const percentage = totalAmount > 0 ? (categoryTotal / totalAmount) * 100 : 0;

            return {
                ...category,
                total: categoryTotal,
                percentage,
            };
        })
        .sort((a, b) => b.percentage - a.percentage);
    return (
        <div id='receipt' className='w-full min-h-screen bg-[#181825] flex flex-col px-10 max-md:px-4 pb-20'>
            <Download text={`MyBank-${new Date(selectedYear, selectedMonth).toLocaleString('default', { month: 'long', })}_${selectedYear}`} />

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
            </div>
            <div className='flex max-md:flex-col min-h-[300px] overflow-hidden max-md:w-full bg-[#262538 card border py-3 px-2 bordercolor rounded-3xl items-center justify-around'>


                {!isLoading && categoryData ?
                    <PieChart width={400} height={300}>
                        <Pie
                            data={categoryData}
                            dataKey="amount"
                            nameKey="category"
                            cx="50%"
                            cy="50%"
                            outerRadius={120}
                            innerRadius={70}
                            paddingAngle={5}
                            fill="#8884d8"
                            label={(entry) => `${entry.category} ${((entry.amount / totalAmount) * 100).toFixed(2)}%`}
                        >
                            {categoryData.map((_, index) => (
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
                    </PieChart> :
                    isLoading ?
                        <Loading parent='w-full mt-[50px] ' boxes={1} child='w-[260px] h-[260px]  border bordercolor text-sm !rounded-full' />
                        : categoryData.length === 0 && <p>No data found</p>
                }
                {!isLoading ? <div className=' w-[260px] max-md:w-full max-md:flex-wrap max-md:flex'>

                    {categoryData.map((category, index) => {
                        if (category.total === 0) return null;
                        return (
                            <div
                                key={index}
                                className=" w-full max-md:w-1/2 flex items-center !text-sm gap-3 rounded-2xl my-1 px-4 max-md:py-0"
                            >
                                <div style={{ background: COLORS[index % COLORS.length] }} className="flex h-4 w-4 rounded justify-between items-center mb-2"></div>
                                <div className="flex justify-between items-center mb-2">
                                    <h1 className="text-[white] center gap-1 w-full font-medium">{category.category}   ₹{category.amount}</h1>
                                </div>
                            </div>

                        )

                    })}
                </div> : <Loading parent='w-full mt-[50px] max-md:flex-row ' boxes={3} child='w-[250px] max-md:w-1/2 h-[30px] rounded-xl' />}
            </div>

            <h2 className=' mt-5  font-bold text-xl'>Top list</h2>
            {sortedCategories.map((category) => (
                <div
                    key={category.value}
                    className="bg-[#262538] border bordercolor rounded-2xl my-2 px-4 py-3"
                >
                    <div className="flex justify-between items-center mb-2">
                        <h1 className="text-[white] font-medium">{category.name}</h1>
                        <h1 className="text-[white] font-medium">
                            {category.percentage.toFixed(2)} %
                        </h1>
                    </div>
                    <div className="w-full h-3 bg-[#3b3a53] rounded-full">
                        {!isLoading ? (
                            <div
                                className="h-full buttonbg rounded-full transition-all duration-300"
                                style={{ width: `${category.percentage}%` }}
                            ></div>
                        ) : (
                            <Loading
                                parent="w-full h-3"
                                boxes={1}
                                child="w-full h-full !rounded-full"
                            />
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default CateGoryPage