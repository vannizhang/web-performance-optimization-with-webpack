import React from 'react'
import LazyLoadComponent from './LazyLoadComponent/EmojiPickerContainer'
import LazyLoadModule from './LazyLoadModule/RandomNumberCard'
import ImageWithResourceHint from './ImageWithResourceHint/ImageViewer'
import WebWorkerExample from './WebWorker/WebWorkerExample'
import WebpImage from './WebpImage/WebpImage'
import LazyLoadImage from './LazyLoadImage/LazyLoadImage'

const Layout = () => {
    return (
        <>
            <ImageWithResourceHint />
            <LazyLoadComponent />
            <LazyLoadModule />
            <WebWorkerExample />
            <WebpImage />
            <LazyLoadImage />
        </>
    )
}

export default Layout
