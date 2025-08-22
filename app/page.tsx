
import BankTrackerHero from '@/components/heropage'
import { authOptions } from '@/lib/auth' 
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import React from 'react'

const MainHeroPage = async () => {
  const session =await getServerSession(authOptions)
  if(session){
    redirect('/transaction')
  }
  return (
    <BankTrackerHero status={session ? true : false}/>
  )
}

export default MainHeroPage