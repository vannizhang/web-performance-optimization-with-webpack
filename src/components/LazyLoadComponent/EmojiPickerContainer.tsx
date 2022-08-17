import React, { Suspense, lazy, useState, useEffect } from 'react'

const EmojiPicker = lazy(
    () =>
        import(
            /* webpackPrefetch: true */
            /* webpackChunkName: "emoji-picker" */
            './EmojiPicker'
        )
)

const ChatInput = () => {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)

    return (
        <div>
            <div>
                <input type="text" placeholder="Type a message..." />
                <button onClick={setShowEmojiPicker.bind(null, true)}>
                    pick emojis
                </button>
            </div>

            <Suspense fallback={<span id="loading">Loading...</span>}>
                {showEmojiPicker && <EmojiPicker />}
            </Suspense>
        </div>
    )
}

export default ChatInput
