import React, { FC, Suspense, lazy } from 'react'
import { NavBar, TabBar } from 'antd-mobile'
import {
  Outlet,
  useNavigate,
  useLocation,
} from 'react-router-dom'

import './index.css'
import RouteBeforeEach, {RouterBeforeEachFor} from '../../route/Auth.tsx'

const Bottom: FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { pathname } = location

  const setRouteActive = (value: string) => {
    navigate(value)
  }

  const tabs = [
    {
      key: '/home',
      title: '首页',
      icon: 'icon-ind',
    },
    {
      key: '/home/list',
      title: '找房',
      icon: 'icon-findHouse',
    },
    {
      key: '/home/news',
      title: '资讯',
      icon: 'icon-infom',
    },
    {
      key: '/home/profile',
      title: '我的',
      icon: 'icon-my',
    },
  ]

  return (
    <TabBar className='tabbar' defaultActiveKey="/home/index" activeKey={pathname} onChange={value => setRouteActive(value)}>
      {tabs.map(item => (
        <TabBar.Item key={item.key} icon={< i className={ `iconfont ${item.icon}` }/>} title={item.title} />
      ))}
    </TabBar>
  )
}

export default () => {
  return (
      <div className="app">
        <div >
          <NavBar>Home</NavBar>
        </div>
        <div className="body" style={{height: `100%`}}>
          {/* {
            RouteBeforeEach()
          } */}

          {
            // <RouterBeforeEachFor><Outlet /></RouterBeforeEachFor>
          }

            <Suspense fallback={<div>loading................</div>}>
              <Outlet />
            </Suspense>
            {/* <div style ={{height: '2000px'}} /> */}
        </div>
        <div className='bottom'>
          <Bottom />
        </div>
      </div>
  )
}