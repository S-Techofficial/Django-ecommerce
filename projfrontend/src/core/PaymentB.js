import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import { cartEmpty } from "./helper/carthelper"
import { getMeToken, processPayment } from './helper/paymenthelper'
import { createOrder } from './helper/orderhelper'
import { isAuthenticated, signout } from '../auth/helper'

import DropIn from "braintree-web-drop-in-react"
import { parse } from 'query-string'

const PaymentB = ({
    products,
    reload = undefined,
    setReload = f => f,
}) => {

    const [info, setInfo] = useState({
        loading: false,
        success: false,
        clientToken: null,
        error: "",
        instance: {}
    })

    const userId = isAuthenticated() && isAuthenticated().user.id;
    const token = isAuthenticated() && isAuthenticated().token;

    const getToken = (userId, token) => {
        getMeToken(userId, token)
            .then(info => {
                if (info.error) {
                    setInfo({
                        ...info,
                        error: info.error
                    })
                    signout(() => {
                        return <Redirect to="/" />
                    });
                } else {
                    const clientToken = info.clientToken;
                    setInfo({ clientToken })
                }

            })
    }

    useEffect(() => {
        getToken(userId, token)
    }, []);

    const getAmount = () => {
        let amount = 0;
        products.map((product) => {
            amount = amount + parseInt(product.price)
        })
        return amount;
    };


    const onPurchase = () => {
        setInfo({ loading: true })
        let nonce;
        let getNonce = info.instance.requestPaymentMethod()
.then(data => {
                nonce = data.nonce;
                let paymentData = {
                    paymentMethodNonce: nonce,
                    amount: getAmount()
                };
                processPayment(userId, token, paymentData)
                    .then(response => {
                        if (response.error) {
                            if (response.code === "1") {
                                console.log("Payment Failed")
                                signout(() => {
                                    return <Redirect />
                                })
                            }
                        } else {
                            setInfo({
                                ...info,
                                success: response.success,
                                loading: false
                            })
                            console.log("PAYMENT SUCCESS")
                            let product_names = ""
                            products.forEach(function (item) {
                                product_names += item.name + ", "
                            });
                            const orderData = {
                                products: product_names,
                                transaction_id: response.transaction.id,
                                amount: response.transaction.amount
                            }
                            createOrder(userId, token, orderData)
                                .then(response => {
                                    if (response.error) {
                                        if (response.code == "1") {
                                            console.log("Order Failed")
                                        }
                                        signout(() => {
                                            return <Redirect to="/" />
                                        })
                                    } else {
                                        if (response.success === true) {
                                            console.log("ORDER PLACED")
                                        }
                                    }
                                })
                                .catch(err => {
                                    setInfo({ loading: false, success: false })
                                    console.log("Order Failed")
                                })

                            cartEmpty(() => {
                                console.log("Cart is empty out")
                            })

                            setReload(!reload)

                        }
                    })
                    .catch(err => console.log(err))
            })
            .catch(err => console.log("Nonce Error", err))
    };

    const showbtnDropIn = () => {
        return (
            <div>
                {
                    info.clientToken !== null && products.length > 0 ?
                        (
                            <div>
                                <DropIn
                                    options={{ authorization: info.clientToken }}
                                    onInstance={instance => (info.instance = instance)}
                                />
                                <button onClick={onPurchase} className="btn btn-block btn-success">BUY NOW</button>
                            </div>
                        ) :
                        (
                            <h3>Please login First or Add Something in Cart</h3>
                        )
                }
            </div>
        )
    }


    return (
        <div>
            <h3>Your Bill is ${getAmount()}</h3>
            {showbtnDropIn()}
        </div>
    )
}

export default PaymentB;