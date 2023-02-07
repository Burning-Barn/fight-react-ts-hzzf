import React, { Component, useState, useEffect } from 'react'
import { Space, AutoCenter, Form  } from 'antd-mobile'

import { Link, useParams, useSearchParams, useLocation, useNavigate } from 'react-router-dom'

import NavHeader from '../../components/NavHeader/index.tsx'

import styles from './index.module.css'

import {FC} from 'react'

import {API} from '../../utils/api'
import {AxiosResponse, AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponseHeaders} from 'axios'
// import {useAuth, AuthProvider, authConsumer, RequestAuth} from '../../route/Auth.tsx'

// 验证规则：
// const REG_UNAME = /^[a-zA-Z_\d]{5,8}$/
// const REG_PWD = /^[a-zA-Z_\d]{5,12}$/
type IProps = {

}

class AC extends React.Component<IProps> {
  render() {
    return (
      <div></div>
    )
  }
}

class BC<T> extends React.Component<T> {
  render() {
    return (
      <div></div>
    )
  }
}

function CC(props: IProps):React.ReactNode {
  return (
    <div></div>
  )
}

function DC<T>(props: T) {
  return (
    <div>
      <BC<{}> />
    </div>
  )
}


const EC = <T extends any>(props: T) => {
 return (
  <>
  </>
 )
}
 
const Login:FC<IProps> = (props) => {
    const [userName, setUserName] = useState('')
    const [passWord, setPassWord] = useState('')
    const navigate = useNavigate()
    const location = useLocation()
    // const { _login } = useAuth()

    const changeValue = (e: React.ChangeEvent<HTMLInputElement>, type:string) => {
      console.log('e',e.target.value)
      const _value = e.target.value
      const setMapping = {
        username: setUserName,
        passWord: setPassWord
      }
      setMapping[type](_value)
      // switch(type) {
      //   case 'username':
      //     setUserName(_value)
      //   case 'passWord':
      //     setPassWord(_value)
      //   default:
      //     break
    }

    const hSubmit = async (value, ) => {
      // e: React.FormEvent<HTMLFormElement>
      // e.preventDefault()
      // debugger
      console.log('', value)
      const {username, password} = value
      // const 

      try {
        const _res: AxiosResponse<any> = await API.post<any>('/user/login', {
          username,
          password
        })
        console.log('res', _res)
        if(_res.status === 200) {
          const {
            data: {
              body: {
                token: _token
              }
            }
          } = _res
          // localStorage.setItem('', res.)
          debugger
          localStorage.setItem('hkzf_token', _token)
          // useAuth.login()
          // _login()
          if(location.state ) {
            navigate(location.state , {replace: true})
          }
          else {
            navigate(-1)

          }
          // navigate(-1)
        }
      } catch (error) {
        if ((error as AxiosError ).response.status === 400) {
          console.log(error.response.message)
        }
      }

    }

    const checkUserName = (_: any, value: string) => {
      // debugger
      const _reg = /^[a-zA-Z_\d]{5,8}$/
      if (_reg.test(value)) {
        return Promise.resolve()
      }
      return Promise.reject(new Error('名称未通过验证!'))
    }

    const checkPassWord = (_: any, value: string) => {
      const _reg = /^[a-zA-Z_\d]{5,8}$/
      if (_reg.test(value)) {
        return Promise.resolve()
      }
      return Promise.reject(new Error('密码未通过验证!'))
    }

    useEffect(() => {

      return () => {
        
      }
    }, [])

    return (
      <div className={styles.root}>
        {/* 顶部导航 */}
        <NavHeader className={styles.navHeader}>账号登录</NavHeader>
        {/* <WhiteSpace size="xl" /> */}

        {/* 登录表单 */}
        <AutoCenter >
          <div style={{width: `100%`}}>
            <Form onFinish={hSubmit} >
              <div className={styles.formItem}>
                <Form.Item
                  label="用户名"
                  name='username'
                  rules={[{ required: true }, { validator: checkUserName }]}>
                  <input
                    className={styles.input}
                    // value={userName}
                    // onChange={(e) => changeValue(e, 'username')}
                  />
                </Form.Item>
              </div>
              {/* 长度为5到8位，只能出现数字、字母、下划线 */}
              {/* <div className={styles.error}>账号为必填项</div> */}
              <div className={styles.formItem}>
                <Form.Item
                  label="密码"
                  rules={[{required: true}, {validator: checkPassWord}]}
                  name='password'>
                  <input
                    className={styles.input}
                    type="password"
                    // value={passWord}
                    // onChange={(e) => changeValue(e, 'passWord')}
                  />
                </Form.Item>
              </div>
              {/* 长度为5到12位，只能出现数字、字母、下划线 */}
              {/* <div className={styles.error}>账号为必填项</div> */}
              <div className={styles.formSubmit}>
                <button className={styles.submit} type="submit" >
                  登 录
                </button>
              </div>
            </Form>
            <div className={styles.backHome}>
              <div>
                <Link to="/registe">还没有账号，去注册~</Link>
              </div>
            </div>
          </div>
        </AutoCenter >
      </div>
    )
  
}

export default Login
