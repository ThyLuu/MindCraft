'use client'

import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import { Button } from '../../../components/ui/button'
import { Input } from "../../../components/ui/input"
import { Loader2Icon, SmilePlus } from 'lucide-react'
import CoverPicker from '../../_components/CoverPicker'
import EmojiPickerComponent from '../../_components/EmojiPickerComponent'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../../../config/firebaseConfig'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'

function RenameWorkspace() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const workspaceId = searchParams.get('workspaceid')

  // State hiện tại
  const [coverImage, setCoverImage] = useState('/cover1.png')
  const [workspaceName, setWorkspaceName] = useState('')
  const [emoji, setEmoji] = useState('')
  const [loading, setLoading] = useState(false)

  // State lưu dữ liệu ban đầu
  const [originalWorkspaceName, setOriginalWorkspaceName] = useState('')
  const [originalEmoji, setOriginalEmoji] = useState('')
  const [originalCoverImage, setOriginalCoverImage] = useState('')

  useEffect(() => {
    if (workspaceId) {
      GetWorkspaceInfo(workspaceId) // Lấy thông tin workspace từ Firestore
    }
  }, [workspaceId])

  const GetWorkspaceInfo = async (workspaceId) => {
    const docRef = doc(db, 'Workspace', workspaceId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const data = docSnap.data()
      setWorkspaceName(data.workspaceName)
      setEmoji(data.emoji)
      setOriginalWorkspaceName(data.workspaceName)
      setOriginalEmoji(data.emoji)
      if (data.coverImage) {
        setCoverImage(data.coverImage)
        setOriginalCoverImage(data.coverImage)
      }
    }
  }

  const handleUpdateWorkspace = async () => {
    if (workspaceName && emoji) {
      try {
        setLoading(true)
        const docRef = doc(db, 'Workspace', workspaceId)
        await updateDoc(docRef, {
          workspaceName,
          emoji,
          coverImage
        })
        router.push('/dashboard') // Điều hướng sau khi cập nhật thành công
      } catch (error) {
        console.error('Cập nhật workspace thất bại:', error)
        // Handle error theo ý bạn (ví dụ: hiển thị thông báo cho người dùng)
      } finally {
        setLoading(false)
      }
    }
  }

  // Kiểm tra xem có ít nhất 1 thông tin thay đổi không
  const isChanged =
    workspaceName !== originalWorkspaceName ||
    emoji !== originalEmoji ||
    coverImage !== originalCoverImage

  return (
    <div className='p-10 md:px-36 lg:px-64 xl:px-96 py-28'>
      <div className='shadow-2xl rounded-xl'>
        {/* Cover Image */}
        <CoverPicker setNewCover={(v) => setCoverImage(v)}>
          <div className='relative group'>
            <h2 className='hidden absolute p-4 w-full h-full items-center justify-center group-hover:flex font-medium'>
              Update cover image
            </h2>
            <div className='group-hover:opacity-50'>
              <Image
                src={coverImage}
                width={400}
                height={400}
                alt='cover'
                className='w-full h-[180px] object-cover rounded-t-xl'
              />
            </div>
          </div>
        </CoverPicker>

        {/* Input Section */}
        <div className='p-12'>
          <h2 className='font-medium text-xl'>Update workspace information</h2>
          <h2 className='text-sm mt-2'>
            You can change details such as the name, cover image, and emoji for this workspace.
          </h2>

          <div className='mt-8 flex gap-2 items-center'>
            <EmojiPickerComponent setEmojiIcon={(v) => setEmoji(v)}>
              <Button variant='outline'>{emoji ? emoji : <SmilePlus />}</Button>
            </EmojiPickerComponent>

            <Input
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              placeholder='Enter workspace name'
            />
          </div>

          <div className='mt-7 flex justify-end gap-6'>
            <Button
              disabled={!workspaceName?.length || !emoji || loading || !isChanged}
              onClick={handleUpdateWorkspace}
            >
              Update {loading && <Loader2Icon className='animate-spin ml-2' />}
            </Button>
            <Button onClick={() => router.push('/dashboard')} variant={'outline'}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RenameWorkspace
