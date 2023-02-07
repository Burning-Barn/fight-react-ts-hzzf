import React, { FC, useState,useEffect } from 'react'

import FilterTitle from '../FilterTitle/index.tsx'
import FilterPicker from '../FilterPicker/index.tsx'
import FilterMore from '../FilterMore/index.tsx'
import {API} from '../../../../utils/api'

import styles from './index.module.css'

interface IProps {
  getFilterData:(filterData: SelectType) => void
}

type PropsFilterPicker = {
  selectFilterData: selectFilterData
  filterData: any
  currentSelected: keyof Selected | ''
  showPicker: boolean
  onCancel: () => void
  onOk: () => void
}

type PropsFilterMore = {
  onCancel: () => void
  onOk: () => void
}

type FilterTitles = {
  title: string;
  type: string;
  isSelected: boolean;
}[]

type Selected = {
  'area': boolean
  'mode': boolean
  'price': boolean
  'more': boolean
}

type selectFilterData = {
  area: Array<string>,
  mode: Array<string>,
  price: Array<string>,
  more: Array<string>,
}

type SelectType = {
  area: Array<string>,
  mode: string,
  price: string,
  more: string,
}

const Filter:FC<IProps> = (props) => {
  // 设置选中显示的项目
  const [selected, setSelected] = useState<Selected>({
    area: false,
    mode: false,
    price: false,
    more: false,
  })
  const [showPicker, setShowPicker] = useState(false)
  const [showMore, setShowMore] = useState(false)
  const [filterData, setFilterData] = useState()
  const [moreValue, setMoreValue] = useState<string[]>([])
  const [selectFilterData, setSelectFilterData] = useState<selectFilterData>({
    area: [],
    mode: [],
    price: [],
    more: [],
  })
  // 当前选中值
  const [currentSelected, setCurrentSelected] = useState<keyof Selected | ''>('')

  const selectType = (item) => {
    setCurrentSelected(item)
    setSelected((pre) => {
      return {
        ...pre,
        [item]: true,
      }
    })
  }

  const onOk = (value, type) => {
    setSelected({
      area: false,
      mode: false,
      price: false,
      more: false,
    })
    console.log('filter里的value', value)
    console.log('filter里的type', type)

    setSelectFilterData((pre) => {
      return {
        ...pre,
        [type]: value[type]
      }
    })

  }

  const onCancel = () => {
    setSelected({
      area: false,
      mode: false,
      price: false,
      more: false,})
    // Object.keys(selected).map(item => {
    //   // debugger
    //   setSelected({[item]: false})
    // })
  }

    // 封装获取所有筛选条件的方法
  const getFiltersData = async () => {
      // 获取当前定位城市id
      const { value } = JSON.parse(localStorage.getItem('hkzf_currentCity'))
      const res = await API.get(`/houses/condition?id=${value}`)
      const {
        data: {
          body: _filterData
        }
      } = res
      console.log('_filterData', _filterData)
      setFilterData(_filterData)
    }

  const getCurrentSelected = () => {

  }

  const hMoreOk = (value) => {
    setShowMore(false)
    console.log('more的值', value)
    setMoreValue(value)    

    setSelectFilterData((pre) => {
      return {
        ...pre,
        ['more']: value
      }
    })
  }

  const hMoreCancel = () => {
    setShowMore(false)
  }

  useEffect(() => {
    const _selected = Object.keys(selected).filter((item) => item !== 'more')
    const _isShow = _selected.some((item) => selected[item])
    setShowPicker(_isShow)

    const _selectedMore = selected.more
    setShowMore(_selectedMore)
  }, [selected])

  useEffect(() => {
    // console.log('selectFilterDat111a', selectFilterData)
    // console.log('最新的选中值：', selectFilterData)
    const { area, mode, price, more } = selectFilterData

    // 筛选条件数据
    const filters:SelectType = {} as SelectType

    // 区域
    const areaKey = area[0]
    let areaValue = 'null'
    if (area.length >= 3) {
      areaValue = area[2] !== 'null' ? area[2] : area[1]
    }
    filters[areaKey] = areaValue

    // 方式和租金
    filters.mode = mode[0]
    filters.price = price[0]

    // 更多筛选条件 more
    filters.more = more.join(',')

    // console.log('filters', filters)
    props.getFilterData(filters)

  }, [selectFilterData])

  useEffect(() => {
    getFiltersData()
  }, [])

  // filterData
  const getShowMoreJSX = ():React.ReactNode => {
    const { roomType, oriented, floor, characteristic } = filterData as any
    const _data = {
      roomType,
      oriented, 
      floor, 
      characteristic 
    }
    return (
      <>
        {showMore && <FilterMore<PropsFilterMore> {..._data} moreValue={moreValue} onCancel={hMoreCancel} onOk={hMoreOk} />}
      </>

    )
  }

  return(
      <div className={styles.root}>
        {/* 前三个菜单的遮罩层 */}
        {showPicker && <div className={styles.mask} onClick={onCancel} />}

        <div className={styles.content}>
          {/* 标题栏 */}
          <FilterTitle selectType={selectType} selected={selected} selectFilterData={selectFilterData}/>

          {/* 前三个菜单对应的内容： */}
          {showPicker && <FilterPicker<PropsFilterPicker> selectFilterData={selectFilterData} currentSelected={currentSelected} filterData={filterData} showPicker={showPicker} onCancel={onCancel} onOk={onOk}/>}

          {/* 最后一个菜单对应的内容： */}
          {filterData && getShowMoreJSX()}
        </div>
      </div>
    )
}

export default Filter
export {FilterTitles, Selected, SelectType}
