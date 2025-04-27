'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import React from 'react'
import { MoreVertical, PenBox, Trash2 } from 'lucide-react'

function WorkspaceItemList({ workspaceList, deleteWorkspace }) {
  const router = useRouter()

  const RenameWorkspace = (workspace) => {
    router.push(`/renameWorkspace?workspaceid=${workspace.id}`);
  };

  return (
    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6'>
      {workspaceList.map((workspace, index) => (
        <div
          key={workspace.id}
          onClick={() => router.push(`/workspace/${workspace.id}`)} // ✅ Điều hướng đúng
          className='border shadow-xl rounded-xl hover:scale-105 transition-all cursor-pointer'
        >
          <Image
            src={workspace?.coverImage}
            width={400}
            height={200}
            alt='coverImage'
            className='h-[150px] object-cover rounded-t-xl'
          />

          <div className='p-4 rounded-b-xl flex justify-between items-center'>
            <h2 className='flex gap-2'>{workspace?.emoji} {workspace.workspaceName}</h2>

            {/* Dropdown Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger onClick={(e) => e.stopPropagation()}>
                <MoreVertical className='h-4 w-4 cursor-pointer' />
              </DropdownMenuTrigger>

              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    RenameWorkspace(workspace);
                  }}
                  className='flex gap-2 cursor-pointer'
                >
                  <PenBox className='h-4 w-4' />
                  Rename
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={(e) => deleteWorkspace(e, workspace.id)}
                  className='flex gap-2 text-red-500 cursor-pointer'
                >
                  <Trash2 className='h-4 w-4 text-red-500' />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  )
}

export default WorkspaceItemList;
