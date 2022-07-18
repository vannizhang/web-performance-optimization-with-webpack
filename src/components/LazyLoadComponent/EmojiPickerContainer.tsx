import React, { Suspense, lazy, useState, useEffect } from "react";

const EmojiPicker = lazy(()=>import(
    /* webpackPrefetch: true */ 
    /* webpackChunkName: "emoji-picker" */
    "./EmojiPicker"
))

const EmojiPickerContainer = () => {
    const [ showEmoji, setShowEmoji ] = useState(false)

    return (
        <div>
            <div>
                <span onClick={setShowEmoji.bind(null, true)}>show emojis</span>
            </div>
            
            <Suspense fallback={<span id="loading">Loading...</span>}>
                {showEmoji && <EmojiPicker />}
            </Suspense>
        </div>
    )
}

export default EmojiPickerContainer