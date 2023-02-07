import React, { Component, FC, useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { NavBar, Space, Toast } from 'antd-mobile'
import axios, { AxiosResponse } from 'axios'
import './index.scss'
// 导入 List 组件
import { List, AutoSizer } from 'react-virtualized'
import Navbar from './Navbar.tsx'
import { getCurrentCityInfo } from '../../utils/index.ts'

interface IProps {

}

type CommonRes<T> = {
    data: Array<{
        body: T
        [propertyName: string]: any
    }>
    status: number
    [propertyName: string]: any
}

type CityInfo = {
    label: string
    pinyin: string
    short: string
    value: string
}

type CityListObj = {
    [propertyName: string]: Array<CityInfo> 
}

type CurrentCity = {
    label: string
    value: string
}

// 索引（A、B等）的高度
const TITLE_HEIGHT = 36
// 每个城市名称的高度
const NAME_HEIGHT = 50

const Citylist:FC<IProps> = () => {
    const [cityList, setCityList] = useState<CityListObj>()
    const [cityIndex, setCityIndex] = useState<string[]>([])
    const [ currentCity, setCurrentCity ] = useState<CurrentCity>({label: '', value: ''})
    const [ activeIndex, setActiveIndex ] = useState(0)
    const listRef = useRef(null)
    const navigate = useNavigate()
    const hBack = () =>{
        Toast.show({
            content: '点击了返回区域',
            duration: 1000,
        })
        navigate(-1)
    }

    const formatCityInfo = (cityInfo: Array<CityInfo>) => {
        let _cityList: CityListObj = {}
        let _cityIndex: string[] = []

        cityInfo.forEach((city, index) => {
            const firstLetter = city.pinyin.substr(0, 1)
            _cityList[firstLetter] ? (_cityList[firstLetter].push(city)) : (_cityList[firstLetter] = [city])
        })
        // debugger
        _cityIndex = Object.keys(_cityList).sort() || []

        return {
            _cityList,
            _cityIndex
        }
    }

    const getCityInfo = async () => {
        try {
            const _resCityInfo: AxiosResponse<CommonRes<Array<CityInfo>>> = await axios.get<CommonRes<Array<CityInfo>>>('http://localhost:8085/area/city?level=1')
            const {
                data: {
                    body: _cityInfo
                }
            } = _resCityInfo
            let {_cityList, _cityIndex} = formatCityInfo(_cityInfo)
            
            const _resHotCityInfo: AxiosResponse<any> = await axios.get('http://localhost:8085/area/hot')
            const {
                data: {
                    body: _hotCityInfo
                }
            } = _resHotCityInfo

            
            const _currentCity = await getCurrentCityInfo()
            setCurrentCity(_currentCity as CurrentCity)

            // console.log('_resHotCityInfo', _resHotCityInfo)
            // console.log('_hotCityInfo', _hotCityInfo)
            _cityList.hot = _hotCityInfo
            _cityIndex.unshift('hot')
            _cityList['#'] = [_currentCity]
            _cityIndex.unshift('#')

            setCityList(_cityList)
            setCityIndex(_cityIndex)

            // 调用 measureAllRows，提前计算 List 中每一行的高度，实现 scrollToRow 的精确跳转
            // 注意：调用这个方法的时候，需要保证 List 组件中已经有数据了！如果 List 组件中的数据为空，就会导致调用方法报错！
            // 解决：只要保证这个方法是在 获取到数据之后 调用的即可。
            listRef.current.measureAllRows()
        }
        catch(err) {
            console.log('err', err)
        }
    } 

    const hChangeCity = (cityItem: CityInfo) => {
        const {label, value} = cityItem
        const _hasHouseCity = ['北京', '上海', '广州', '深圳']
        if(_hasHouseCity.some((item) => item = cityItem.label)) {
            localStorage.setItem('hkzf_currentCity', JSON.stringify({ label, value }))
            navigate(-1)
        }
        else {
            Toast.info('该城市暂无房源数据', 1, null, false)
        }
    }

    // 列表数据的数据源
    // const list = Array(100).fill('react-virtualized')

    // 渲染每一行数据的渲染函数
    // 函数的返回值就表示最终渲染在页面中的内容
    const rowRenderer = ({
        key, // Unique key within array of rows
        index, // 索引号
        isScrolling, // 当前项是否正在滚动中
        isVisible, // 当前项在 List 中是可见的
        style // 注意：重点属性，一定要给每一个行数据添加该样式！作用：指定每一行的位置
    }) => {
        const letter = cityIndex[index]
        return (
            <div key={key} style={style}>
                <div key={key} className="city">
                    {/* 丫的，狗一样的style, 加了样式出错！！！！！！！！！！！！！！！！！！！！！ */}
                {/* <div key={key} style={style} className="city"> */}
                    <div className="title">{cityIndex[index]}</div>
                    {/* {
                       cityIndex.map(item => (
                        <div className="title" key={item}>{item}</div>
                       )) 
                    } */}
                    {/* <div className="name">上海</div> */}
                    {cityList[letter].map(item => (
                    <div className="name" key={item.value} onClick={()=> {hChangeCity(item)}}>
                        {item.label}
                    </div>
                    ))}
                </div>
            </div>
    )
    }

    
  // 创建动态计算每一行高度的方法
   const getRowHeight = ({ index }) => {
        // 索引标题高度 + 城市数量 * 城市名称的高度
        // TITLE_HEIGHT + cityList[cityIndex[index]].length * NAME_HEIGHT
        // const { cityList, cityIndex } = this.state
        return TITLE_HEIGHT + cityList[cityIndex[index]].length * NAME_HEIGHT
    } 

    const hChangeActive = (index: number) => {
        setActiveIndex(index)
        console.log('listRef.current.value', listRef.current.value)
        listRef.current.scrollToRow(index)
    }

    // 封装渲染右侧索引列表的方法
    const renderCityIndex = () => {
        // 获取到 cityIndex，并遍历其，实现渲染
        // const { cityIndex, activeIndex } = this.state
        return cityIndex.map((item, index) => (
        <li className="city-index-item" key={item}>
            <span className={activeIndex === index ? 'index-active' : ''} onClick={() => {hChangeActive(index)}}>
            {item === 'hot' ? '热' : item.toUpperCase()}
            </span>
        </li>
        ))
    }

    const onRowsRendered = ({ startIndex }) => {
        console.log('startIndex', startIndex)
        //  cityIndex[startIndex] 
        if(startIndex === activeIndex) return
        setActiveIndex(startIndex)
    }

    useEffect(() => {
        getCityInfo()
        // getCurrentCity()
    }, [])

    useEffect(() => {
        // console.log('cityList', cityList)
        // console.log('cityIndex', cityIndex)
    }, [cityList, cityIndex])

    return (
        <div id="cityListIndex">
            <Navbar hBack={hBack} title='城市列表'></Navbar>
            {/* { currentCity.label }1 */}
            {/* 城市列表 */}
            <AutoSizer>
                {
                    ({width, height}) => (
                        <List
                            ref={listRef}
                            width={width}
                            height={height}
                            rowCount={cityIndex.length}
                            rowHeight={getRowHeight}
                            rowRenderer={rowRenderer}
                            onRowsRendered={onRowsRendered}
                            scrollToAlignment="start"
                        />
                    )
                }
            </AutoSizer>

            
            <ul className="city-index">{renderCityIndex()}</ul>
        </div>
    )
}

export default Citylist


