import React, { Component, useEffect, useState, useRef } from 'react'

import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Grid, Button, Modal} from 'antd-mobile'
import styles from './index.module.css'
import { getToken, setToken, removeToken, isAuth } from '../../utils/auth'
import {API } from '../../utils/api'
import {onRouterBefore } from '../../route/index.tsx'
// import {useAuth, AuthProvider, authConsumer, RequestAuth} from '../../route/Auth.tsx'

const BASE_URL = process.env.REACT_APP_BASE_URL




// 菜单数据
const menus = [
  { id: 1, name: '我的收藏', iconfont: 'icon-coll', to: '/favorate' },
  { id: 2, name: '我的出租', iconfont: 'icon-ind', to: '/rent' },
  { id: 3, name: '看房记录', iconfont: 'icon-record' },
  {
    id: 4,
    name: '成为房主',
    iconfont: 'icon-identity'
  },
  { id: 5, name: '个人资料', iconfont: 'icon-myinfo' },
  { id: 6, name: '联系我们', iconfont: 'icon-cust' }
]

const Profile = () => {
    const avatarEditor = useRef()
    const [isLogin, setIsLogin] = useState(isAuth) 
    const [userInfo, setUserInfo] = useState({
      nickname: '' || '游客',
      avatar: '' || BASE_URL + '/img/profile/avatar.png'
    })
    const navigate = useNavigate()
    const location = useLocation()
    // const {_logout} = useAuth()


    /** start */
    // debugger
    /** end */

    const logout = () => {
      Modal.alert({
        content: '确定退出么？',
        onConfirm: () => {
          console.log('Confirmed')
          removeToken()
          // navigate('/login')
          // useAuth().logout()
          debugger
          // _logout()
          setIsLogin(isAuth)
          setUserInfo({
            avatar: '',
            nickname: ''
  
          })
        },
        showCloseButton: true,
      })
    }

    const getUserInfo = async () => {
      // 发送请求，获取个人资料
      const res = await API.get('/user', {
        // headers: {
        //   authorization: getToken()
        // }
      })

      // console.log(res)
      if (res.data.status === 200) {
        const { avatar, nickname } = res.data.body
        setUserInfo({
          avatar: BASE_URL + avatar,
          nickname

        })
      } 
      else {
        setIsLogin(false)
      }
    }

    const loginUI = () => {
      return isLogin ? (
        <>
          <div className={styles.auth}>
            <span onClick={logout}>退出</span>
          </div>
          <div className={styles.edit}>
            编辑个人资料
            <span className={styles.arrow}>
              <i className="iconfont icon-arrow" />
            </span>
          </div>
        </>

      ) : (
        <div className={styles.edit}>
          <Button
            color='primary'
            size="small"
            onClick={() => navigate('/login')}
          >
            去登录
          </Button>
        </div>
      )
    }

    useEffect(() => {
      if(!isLogin) {
        return
      }
      getUserInfo()
    }, [])


    const {nickname, avatar} = userInfo
    return (
      <div className={styles.root}>
        {/* 个人信息 */}
        <div className={styles.title}>
          <img
            className={styles.bg}
            src={BASE_URL + '/img/profile/bg.png'}
            alt="背景图"
          />
          <div className={styles.info}>
            <div className={styles.myIcon}>
              <img className={styles.avatar} src={avatar} alt="icon" />
            </div>
            <div className={styles.user}>
              <div className={styles.name}>{nickname || '游客'}</div>
              {
                loginUI()
              }
            </div>
          </div>
        </div>

        {/* 九宫格菜单 */}
        
        <Grid columns={3}>
          {
            menus.map(item => {
              if(item.to) {
                return(<Grid.Item>
                  <Link to={item.to}>
                    <div className={styles.menuItem}>
                      <i className={`iconfont ${item.iconfont}`} />
                      <span>{item.name}</span>
                    </div>
                  </Link>
                  </Grid.Item>
                )
              } else {
                return (<Grid.Item>
                  <div className={styles.menuItem}>
                    <i className={`iconfont ${item.iconfont}`} />
                    <span>{item.name}</span>
                  </div>
                  </Grid.Item>
                )
              }
            })

          }
        </Grid>

        {/* 加入我们 */}
        <div className={styles.ad}>
          <img src={BASE_URL + '/img/profile/join.png'} alt="" />
        </div>
      </div>
    )
  
}

// export default  onRouterBefore(Profile)
export default  Profile
