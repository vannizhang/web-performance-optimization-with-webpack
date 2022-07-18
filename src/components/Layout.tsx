import React from "react";
import LazyLoadComponent from "./LazyLoadComponent/EmojiPickerContainer";
import LazyLoadModule from "./LazyLoadModule/RandomNumberCard";
import ImageWithResourceHint from "./ImageWithResourceHint/ImageViewer";
import WebWorkerExample from "./WebWorker/WebWorkerExample";

const Layout = () => {

    return (
        <>
            <ImageWithResourceHint />
            <LazyLoadComponent />
            <LazyLoadModule />
            <WebWorkerExample />
        </>
    )
}

export default Layout