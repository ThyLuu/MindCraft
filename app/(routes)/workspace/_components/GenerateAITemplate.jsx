'use client'

import { Button } from '@/components/ui/button'
import { Loader2Icon, WandSparkles } from 'lucide-react'
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import { chatSession } from '@/config/GoogleAIModel'


function GenerateAITemplate({setGenerateAIOutput}) {
    const [open, setOpen] = useState(false)
    const [userInput, setUserInput] = useState()
    const [loading, setLoading] = useState(false)

    const GenerateFromAI = async () => {
        setLoading(true)

        const PROMPT = 'Generate template for editor.js in JSON for' + userInput
        const result = await chatSession.sendMessage(PROMPT);
        console.log(result.response.text());

        try {
            const output = JSON.parse(result.response.text())
            setGenerateAIOutput(output)
        } catch (error) {
            setLoading(false)
        }

        setLoading(false)
        setOpen(false)
    }

    return (
        <div>
            <Button onClick={() => setOpen(true)} className='cursor-pointer'><WandSparkles/>AI Generate</Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>AI Generate</DialogTitle>
                    </DialogHeader>

                    {/* Không sử dụng DialogDescription ở đây */}
                    <div>
                        <h2 className='mt-5 mb-2'>What would you like to write in the document ?</h2>
                        <Input onChange={(e) => setUserInput(e?.target.value)} placeholder={'Ex: Project idea'} />

                        <div className="flex justify-end gap-2 mt-4">
                            <Button variant={'ghost'} onClick={() => setOpen(false)}>Cancel</Button>
                            <Button disabled={!userInput || loading} onClick={() => GenerateFromAI()}>
                                {loading ? <Loader2Icon className='animate-spin' /> : "Generate"}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default GenerateAITemplate
