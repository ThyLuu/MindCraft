import { FileText } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'
import DocumentOption from './DocumentOption';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/config/firebaseConfig';
import { toast } from 'sonner';

function DocumentList({ documentList, params }) {
    const router = useRouter()

    const DeleteDocument = async (docId) => {
        try {
            await deleteDoc(doc(db, "workspaceDocuments", docId));

            await deleteDoc(doc(db, "documentOutput", docId));

            toast('The document has been deleted');

            if (String(params?.documentid) === String(docId)) {
                router.push(`/workspace/${params?.workspaceid}`);
            }
        } catch (error) {
            console.error("Error deleting document:", error);
            toast.error('Failed to delete the document');
        }
    }

    // console.log("Current documentid:", params?.documentid);
    // console.log("Document IDs:", documentList.map(doc => doc.id));

    return (
        <div>
            {documentList.length > 0 && documentList.map((doc, index) => (
                <div key={index}
                    onClick={() => router.push(`/workspace/${params?.workspaceid}/${doc?.id}`)}
                    className={`mt-3 p-2 px-3 hover:bg-gray-200 rounded-lg cursor-pointer flex justify-between items-center 
                    ${String(doc?.id) === String(params?.documentid) ? 'bg-gray-200' : ''}`}
                >
                    <div className='flex gap-2 items-center'>
                        {!doc.emoji && <FileText size={20} />}
                        <h2 className="flex gap-2 overflow-hidden text-ellipsis whitespace-nowrap max-w-[200px]">
                            {doc?.emoji} {doc.documentName}
                        </h2>

                    </div>

                    <DocumentOption doc={doc} deleteDocument={(docId) => DeleteDocument(docId)} />
                </div>
            ))}
        </div>
    )
}


export default DocumentList