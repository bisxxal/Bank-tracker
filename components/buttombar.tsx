import { ArrowLeftRight, ChartArea, ChartPie, Mail, User } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const BottomBar = () => {
    return (
        <div className=' fixed bottom-[25px]  w-full center h-[60px] '>
            <div className='w-fit  backdrop-blur-md p-2 rounded-2xl bg-[#d3d3d341] flex !justify-evenly items-center gap-10 h-full '>
                <Link className=' hover:-translate-y-3 hover:scale-[1.3] max-md:hover:scale-[none] hover:transition-all duration-300 ease-in-out px-3 py-3 center rounded-xl  backdrop-blur-3xl ' href={'/'}> <Mail /> </Link>
                <Link className=' hover:-translate-y-3 hover:scale-[1.3] max-md:hover:scale-[none] hover:transition-all duration-300 ease-in-out px-3 py-3 center rounded-xl  backdrop-blur-3xl ' href={'/transaction'}> <ArrowLeftRight /> </Link>
                <Link className=' hover:-translate-y-3 hover:scale-[1.3] max-md:hover:scale-[none] hover:transition-all duration-300 ease-in-out px-3 py-3 center rounded-xl  backdrop-blur-3xl ' href={'/track'}> <ChartPie /> </Link>
                <Link className=' hover:-translate-y-3 hover:scale-[1.3] max-md:hover:scale-[none] hover:transition-all duration-300 ease-in-out px-3 py-3 center rounded-xl  backdrop-blur-3xl ' href={'/profile'}> <User /> </Link>
            </div>
        </div>
    )
}

export default BottomBar