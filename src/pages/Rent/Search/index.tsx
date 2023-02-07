import React, { Component, useState, useRef } from 'react'
import {useNavigate} from 'react-router-dom'

import { SearchBar } from 'antd-mobile'
import { SearchBarRef } from 'antd-mobile/es/components/search-bar'

import { getCity } from '../../../utils/city'
import { API } from '../../../utils/api'

import styles from './index.module.css'
import { stat } from 'fs'

 const Search  = () => {
  // 当前城市id
  const initeState = {
    // 搜索框的值
    searchTxt: '',
    tipsList: []
  }
  const [state, setstate] = useState(initeState)
  const searchRef = useRef<SearchBarRef>(null)
  const navigate = useNavigate()
  const cityId = getCity().value
  let _timer = null

  const changeSearch = async (val, ) => {
    if(val === '') {
      return setstate((pre) => ({
        ...pre,
        tipsList: []
      }))
    }
    // debugger
    clearTimeout(_timer)
    _timer = setTimeout( async() => {
      console.log(`你搜索了：${val}`)
      setstate((preState) => ({
        ...preState,
        'searchTxt': val
      }))
      const _res = await API.get('/area/community', {
        params: {
          name: val,
          id: cityId
        }
      })
      setstate((pre) => ({
        ...pre,
        'tipsList': _res.data.body
      }))

    }, 1000)

  }

  const goRent = (item) => {
    debugger
    navigate('/rent/add', {state: { cityName:  item}})
    // navigate('/rent/add', { 'cityName': e })
  }

  // 渲染搜索结果列表
  const renderTips = () => {
    const { tipsList } = state

    return tipsList.map(item => (
      <li onClick={()=>goRent(item)} key={item.community} className={styles.tip}>
        {item.communityName}
      </li>
    ))
  }

  const { searchTxt, tipsList } = state

  return (
    <div className={styles.root}>
      {/* 搜索框 */}
      <SearchBar
        ref={searchRef}
        showCancelButton
        onChange={(e) => changeSearch(e)}
        placeholder="请输入小区或地址"
      />

      {/* 搜索提示列表 */}
      <ul className={styles.tips}>{renderTips()}</ul>
    </div>
  )
  
}

export default Search
