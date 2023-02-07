import {useNavigate,useLocation,useResolvedPath, Navigate } from "react-router-dom";
import { Outlet } from 'react-router-dom'
// import {checkRouterAuth} from './index'
import {useEffect,useState, FC, ReactNode} from 'react'
import {getToken, setToken, removeToken, isAuth} from '../utils/auth'

type IProps = {
    children: any
}

const RouterBeforeEachFor:FC<IProps> = ({children: Children}) => {
    debugger
    const [auth, setAuth] = useState(false)
    const navigator = useNavigate()
    useEffect(() => {
        debugger
        const _is = isAuth() 
        if(_is) {
            setAuth(true) 
        }
        else {
            setAuth(false)
            navigator('/login')
        }
    })
    debugger
    return (
        auth 
            ? Children
            : null
    )
}

const RouterBeforeEach:FC<IProps> = () => {
    const [auth, setAuth] = useState(false)
    const navigator = useNavigate()
    useEffect(() => {
        debugger
        const _is = isAuth() 
        if(_is) {
            setAuth(true) 
        }
        else {
            setAuth(false)
            navigator('/login')
        }
    })
    debugger
    return  (
        auth 
            ? <Outlet />  
            : null
    )
    // 方案一：不可行   必须返回null!!!!!!!!!!!!!!!!!   返回<Navigate to="/login" />就不可以，不知道为啥
    // return  (
    //     auth 
    //         ? <Outlet />  
    //         : <Navigate to="/login" />
    // )
}

export default RouterBeforeEach
export {RouterBeforeEachFor}