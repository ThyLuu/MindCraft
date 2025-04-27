'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

function HeaderLadingPage() {
  const router = useRouter()

  const IntroducePage = () => {
    router.push('/introduce')
  }

  return (
    <div className='mt-[100px] sm:mt-[50px] md:mt-[100px] lg:mt-[150px] max-w-5xl space-y-4'>
      <h1 className='text-3xl sm:text-5xl md:text-6xl font-bold leading-[1.2]'>
        Your ideas, documents, and plans — all connected. Welcome to <span className='underline'>MindCraft</span>
      </h1>

      <h3 className='text-base sm:text-xl md:text-2xl font-medium'>
        MindCraft — the collaborative online workspace,
        <br />
        where work gets done better and faster.

      </h3>

      <Button onClick={() => IntroducePage()} className={'cursor-pointer'}>
        Get started
        <ArrowRight className='h-4 w-4 ml-2' />
      </Button>
    </div>
  )
}

export default HeaderLadingPage