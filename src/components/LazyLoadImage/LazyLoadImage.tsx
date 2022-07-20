import React from 'react'

const LazyLoadImage = () => {

    const getImages = ()=>{
        const images: JSX.Element[] = []

        for(let i =0; i < 10; i++){
            images.push(
                <div
                    key={i}
                >
                    <img 
                        key={i} 
                        height={250} 
                        width={250} 
                        src={`https://via.placeholder.com/250?v=${i}`}
                        loading="lazy"
                    />
                </div>
                
            )
        }

        return images;
    }
    return (
        <div>
            {getImages()}
        </div>
    )
}

export default LazyLoadImage