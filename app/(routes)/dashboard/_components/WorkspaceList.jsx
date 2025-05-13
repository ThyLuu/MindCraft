'use client'

import { Button } from '../../../../components/ui/button'
import { useAuth, useUser } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import WorkspaceItemList from './WorkspaceItemList'
import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore'
import { db } from '@/config/firebaseConfig'
import { toast } from 'sonner'

function WorkSpaceList() {
    const { user } = useUser()
    const { orgId } = useAuth()

    const [workspaceList, setWorkspaceList] = useState([])

    useEffect(() => {
        if (user) getWorkspaceList()
    }, [orgId, user])

    const getWorkspaceList = async () => {
        setWorkspaceList([]) // Reset danh sách
        const q = query(collection(db, 'Workspace'), where('orgId', '==', orgId ? orgId : user?.primaryEmailAddress?.emailAddress))
        const querySnapshot = await getDocs(q)

        const workspaces = querySnapshot.docs.map(doc => ({
            id: doc.id, // Lấy ID tài liệu
            ...doc.data()
        }));

        setWorkspaceList(workspaces)
    }

    // Hàm xóa và cập nhật lại danh sách
    const DeleteWorkspace = async (event, workspaceId) => {
        event.stopPropagation(); // 🔥 Ngăn điều hướng khi bấm "Xóa"

        try {
            // 1. Truy vấn tất cả document thuộc workspace
            const q = query(collection(db, "workspaceDocuments"), where("workspaceId", "==", workspaceId));
            const querySnapshot = await getDocs(q);

            const deletePromises = [];

            querySnapshot.docs.forEach((document) => {
                const docId = document.id;

                // Xóa document trong workspaceDocuments
                deletePromises.push(deleteDoc(doc(db, "workspaceDocuments", docId)));

                // Xóa documentOutput tương ứng
                deletePromises.push(deleteDoc(doc(db, "documentOutput", docId)));
            });

            // 2. Thực hiện tất cả thao tác xóa
            await Promise.all(deletePromises);

            // 3. Xóa workspace chính
            await deleteDoc(doc(db, "Workspace", String(workspaceId)));

            // 4. Cập nhật UI
            toast.success("Workspace và tất cả document đã được xóa");
            setWorkspaceList((prev) => prev.filter((ws) => ws.id !== workspaceId));
        } catch (error) {
            console.error("Lỗi khi xóa:", error);
            toast.error("Unable to delete workspace")
        }
    };

    return (
        <div className='my-10 p-10 md:px-24 lg:px-36 xl:px-52'>
            <div className='flex justify-between'>
                <div className='flex gap-5'>
                    <Image src={'/wavingHand.png'} width={30} height={30} alt='wavingHand' />
                    <h2 className='font-bold text-3xl'>Hello, {user?.fullName}</h2>
                </div>

                <Link href={'/createworkspace'}>
                    <Button>+</Button>
                </Link>
            </div>

            <div className='mt-10 flex justify-between'>
                <h2 className='font-medium text-primary'>Workspace</h2>
            </div>

            {workspaceList.length === 0 ? (
                <div className='flex flex-col justify-between items-center my-20'>
                    <Image src={'/workspace.png'} width={200} height={200} alt='workspace' />
                    <h2 className='mt-5'>Create a new workspace</h2>

                    <Link href={'/createworkspace'}>
                        <Button variant={'outline'} className='my-3'>+ New Workspace</Button>
                    </Link>
                </div>
            ) : (
                <WorkspaceItemList
                    workspaceList={workspaceList}
                    deleteWorkspace={DeleteWorkspace} //Truyền hàm delete
                />
            )}
        </div>
    )
}

export default WorkSpaceList;
