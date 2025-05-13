'use client'

import { useSearchParams } from 'next/navigation'
import RenameWorkspace from './RenameWorkspace'

const RenameWorkspaceClient = () => {
  const searchParams = useSearchParams()
  const workspaceId = searchParams.get('workspaceid')

  if (!workspaceId) {
    return <div>Workspace ID is missing</div>
  }

  return <RenameWorkspace workspaceId={workspaceId} />
}

export default RenameWorkspaceClient
