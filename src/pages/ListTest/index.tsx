import React, {useState, useEffect} from 'react'
import {useParams, useSearchParams, useLocation, useNavigate} from 'react-router-dom'
import NavHeader from '../../components/NavHeader/index.tsx'
import styles from './index.module.css'
import { LeftOutline } from 'antd-mobile-icons'
import Filter from './components/Filter/index.tsx'
import {API} from '../../utils/api'
import { SelectType } from './components/Filter/index.tsx'
import { AxiosResponse } from 'axios'
import HouseItem from '../HouseItem/index'
// 导入吸顶组件
import Sticky from '../../components/Sticky/index.tsx'
import { List, AutoSizer, WindowScroller, InfiniteLoader  } from 'react-virtualized'

type HouseList = {
    data: any
    status: number
    statusText: string
}

type ListItem = {
    desc: string
    houseCode: string
    houseImg?: string
    price: number
    tags: string[]
    title?: string
}


export default function HouseList() {
    // 获取当前定位城市信息
    const { label } = JSON.parse(localStorage.getItem('hkzf_currentCity'))
    const navigate = useNavigate()
    const [ count, setCount ] = useState(0)
    const [ list, setList ] = useState<Array<ListItem>>()
    const listTest = []
    // listTest.length = 200
    for(let i = 0; i < 300; i++) {
        listTest.push(i)
    }

    const hBack = () => {
        navigate(-1)
    }

    const getFilterData = (filterData) => {
        console.log('filterData', filterData)
        searchHouseList(filterData)
    }

      // 用来获取房屋列表数据
    const searchHouseList = async (filterData: SelectType) => {
        // 获取当前定位城市id
        const { value } = JSON.parse(localStorage.getItem('hkzf_currentCity'))
        const res:AxiosResponse<HouseList> = await API.get<HouseList>('/houses', {
        params: {
            cityId: value,
            ...filterData,
            start: 1,
            end: 20
        }
        })

        const {
            data: {
                body: {
                    list,
                    count
                }
            }
        } = res

        console.log('res', res)
        console.log('list', list)
        console.log('count', count)
        setList(list)
        setCount(count)
    }

    // const renderHouseList = () => {

    // }

    const renderHouseList  = ({ key, index, style }) => {
        // 根据索引号来获取当前这一行的房屋数据
        const house = list[index]
    
        // console.log(house)
    
        return (
          <HouseItem
            key={key}
            style={style}
            src={house?.houseImg ? `http://localhost:8085` + house.houseImg : ''}
            title={house.title}
            desc={house.desc}
            tags={house.tags}
            price={house.price}
          />
        )
      }

    
    // 判断列表中的每一行是否加载完成
    const isRowLoaded = ({ index }) => {
        return !!list[index]
    }

    // 用来获取更多房屋列表数据
    // 注意：该方法的返回值是一个 Promise 对象，并且，这个对象应该在数据加载完成时，来调用 resolve 让Promise对象的状态变为已完成。
    const loadMoreRows = ({ startIndex, stopIndex }) => {
        // return fetch(`path/to/api?startIndex=${startIndex}&stopIndex=${stopIndex}`)
        //   .then(response => {
        //     // Store response data in list...
        //   })
        console.log(startIndex, stopIndex)

        return new Promise(resolve => {
        // 数据加载完成时，调用 resolve 即可
        })
    }

    useEffect(() => {
        searchHouseList({})
    }, [])

    return (
        <div id='scrollDiv' style={{height: `600px`, overflow: `scroll`}}>
            <div className={styles.navHeader}>
                <div className={styles.navback} onClick={hBack}><LeftOutline /></div>
                <NavHeader currentName={label} className={styles.searchHeader} classNameSwiper={styles.classNameSwiper}/>    
            </div>
            <Sticky height={40}>
                <Filter getFilterData={getFilterData}/>
            </Sticky>
            {/* 房屋列表 */}
            <div className={styles.houseItems}>
                {
                    listTest.map((item) => (
                        <div>----{item}</div>
                    ))
                }
                {/* <List
                    width={300}
                    height={300}
                    rowCount={count} // List列表项的行数
                    rowHeight={120} // 每一行的高度
                    rowRenderer={renderHouseList} // 渲染列表项中的每一行
                /> */}
                {/*  */}
                            {/* <WindowScroller> */}
                                {/* {({ height, isScrolling, scrollTop }) => ( */}
                                {/* <AutoSizer>
                                    {({ width }) => (
                                    <List
                                        // autoHeight // 设置高度为 WindowScroller 最终渲染的列表高度
                                        width={width} // 视口的宽度
                                        height={height} // 视口的高度
                                        rowCount={count} // List列表项的行数
                                        rowHeight={120} // 每一行的高度
                                        rowRenderer={renderHouseList} // 渲染列表项中的每一行
                                        isScrolling={isScrolling}
                                        scrollTop={scrollTop}
                                    />
                                    )}
                                </AutoSizer> */}
                                {/* )} */}
                            {/* </WindowScroller> */}
            </div>
        </div>
    )
}
