import {lazy} from 'react'
import Citylist from '../pages/Citylist/index.tsx'
import Home from '../pages/Home/index.tsx'
import Index from '../pages/Index/index.tsx'
// import List from '../pages/List/index.tsx'
import ListTest from '../pages/ListTest/index.tsx'
import News from '../pages/News/index.tsx'
// import Profile from '../pages/Profile/index.tsx'
import Map from '../pages/Map/index.tsx'
import HouseDetail from '../pages/HouseDetail/index.tsx'
import Login from '../pages/Login/index.tsx'
import Rent from '../pages/Rent/index.js'
import RentAdd from '../pages/Rent/Add/index.tsx'
import RentSearch from '../pages/Rent/Search/index.tsx'
import Count from '../pages/Count/index.tsx'
import CountHook from '../pages/CountHook/index.tsx'
// import {isAuth} from '../utils/auth'
// import {useNavigate} from 'react-router-dom'

import { RouteObject, Navigate } from 'react-router-dom'
// import {useAuth, AuthProvider, authConsumer, RequestAuth} from './Auth.tsx'
// import {AuthProvider, RequireAuth } from './Auth_to.js'
// import AuthConsumer  from './Auth_to.js'

import {RouterBeforeEachFor} from './Auth.tsx'
const List =  lazy(() => import('../pages/List/index.tsx'))
const Profile = lazy(() => import('../pages/Profile/index.tsx')) 



interface Meta {
    needLogin: boolean
}

const routes: RouteObject[] = [
    {
        path: '/',
        element: <Navigate to="/home"/>
    },
    {
        path: '/home',
        element: <Home/>,
        children: [
            {
                index: true,
                // path: 'index',
                element: <Index/>
            },
            {
                path: 'list',
                element: <List/>
            },
            {
                path: 'news',
                element: <News/>
            },
            {
                path: 'profile',
                element: <Profile/>
            },
            {
                path: 'ListTest',
                element: <ListTest/>
            },
            {
                path: 'houseDetail',
                element: <HouseDetail/>
            },
        ]
    },
    {
        path: '/count',
        element: <Count/>
    },
    {
        path: '/countHook',
        element: <CountHook/>
    },
    {
        path: '/rent',
        element: <Rent/>
    },
    {
        path: '/rent/add',
        element: <RentAdd/>
    },
    {
        path: '/rent/search',
        element: <RentSearch/>
    },
    {
        path: '/citylist',
        element: <Citylist/>
    },
    {
        path: '/map',
        element: <RouterBeforeEachFor><Map /></RouterBeforeEachFor>
        // element: <Map />
    },
    {
        path: '/login',
        element: <Login/>,
    },
]

export default routes