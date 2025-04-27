'use client'

import CoverPicker from '@/app/_components/CoverPicker'
import EmojiPickerComponent from '@/app/_components/EmojiPickerComponent'
import { db } from '@/config/firebaseConfig'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { SmilePlus } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

function DocumentInfo({ params }) {
    const [coverImage, setCoverImage] = useState('/cover1.png')
    const [emoji, setEmoji] = useState()
    const [documentInfo, setDocumentInfo] = useState()

    useEffect(() => {
        if (params?.value) {
            const parsedParams = JSON.parse(params.value);
            GetDocumentInfo(parsedParams.documentid);
            // console.log("Params:", parsedParams);
        }
    }, [params]);

    const GetDocumentInfo = async (documentid) => {
        const docRef = doc(db, 'workspaceDocuments', documentid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            // console.log("Document Data:", docSnap.data());
            setDocumentInfo(docSnap.data())
            setEmoji(docSnap.data()?.emoji)
            docSnap.data()?.coverImage && setCoverImage(docSnap.data()?.coverImage)
        };
    }

    const updateDocumentInfo = async (key, value) => {
        const parsedParams = params?.value ? JSON.parse(params.value) : null;
        const docRef = doc(db, 'workspaceDocuments', parsedParams?.documentid)
        await updateDoc(docRef, {
            [key]: value
        })
        toast('Document updated successfully')
    }

    return (
        <div>
            {/* Cover Image */}
            <CoverPicker setNewCover={(cover) => {
                setCoverImage(cover);
                updateDocumentInfo('coverImage', cover)
            }}>
                <div className='relative group'>
                    <h2 className='hidden absolute p-4 w-full h-full items-center justify-center group-hover:flex font-medium'>Update cover image</h2>

                    <div className='group-hover:opacity-50'>
                        <Image src={coverImage} width={400} height={400} alt='cover' className='w-full h-[200px] object-cover' />
                    </div>
                </div>
            </CoverPicker>

            {/* Emoji Picker */}
            <div className='absolute ml-10 px-20 mt-[-40px] cursor-pointer'>
                <EmojiPickerComponent setEmojiIcon={(emoji) => {
                    setEmoji(emoji);
                    updateDocumentInfo('emoji', emoji)
                }}>
                    <div className='bg-[#ffffffb0] p-4 rounded-md'>
                        {emoji ? <span className='text-5xl'>{emoji}</span> : <SmilePlus className='h-10 w-10 text-gray-500' />}
                    </div>
                </EmojiPickerComponent>
            </div>

            {/* File Name */}
            <div className='mt-10 px-20 ml-10 p-8'>
                <input
                    onBlur={(event) => updateDocumentInfo('documentName', event.target.value)}
                    type="text"
                    className="font-bold text-4xl outline-none leading-[1.5] min-h-[50px] pb-1"
                    placeholder="Untitled document"
                    defaultValue={documentInfo?.documentName}
                />
            </div>
        </div>
    )
}

export default DocumentInfo