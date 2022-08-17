import React, { useState } from 'react'

import mountainImg from '../../static/images/preload/mountain.jpg'
import seaImage from '../../static/images/prefetch/sea.jpg'

const TopBanner = () => {
    const [shouldDisplaySecondImg, setShouldDisplaySecondImg] = useState(false)

    return (
        <>
            <img src={mountainImg} width={500} />

            {shouldDisplaySecondImg && <img src={seaImage} width={500} />}

            <div onClick={setShouldDisplaySecondImg.bind(null, true)}>
                show prefetched image
            </div>
        </>
    )
}

export default TopBanner
