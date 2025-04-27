'use client'

import { db } from '@/config/firebaseConfig'
import { OrganizationSwitcher, useAuth, UserButton, useUser } from '@clerk/nextjs'
import { doc, setDoc } from 'firebase/firestore'
import React, { useEffect } from 'react'

function Header() {
  const { orgId } = useAuth()
  const { user } = useUser()

  useEffect(() => {
    user && saveUserData()
  }, [user])

  const saveUserData = async () => {
    const docId = user?.primaryEmailAddress?.emailAddress

    try {
      await setDoc(doc(db, 'MindCraftUsers', docId), {
        name: user?.fullName,
        avatar: user?.imageUrl,
        email: user?.primaryEmailAddress?.emailAddress
      })
    } catch (error) {

    }
  }

  return (
    <div className='flex justify-between items-center p-3 shadow-sm'>
      <div className='text-2xl font-extrabold'>
        MindCraft
      </div>

      <OrganizationSwitcher afterCreateOrganizationUrl={'/dashboard'} afterLeaveOrganizationUrl={'/dashboard'} />

      <UserButton />
    </div>
  )
}

export default Header