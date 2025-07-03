import React from 'react'
import DatePicker from 'react-datepicker';

const DateButton = ({startDate , endDate , setEndDate , setStartDate}) => {
  return (
    <div className="flex w-full center flex-warp gap-4 max-md:gap-1 px-4 max-md:px-0 pt-2">
                   <div>
                       <label className="text-white text-sm mr-2">Start Date</label>
                       <DatePicker
                           selected={startDate}
                           onChange={(date: Date | null) => {
                               if (date) setStartDate(date);
                           }}
                           selectsStart
                           startDate={startDate}
                           endDate={endDate}
                           className="border-2 bordercolor w-[150px] center max-md:w-[120px] rounded-xl px-2 py-1  card text-white"
                           placeholderText="Select start date"
                       />
                   </div>
                   <div>
                       <label className="text-white text-sm mr-2">End Date</label>
                       <DatePicker
                           selected={endDate}
                           onChange={(date: Date | null) => {
                               if (date) setEndDate(date);
                           }}
                           selectsEnd
                           startDate={startDate}
                           endDate={endDate}
                           minDate={startDate}
                           className="border-2 bordercolor w-[150px] center max-md:w-[120px] rounded-xl px-2 py-1 card text-white"
                           placeholderText="Select end date"
                       />
                   </div>
               </div>
  )
}

export default DateButton