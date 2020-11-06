import {API} from "../../backend"
import {cartEmpty} from "../../core/helper/carthelper"


export const signup = user => {
    return fetch(`${API}user/`,{
        method:"POST",
        headers:{
            Accept:"application/json",
            "Content-Type":"application/json",
        },
        body: JSON.stringify(user)
    }).then(response => {
        return response.json();
    }).catch(err => console.log(err))
}

export const signin = (user) => {
    const formData = new FormData()

    for(const name in user){
        console.log(user[name]);
        formData.append(name, user[name])
    }

    for(var key of formData.keys()){
        console.log("MYKEY: ", key)
    }

    return fetch(`${API}user/login/`,{
        method:"POST",
        body: formData
    }).then(response => {
        console.log("SUCCESS",response);
        return response.json();
    }).catch(err => console.log(err))
}


export const authenticate = (data, next) => {
    if(typeof window !== undefined){
        localStorage.setItem("customCookie", JSON.stringify(data))
        next();
    }
}


export const isAuthenticated = () => {
    if(typeof window == undefined){
        return false;
    }
    if(localStorage.getItem("customCookie")){
        return JSON.parse(localStorage.getItem("customCookie"));
        // TODO: compare customCookie with database json token
    } else{
        return false;
    }
}


export const signout = next => {
    const userId = isAuthenticated() && isAuthenticated().user.id

    if(typeof window !== undefined){
        localStorage.removeItem("customCookie")
        cartEmpty(() => {});
        next();

        return fetch(`${API}user/logout/${userId}`,{
            method:"GET"
        }).then(response => {
            console.log("Signout Success");
            next();
        }).catch(err => console.log(err))
    }
}