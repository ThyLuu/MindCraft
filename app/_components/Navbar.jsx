'use client'

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

function Navbar() {
  const router = useRouter()

  const [scrolled, setScrolled] = useState(false)
  const threshold = 50;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > threshold);
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const DashboardPage = () => {
    router.push('/dashboard')
  }  

  return (
    <div className={`z-50 bg-background fixed top-0 flex items-center w-full p-6 ${scrolled ? ' shadow-sm' : ''}`}>
      <div className='text-2xl font-bold ml-5'>
        MindCraft
      </div>

      <div className='md:ml-auto md:justify-end justify-between w-fuil flex items-center gap-x-2'>
        <Button onClick={() => DashboardPage()} className={'cursor-pointer'}>Login</Button>
      </div>
    </div>
  )
}

export default Navbar