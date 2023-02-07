import React, { useState, createContext, useContext, useEffect } from "react";
import { Navigate } from 'react-router-dom';

const Authcontext = createContext(null)
// const { Provider } = Authcontext

const useAuth = () => {
    const [authed, setAuthed] = useState(false)
    useEffect(() => {
        console.log('authed', authed)
    }, [authed])

    return {
        authed,
        _login() {
            return new Promise((resolve, reject) => {
                setAuthed(true)
                resolve()
            })
        },
        _logout() {
            return new Promise((resolve, reject) => {
                setAuthed(false)
                resolve()
            })
        }
    }
}

const AuthProvider = ({children}) => {
    const auth = useAuth()
    const {Provider} = Authcontext
    return <Provider value={auth}> {children} </Provider>
}

const authConsumer = () => {
    // return useContext(Authcontext)
}

const RequestAuth = ({children}) => {
    debugger
    const _authConsumber = useContext(Authcontext)
    return _authConsumber.authed === true 
        ? children
        : <Navigate to="/login"/>
}

export {useAuth, AuthProvider, authConsumer, RequestAuth}