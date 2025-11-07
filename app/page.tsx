'use client'
import BankTrackerHero from '@/components/heropage'
import ShinyText from '@/components/ui/Shinetext';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

const Home =   () => {
  const { data, status } = useSession();
  if (status === 'loading') {
    return(
       <div className=' w-full h-screen center '>
      <ShinyText
        text="My Bank"
        disabled={false}
        speed={1.8}
        className='font-extrabold  text-5xl'
        />
    </div>
  )
  }

  if( data?.user || status === 'authenticated'){
    redirect('/transaction')
  }

  return (
    <BankTrackerHero status={data ? true : false}/>
  )
}

export default Home