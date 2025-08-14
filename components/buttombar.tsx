'use client'
import { ArrowLeftRight, Calendar, ChartLine, Mail, User, Wallet } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const BottomBar = () => {
    const bgs = 'bg-gradient-to-r from-[#2b7fff] to-[#ad46ff] '
    const path = usePathname()
    console.log(path)
    return (
        <div className=' fixed bottom-[20px] z-[100] w-full center h-[60px] '>
            <div className='w-fit  backdrop-blur-[10px] p-2 rounded-2xl bg border border-[#d3d3d346] flex !justify-evenly items-center gap-5 h-full '>
                <Link className={`${path === `/transaction` ? bgs : " bg-[#66677575] " } hover:-translate-y-3 hover:scale-[1.3] max-md:hover:scale-[none] hover:transition-all duration-300 ease-in-out px-3 py-3 center rounded-xl  `} href={'/transaction'}> <ArrowLeftRight /> </Link>
                <Link className={`${path === `/track` ? bgs : "bg-[#66677575]" } hover:-translate-y-3 hover:scale-[1.3] max-md:hover:scale-[none] hover:transition-all duration-300 ease-in-out px-3 py-3 center rounded-xl  `} href={'/track'}>  <ChartLine /> </Link>
                <Link className={`${path === `/calendar` ? bgs : "bg-[#66677575]" } hover:-translate-y-3 hover:scale-[1.3] max-md:hover:scale-[none] hover:transition-all duration-300 ease-in-out px-3 py-3 center rounded-xl  `} href={'/calendar'}> <Calendar /> </Link>
                <Link className={`${path === `/category` ? bgs : "bg-[#66677575]" } hover:-translate-y-3 hover:scale-[1.3] max-md:hover:scale-[none] hover:transition-all duration-300 ease-in-out px-3 py-3 center rounded-xl  `} href={'/category'}> <Wallet /> </Link>
                <Link className={`${path === `/profile` ? bgs : "bg-[#66677575]" } hover:-translate-y-3 hover:scale-[1.3] max-md:hover:scale-[none] hover:transition-all duration-300 ease-in-out px-3 py-3 center rounded-xl  `} href={'/profile'}> <User /> </Link>
            </div>
        </div>
    )
}

export default BottomBar