import React, { useState } from 'react'

import mountainImg from './preload.mountain.jpg'
import seaImage from './prefetch.sea.jpg'

const TopBanner = () => {

    const [ shouldDisplaySecondImg, setShouldDisplaySecondImg ] = useState(false)

    return (
        <>
            <img src={mountainImg} width={500}/>
            
            { shouldDisplaySecondImg && <img src={seaImage} width={500}/>}

            <div
                onClick={setShouldDisplaySecondImg.bind(null, true)}
            >
                show prefetched image
            </div>
        </>

    )
}

export default TopBanner