import React from 'react'

// import { Flex } from 'antd-mobile'

import styles from './index.module.css'
import { Divider } from 'antd-mobile'

import {FilterTitles, Selected} from '../Filter/index.tsx'

type PropsFilterTitle = {
  selectType: (item: FilterTitles[number]) => void
  filterTitle: FilterTitles
  selected: Selected
  currentSelected: keyof Selected | ''
}

export default function FilterTitle(props: PropsFilterTitle):React.ReactNode {
  // 条件筛选栏标题数组：
  const titleList = [
    { title: '区域', type: 'area' },
    { title: '方式', type: 'mode' },
    { title: '租金', type: 'price' },
    { title: '筛选', type: 'more' }
  ]

  return (
    <>
      <div className={styles.root} >
          {titleList.map((item) => {
              const { selectFilterData: _selectFilterData } = props
              // const _selected = props.selected[item.type]
              // const _selected = _currentSelected === item.type
              const _selected = _selectFilterData[item.type]?.length !== 0
              return (
              <span key={item.type} onClick={() => {props.selectType(item.type)}} className={[styles.dropdown, _selected?styles.selected:''].join(' ')}>
                  <span>{item.title}</span>
                  <i className="iconfont icon-arrow" />
              </span>)
        })}
      </div>
    </>
  )
}
