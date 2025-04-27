'use client';
import { useEffect, useState } from 'react';
import { TypingAnimation } from "../../../components/magicui/typing-animation";
import { TextAnimate } from '../../../components/magicui/text-animate';
import { useRouter } from 'next/navigation';

export default function Introduce() {
    const [typingComplete, setTypingComplete] = useState(false);
    const [textComplete, setTextComplete] = useState(false);

    const router = useRouter();

    useEffect(() => {
        const timeout = setTimeout(() => {
            setTypingComplete(true);
            setTextComplete(true);

            setTimeout(() => {
                router.push('/dashboard');
            }, 500); 

        }, 3000);

        return () => clearTimeout(timeout);
    }, [router]);

    return (
        <div className="relative w-screen h-screen overflow-hidden bg-white text-black">
            {/* Typing animation in the center of the screen */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="flex flex-col items-start">
                    <div className="flex">
                        <TypingAnimation className={"text-7xl"}>MindCraft</TypingAnimation>
                    </div>
                    <div className="mt-2 text-xl">
                        <TextAnimate animation="blurInUp" by="character" once>
                            By LuuThyThy
                        </TextAnimate>
                    </div>
                </div>
            </div>
        </div>
    );
}
