import React from "react";
import EmojiPickerContainer from "./LazyLoadComponent/EmojiPickerContainer";
import RandomNumberCard from "./LazyLoadModule/RandomNumberCard";
import ImageViewer from "./ImageWithResourceHint/ImageViewer";

const Layout = () => {

    return (
        <>
            <ImageViewer />
            <EmojiPickerContainer />
            <RandomNumberCard />
        </>
    )
}

export default Layout