'use client'

import { Button } from '@/components/ui/button'
import { db } from '@/config/firebaseConfig'
import { collection, doc, onSnapshot, query, setDoc, where } from 'firebase/firestore'
import { Bell, Loader2Icon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import DocumentList from './DocumentList'
import uuid4 from 'uuid4'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import NotifiationBox from './NotificationBox'

const MAX_FILE = process.env.NEXT_PUBLIC_MAX_FILE_COUNT;

function SideNav({ params }) {
    const { user } = useUser()
    const router = useRouter()

    const [documentList, setDocumentList] = useState([])
    const [loading, setLoading] = useState(false)

    const parsedParams = params?.value ? JSON.parse(params.value) : params;

    useEffect(() => {
        if (params?.value) {
            // console.log("params: ", parsedParams);
            parsedParams && GetDocumentList(parsedParams);
        }
    }, [params]);

    //Lấy danh sách Document
    const GetDocumentList = (parsedParams) => {
        const workspaceId = Number(parsedParams?.workspaceid);
        // console.log("📥 Lấy danh sách tài liệu cho workspace:", workspaceId);

        const q = query(collection(db, 'workspaceDocuments'), where('workspaceId', '==', workspaceId));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const documents = querySnapshot.docs.map(doc => doc.data());

            // console.log("📄 Danh sách tài liệu nhận được:", documents); 

            setDocumentList(documents);
        });

        return unsubscribe;
    };

    const CreateNewDocument = async () => {
        setLoading(true);
        const docId = uuid4();

        if (documentList?.length >= MAX_FILE) {
            toast("Oops! You've used all 10 documents")
            return
        }

        // Giải mã params.value để lấy workspaceId
        const parsedParams = params?.value ? JSON.parse(params.value) : {};
        const workspaceId = Number(parsedParams?.workspaceid); // Chuyển thành số

        await setDoc(doc(db, 'workspaceDocuments', docId.toString()), {
            workspaceId: workspaceId,
            createdBy: user?.primaryEmailAddress?.emailAddress,
            coverImage: null,
            emoji: null,
            id: docId,
            documentName: 'Untitled document',
            documentOutput: []
        });

        await setDoc(doc(db, 'documentOutput', docId.toString()), {
            docId: docId,
            documentOutput: []
        })

        setLoading(false);
        router.replace(`/workspace/${workspaceId}/${docId}`);
    };

    const DashboardPage = () => {
        router.push("/dashboard")
    }

    return (
        <div className='h-screen md:w-72 hidden md:block fixed p-3 shadow-md'>
            <div className='flex justify-between items-center'>
                <div onClick={() => DashboardPage()} className='text-2xl font-extrabold cursor-pointer'>
                    MindCraft
                </div>

                <NotifiationBox>
                    <Bell className='h-5 w-5 text-gray-500' />
                </NotifiationBox>
            </div>

            <hr className='my-5'></hr>

            <div>
                <div className='flex justify-between items-center'>
                    <h2 className='font-medium'>Workspace</h2>
                    <Button onClick={CreateNewDocument} size={'sm'}> {loading ? <Loader2Icon className='h-4 w-4 animate-spin' /> : '+'}</Button>
                </div>
            </div>

            {/* Document List */}
            <DocumentList
                documentList={documentList}
                params={parsedParams}
            />

            {/* Progress Bar */}
            <div className='absolute bottom-10 w-[85%]'>
                <Progress value={(documentList?.length / MAX_FILE) * 100} />
                <h2 className='text-sm font-mono my-2'><strong>{documentList?.length}</strong>/<strong>10</strong> documents have been used</h2>
            </div>
        </div>
    )
}

export default SideNav