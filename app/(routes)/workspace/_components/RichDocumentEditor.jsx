'use client'

import React, { useEffect, useRef, useState } from 'react'
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import EditorjsList from '@editorjs/list';
import SimpleImage from 'simple-image-editorjs'
import LinkTool from '@editorjs/link';
import Embed from '@editorjs/embed';
import AudioPlayer from 'editorjs-audio-player';
import Table from '@editorjs/table'
import Paragraph from '@editorjs/paragraph';
import CodeTool from '@editorjs/code';
import Marker from '@editorjs/marker';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '@/config/firebaseConfig';
import { useUser } from '@clerk/nextjs';
import GenerateAITemplate from './GenerateAITemplate';
import DrawingTool from '@blade47/editorjs-drawing-tool';
import Delimiter from '@coolbytes/editorjs-delimiter'
import Annotation from 'editorjs-annotation';

function RichDocumentEditor({ params }) {
    const ref = useRef()
    const { user } = useUser()

    let editor
    let isFetched = false

    let parsedParams = JSON.parse(params?.value || "{}");

    const [documentOutput, setDocumentOutput] = useState([])

    useEffect(() => {
        user && InitEditor()
    }, [user])

    // useEffect(() => {
    //     parsedParams && GetDocumentOutput()
    // }, [parsedParams])

    const SaveDocument = () => {
        ref.current.save().then(async (outputData) => {
            // console.log(outputData)
            const docRef = doc(db, 'documentOutput', parsedParams?.documentid)

            await updateDoc(docRef, {
                output: JSON.stringify(outputData),
                editedBy: user?.primaryEmailAddress?.emailAddress
            })
        })
    }

    const GetDocumentOutput = () => {
        const unsubscribe = onSnapshot(doc(db, 'documentOutput', parsedParams?.documentid), (doc) => {
            if (isFetched == false || doc.data()?.editedBy !== user?.primaryEmailAddress?.emailAddress)
                doc.data()?.output && editor?.render(JSON.parse(doc.data()?.output))
            isFetched = true
        });
    };

    const InitEditor = () => {
        if (!editor?.current) {
            let saveTimeout;

            editor = new EditorJS({
                onChange: () => {
                    // Hủy bỏ timeout cũ nếu có
                    clearTimeout(saveTimeout);

                    // Đặt timeout để lưu sau 1 giây nếu không có thay đổi nào mới
                    saveTimeout = setTimeout(() => {
                        SaveDocument();
                    }, 1000);
                },
                onReady: () => {
                    GetDocumentOutput();
                },

                holder: 'editorjs',

                tools: {
                    header: Header,
                    list: {
                        class: EditorjsList,
                        inlineToolbar: true,
                        config: {
                            defaultStyle: 'unordered'
                        },
                    },
                    image: SimpleImage,
                    linkTool: {
                        class: LinkTool,
                        config: {
                            endpoint: 'http://localhost:8008/fetchUrl',
                        }
                    },
                    embed: Embed,
                    audioPlayer: AudioPlayer,
                    table: Table,
                    paragraph: {
                        class: Paragraph,
                        inlineToolbar: true,
                    },
                    code: CodeTool,
                    Marker: {
                        class: Marker,
                        shortcut: 'CMD+SHIFT+M',
                    },
                    drawingTool: {
                        class: DrawingTool,
                    },
                    delimiter: {
                        class: Delimiter,
                        config: {
                            styleOptions: ['star', 'dash', 'line'],
                            defaultStyle: 'star',
                            lineWidthOptions: [8, 15, 25, 35, 50, 60, 100],
                            defaultLineWidth: 25,
                            lineThicknessOptions: [1, 2, 3, 4, 5, 6],
                            defaultLineThickness: 2,
                        }
                    },
                    annotation: Annotation,

                },
            });

            ref.current = editor;
        }
    }

    return (
        <div className="">
            {/* Editor container với Tailwind CSS */}
            <div id="editorjs" className='md:ml-20'></div>

            {/* Container cho GenerateAITemplate */}
            <div className="fixed bottom-5 md:ml-10">
                <GenerateAITemplate setGenerateAIOutput={(output) => editor?.render(output)} />
            </div>
        </div>
    )
}

export default RichDocumentEditor