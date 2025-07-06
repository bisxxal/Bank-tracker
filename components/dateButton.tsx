import { CircleEllipsis } from 'lucide-react';
import Link from 'next/link';
import React from 'react'
import DatePicker from 'react-datepicker';

const DateButton = ({ startDate, endDate, setEndDate, setStartDate }:
    { startDate: Date, endDate: Date, setEndDate: React.Dispatch<React.SetStateAction<Date>>, setStartDate: React.Dispatch<React.SetStateAction<Date>> }) => {
    return (
        <div className="flex w-full center !z-[2] flex-warp gap-4 max-md:gap-2 px-4 max-md:px-0 pt-2">
            <div className=' max-md:w-[120px]  '>
                <label className="text-white text-sm mr-2">Start Date</label>
                <DatePicker
                    selected={startDate}
                    onChange={(date: Date | null) => {
                        if (date) setStartDate(date);
                    }}
                    selectsStart
                    calendarClassName=' customclass '
                    startDate={startDate}
                    endDate={endDate}
                    popperClassName="customclass2"
                    className="border-2 !z-[2] bordercolor w-[150px] center max-md:w-[120px] rounded-xl px-2 py-1  card text-white"
                    placeholderText="Select start date"
                />
            </div>
            <div className=' max-md:w-[120px] '>
                <label className="text-white text-sm mr-2">End Date</label>
                <DatePicker
                    selected={endDate}
                    onChange={(date: Date | null) => {
                        if (date) setEndDate(date);
                    }}
                    calendarClassName='  customclass '
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    popperClassName="customclass2"
                    className="border-2 bordercolor w-[150px] center max-md:w-[120px] rounded-xl px-2 py-1 card text-white"
                    placeholderText="Select end date"
                />
            </div>

            <div className='relative group '>
                <label htmlFor='is'>
                    <p><CircleEllipsis className=' text-gray-100' size={20} /></p>
                </label>
                <input type="checkbox" hidden id="is" />
                <div className='group-has-checked:flex hidden  group-hover:  absolute  py-3.5 w-fit flex-col gap-2 border  text-white p-2 border-black/10 rounded-3xl bg-[#ffffff45] backdrop-blur-[5px] -left-[150px] '>
                    <Link className=' hover:bg-indigo-500 bg-[#00000031] py-2 rounded-xl hover:text-[#e6e2eb] text-[#ddcaf5] px-6' href={`/calendar`}> View Calender </Link>
                    <Link className=' hover:bg-indigo-500 bg-[#00000031] py-2 rounded-xl hover:text-[#e6e2eb] text-[#ddcaf5] px-6' href={`/category`}> View Category </Link>
                </div>
            </div>
        </div>
    )
}

export default DateButton