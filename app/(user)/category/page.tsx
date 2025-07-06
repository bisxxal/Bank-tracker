'use client'
import { getTransactionsBySelectedMonth } from '@/actions'
import Loading from '@/components/ui/loading'
import { categories } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { Cell, Pie, PieChart, Tooltip } from 'recharts'

const CateGoryPage = () => {
    const COLORS2 = ['#d0ed57', '#a4de6c', '#8dd1e1', '#ffc658', '#ff8042',];
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
            const revData = data?.reduce((acc: { type: string, name: string, amount: number, category: string, date: Date | string }[], curr) => {
                const type = curr?.type || 'Unknown';
                const date = moment(curr.date).format("YYYY-MM-DD");
                const existing = acc.find(
                    (item) => item.name === 'debit' && item?.category === curr.category
                );
                if (existing) {
                    existing.amount += curr.amount;
                } else {
                    if (type === 'debit') {
                        acc.push({ name: type, date, amount: curr.amount, category: curr.category });
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
                return curr.category === category.value ? acc + curr.amount : acc;
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
        <div className='w-full min-h-screen flex flex-col px-10 max-md:px-4 pb-20'>
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
            <div className='flex flex-col min-h-[300px] overflow-hidden max-md:w-full bg-[#262538] border py-3 px-2 bordercolor rounded-3xl items-center justify-center'>
                {!isLoading && categoryData ? <PieChart width={400} height={300}>
                    <Pie
                        data={categoryData}
                        dataKey="amount"
                        nameKey="category"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        label={(entry) => `${entry.category}  ${((entry.amount / totalAmount) * 100).toFixed(2)}%`}
                    >
                        {categoryData.map((_, index) => (
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
                </PieChart> :
                    isLoading ?
                        <Loading parent='w-full mt-[50px] ' boxes={1} child='w-[210px] h-[200px] !rounded-full' />
                        : categoryData.length === 0 && <p>No data found</p>
                }
            </div>

            <h2 className=' mt-5  font-bold text-xl'>Top list</h2>
            {sortedCategories.map((category) => (
                <div
                    key={category.value}
                    className="bg-[#262538] border bordercolor rounded-2xl my-2 px-4 py-3"
                >
                    <div className="flex justify-between items-center mb-2">
                        <h1 className="text-white font-medium">{category.name}</h1>
                        <h1 className="text-white font-medium">
                            {category.percentage.toFixed(2)} %
                        </h1>
                    </div>
                    <div className="w-full h-3 bg-[#3b3a53] rounded-full">
                        {!isLoading ? (
                            <div
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
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