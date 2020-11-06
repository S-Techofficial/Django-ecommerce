import React, { useEffect, useState } from 'react'
import Base from './Base'
import Card from './Card'
import { loadCart } from './helper/carthelper'
import PaymentB from './PaymentB'


function Cart() {

    const [reload, setReload] = useState(false)
    const [products, setProducts] = useState([])

    useEffect(() => {
        setProducts(loadCart());
    }, [reload])

    const loadAllProducts = (products) => {
        return(
            <div>
                {products.map((product,index) => {
                    return(
                        <Card 
                            key={index}
                            product={product}
                            removeFromCart={true}
                            addtoCart={false}
                            reload={reload}
                            setReload={setReload}
                        />
                    )
                })}
            </div>
        )
    }
    

    const loadCheckout = () => {
        return(
            <div>
                <h1>Checkout</h1>
            </div>
        )
    }

    return (
        <Base title="Cart Page" description="Welcome to checkout">
            <div className="text-center row">
                <div className="col-3">
                    {products.length > 0 ? (loadAllProducts(products)) : (
                        <h4>No Products</h4>
                    )}
                </div>
                <div className="col-9">
                    {products.length > 0 ? 
                    (
                        <PaymentB products={products} setReload={setReload}/>
                    ) : (
                        <h3>Please login or Add something in Cart</h3>
                    )}
                </div>
            </div>
        </Base>
    )
}

export default Cart
