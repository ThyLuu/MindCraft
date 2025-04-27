'use client'

import EmojiPicker from 'emoji-picker-react'
import React, { useEffect, useRef, useState } from 'react'

function EmojiPickerComponent({ children, setEmojiIcon }) {
    const [openEmojiPicker, setOpenEmojiPicker] = useState(false)
    const pickerRef = useRef(null)

    // Đóng emoji picker khi click ra ngoài
    useEffect(() => {
        function handleClickOutside(event) {
            if (pickerRef.current && !pickerRef.current.contains(event.target)) {
                setOpenEmojiPicker(false)
            }
        }

        if (openEmojiPicker) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [openEmojiPicker])

    return (
        <div className="relative" ref={pickerRef}>
            <div onClick={() => setOpenEmojiPicker(!openEmojiPicker)}>
                {children}
            </div>

            {openEmojiPicker && (
                <div className="absolute z-10 bg-white shadow-md rounded-md">
                    <EmojiPicker
                        emojiStyle='facebook'
                        onEmojiClick={(e) => { 
                            setEmojiIcon(e.emoji); 
                            setOpenEmojiPicker(false) 
                        }} 
                    />
                </div>
            )}
        </div>
    )
}

export default EmojiPickerComponent
