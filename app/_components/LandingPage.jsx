import React from 'react'
import HeaderLadingPage from './HeaderLadingPage'
import Heros from './Heros'
import Footer from './Footer'
import Navbar from './Navbar'

function LandingPage() {
  return (
    <div className='min-h-full flex flex-col'>
      <div className='flex flex-col items-center justify-center md:justify-start text-center gap-y-8 flex-1 px-6 pb-10'>
        <Navbar />

        <HeaderLadingPage />

        <Heros />
      </div>
      <Footer />
    </div>
  )
}

export default LandingPage