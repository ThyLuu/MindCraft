'use client'

import Image from 'next/image'
import React, { useState } from 'react'
import { Button } from '../../../components/ui/button'
import { Input } from "../../../components/ui/input"
import { Loader2Icon, SmilePlus } from 'lucide-react'
import CoverPicker from '../../_components/CoverPicker'
import EmojiPickerComponent from '../../_components/EmojiPickerComponent'
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../../config/firebaseConfig';
import { useUser } from '@clerk/nextjs'
import { useAuth } from '@clerk/clerk-react'
import { useRouter } from 'next/navigation'
import uuid4 from 'uuid4'

function CreateWorkspace() {
  const router = useRouter()

  const [coverImage, setCoverImage] = useState('/cover1.png')
  const [workspaceName, setWorkspaceName] = useState()
  const [emoji, setEmoji] = useState()

  const [loading, setLoading] = useState()

  const { user } = useUser()
  const { orgId } = useAuth()

  //Hàm tạo workspace
  const OnCreateWorkspace = async () => {
    setLoading(true)
    const workspaceId = Date.now()

    const result = await setDoc(doc(db, 'Workspace', workspaceId.toString()), {
      workspaceName: workspaceName,
      emoji: emoji,
      coverImage: coverImage,
      createdBy: user?.primaryEmailAddress?.emailAddress,
      id: workspaceId,
      orgId: orgId ? orgId : user?.primaryEmailAddress?.emailAddress
    })

    const docId = uuid4()

    await setDoc(doc(db, 'workspaceDocuments', docId.toString()), {
      workspaceId: workspaceId,
      createdBy: user?.primaryEmailAddress?.emailAddress,
      coverImage: null,
      emoji: null,
      id: docId,
      documentName: 'Untitled document',
      documentOutput: []
    })

    await setDoc(doc(db, 'documentOutput', docId.toString()), {
      docId: docId,
      documentOutput: []
    })

    setLoading(false)
    router.replace('/workspace/' + workspaceId + '/' + docId)
    // console.log("dữ liệu đã đc lưu")
  }

  const DashboardPage = () => {
    router.push("/dashboard")
  }

  return (
    <div className='p-10 md:px-36 lg-px-64 xl:px-96 py-28'>
      <div className='shadow-2xl rounded-xl'>
        {/* Cover Image */}
        <CoverPicker setNewCover={(v) => setCoverImage(v)}>
          <div className='relative group'>
            <h2 className='hidden absolute p-4 w-full h-full items-center justify-center group-hover:flex font-medium'>Update cover image</h2>

            <div className='group-hover:opacity-50'>
              <Image src={coverImage} width={400} height={400} alt='cover' className='w-full h-[180px] object-cover rounded-t-xl' />
            </div>
          </div>
        </CoverPicker>


        {/* Input Section */}
        <div className='p-12'>
          <h2 className='font-medium text-xl'>Create a new workspace</h2>
          <h2 className='text-sm mt-2'>This is a shared space where you can collaborate with your team.</h2>

          <div className='mt-8 flex gap-2 items-center'>
            <EmojiPickerComponent setEmojiIcon={(v) => setEmoji(v)}>
              <Button variant='outline'>
                {emoji ? emoji : <SmilePlus />}
              </Button>
            </EmojiPickerComponent>

            <Input onChange={(e) => setWorkspaceName(e.target.value)} placeholder='Enter workspace name' />
          </div>

          <div className='mt-7 flex justify-end gap-6'>
            <Button onClick={OnCreateWorkspace} disabled={!workspaceName?.length || !emoji || loading}>
              Create {loading && <Loader2Icon className='animate-spin ml-2' />}
            </Button>
            <Button onClick={() => DashboardPage()} variant={'outline'}>Cancel</Button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default CreateWorkspace