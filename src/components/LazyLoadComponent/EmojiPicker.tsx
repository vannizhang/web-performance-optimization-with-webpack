import React from 'react'

type EmojiData = {
    name: string; 
    decimal: number
}

const emojis:EmojiData[] = [
    {
        name: 'soccer-ball',
        decimal: 9917
    },
    {
        name: 'earth',
        decimal: 127758
    },
    {
        name: 'beer',
        decimal: 127866
    },
    {
        name: 'monkey',
        decimal: 128053
    },
    {
        name: 'laugh',
        decimal: 128514
    },
]

const EmojiPicker = () => {
    return (
        <div>
            { emojis.map(({ name, decimal })=><span key={name}>{ String.fromCodePoint(decimal) }</span>)}
        </div>
    )
}

export default EmojiPicker