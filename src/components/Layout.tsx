import React from "react";
import EmojiPickerContainer from "./EmojiPicker/EmojiPickerContainer";
import RandomNumberCard from "./RandomNumberCard/RandomNumberCard";
import ImageViewer from "./ImageViewer/ImageViewer";

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