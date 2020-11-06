import React from 'react'

function ImageHelper({product}) {
    const imageURL = product ? product.image : `https://images.pexels.com/photos/5102242/pexels-photo-5102242.png?auto=compress&cs=tinysrgb&dpr=1&w=500`
    return (
        <div className="rounded border border-success p-2">
            <img className="mb-3 rounded" src={imageURL} style={{maxHeight:"100%",maxWidth:"100%"}} alt="" />
        </div>
    )
}

export default ImageHelper
