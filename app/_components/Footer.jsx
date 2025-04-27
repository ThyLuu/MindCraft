import { Button } from '@/components/ui/button'
import React from 'react'

function Footer() {
    return (
        <div className='flex items-center w-full p-6 bg-background z-50'>
            <div className='text-xl font-bold ml-10'>
                MindCraft
            </div>

            <div className='md:ml-auto w-full justify-between md:justify-end flex items-center gap-x-2 text-muted-foreground'>
                @LuuThyThy
            </div>
        </div>
    )
}

export default Footer