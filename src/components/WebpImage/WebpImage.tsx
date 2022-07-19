import React from 'react'
import nightSkyWebP from '../../static/images/night-sky.webp'
import nightSkyJPG from '../../static/images/night-sky.jpg'

const WebpImage = () => {
    return (
        <picture>
            <source type="image/webp" srcSet={nightSkyWebP} />
            <source type="image/jpeg" srcSet={nightSkyJPG} />
            <img src={nightSkyJPG} alt="" width={500}/>
        </picture>
    )
}

export default WebpImage