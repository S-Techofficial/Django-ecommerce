import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import PrivateRoute from './auth/helper/PrivateRoute'
import Cart from './core/Cart'
import Home from './core/Home'
import Signin from './user/Signin'
import Signup from './user/Signup'
import UserDashboard from './user/UserDashboard'



const Routes = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/signup" exact component={Signup} />
                <Route path="/signin" exact component={Signin} />
                <Route path="/cart" exact component={Cart} />
                <PrivateRoute path="/user/dashboard" exact component={UserDashboard} />
            </Switch>
        </BrowserRouter>
    )
}

export default Routes;