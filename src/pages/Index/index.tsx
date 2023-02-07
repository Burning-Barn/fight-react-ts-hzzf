import React, { useRef, useState, useEffect, MouseEvent } from 'react'
import {useNavigate, useParams, useSearchParams, useLocation} from 'react-router-dom'
import { Button, Space, Swiper, Toast, Grid, SearchBar} from 'antd-mobile'
import { FaceRecognitionOutline } from 'antd-mobile-icons'
import { SwiperRef } from 'antd-mobile/es/components/swiper'
import './index.scss'
import axios, {AxiosResponse, AxiosError} from 'axios'
// 导入导航菜单图片
import Nav1 from '../../assets/images/nav-1.png'
import Nav2 from '../../assets/images/nav-2.png'
import Nav3 from '../../assets/images/nav-3.png'
import Nav4 from '../../assets/images/nav-4.png'
import { getCurrentCityInfo } from '../../utils/index.ts'

const colors = ['#ace0ff', '#bcffbd', '#e4fabd', '#ffcfac']

// typeScript类型
type GroupStateItem = {
    id: number
    title: string
    imgSrc: string
    desc: string
}
type GroupState = [{
        id: number
        title: string
        imgSrc: string
        desc: string
}]

type newState = [{
    id: number,
    title: string,
    imgSrc: string,
    from: string,
    date: string
}]

type swiperState = {
    id: number,
    alt: string,
    imgSrc: string,
}

type CurrentCityState = {
    label: string
    value: string
}

interface CommonResData {
    status: number
    [propertyName: string]: any
}

interface resCity extends CommonResData {
    data: {
        body: CurrentCityState,
        [propertyName: string]: any
    }
}

interface resSwipperData extends CommonResData {
    data: {
        body: GroupState,
        [propertyName: string]: any
    }
}

interface resNews extends CommonResData {
    data: {
        body: newState,
        [propertyName: string]: any
    }
}

interface resGroups extends resSwipperData {
    statusText: string
}

 const Index = (props) => {
    //  数据
    const navigate = useNavigate()
    const params = useParams()
    const [searchParams, setSearchParams] = useSearchParams()
    const location = useLocation()

    const flexDivData = [
        {
            id: 1,
            name: '整租',
            Nav: Nav1,
            path: '/home/list'
        },
        {
            id: 2,
            name: '合租',
            Nav: Nav2,
            path: '/home/list'
        },
        {
            id: 3,
            name: '地图找房',
            Nav: Nav3,
            path: '/map'
        },
        {
            id: 4,
            name: '去出租',
            Nav: Nav4,
            path: '/rent'
        },
    ]
    const [swiper, setSwiper] = useState<Array<swiperState>>([])
    const [groups, setGroups] = useState<GroupState | []>([])
    const [news, setNews] = useState<newState | []>([])
    const [currentCity, setCurrentCity] = useState<CurrentCityState>({label: '上海', value: ''})


    // 方法 
    const getSwipper = async () => {
        try {
            const resSwiper:AxiosResponse<resSwipperData> = await axios.get<resSwipperData>('http://localhost:8085/home/swiper')
            const {
                data: {
                    body: _swiper
                }
            } = resSwiper
            // console.log('resSwiper', resSwiper)
            // console.log('_swiper', _swiper)
            if(resSwiper.status === 200) {
                setSwiper(_swiper)
            }
            else {
                console.log('获取数据失败')
            }
        }
        catch(err) {
            if((err as AxiosError)?.response?.status === 400) {
                // 给出错误提示
                console.log('获取数据失败')
            }
            console.log(err)
        }
    }

    const getGroups = async () => {
        try {
            const resGroups: AxiosResponse<resGroups> = await axios.get<resGroups>(`http://localhost:8085/home/groups`, {
                params: {area: `AREA%7C88cff55c-aaa4-e2e0`},
            })
            console.log('resGroups', resGroups)
            const {
                data: {
                    body: _resGroups
                }
            } = resGroups
            if(resGroups.status === 200) {
                setGroups(_resGroups)
            }
            else {
                Toast.show({
                    icon: 'fail',
                    content: '获取数据失败',
                })

            }

        }
        catch(err) {
            Toast.show({
                icon: 'fail',
                content: '获取数据失败',
            })
        }
    }

    const getNews = async () => {
        try {
            const resNews: AxiosResponse<resNews> = await axios.get<resNews>(
                'http://localhost:8085/home/news?area=AREA%7C88cff55c-aaa4-e2e0'
            )
            console.log('resNews', resNews)
            const {
                data: {
                    body: _resNews
                }
            } = resNews
            if(resNews.status === 200) {
                setNews(_resNews)
            }
            else {
                Toast.show({
                    icon: 'fail',
                    content: '获取数据失败',
                })

            }
        }
        catch (err) {

        }
    }

    // const getCurrentCityInfo = async (currentCity: string) => {
    //     try {
    //         const resCity:AxiosResponse<resCity> = await axios.get<resCity>(`http://localhost:8085/area/info`, {params: {name: currentCity}})
    //         console.log('resCity', resCity)
    //         const {
    //             data: {
    //                 body: _currentCity
    //             }
    //         } = resCity
    //         setCurrentCity(_currentCity)
    //     }
    //     catch(err) {
    //         console.log('err', err)
    //     }
    // }

    const getCurrentCity = async () => {
        const _currentCity = await getCurrentCityInfo()
        setCurrentCity(_currentCity)
        // AMap.plugin('AMap.CitySearch', function () {
        //     var citySearch = new AMap.CitySearch()
        //     citySearch.getLocalCity(function (status, result) {
        //       if (status === 'complete' && result.info === 'OK') {
        //         // 查询成功，result即为当前所在城市信息
        //         // console.log('status', status)
        //         console.log('result', result)
        //         result.city && getCurrentCityInfo(result.city)
        //       }
        //     })
        //   })
    }

    const hGo = (path: string) => {
        navigate(path)
        console.log('props', props)
    }

    const goNews = (e: React.MouseEvent<HTMLDivElement>, newItem) => {

    }

    const goGrid = (e: React.MouseEvent<HTMLDivElement> , group: GroupStateItem) => {

    }

    const hTest = () => {
        navigate(`/home/list?id=1&number=100`)
        // navigate(`/home/list`, {state: {a: '1', b: '2'}})
        // navigate(`/home/list/999`)
    }

      // 渲染最新资讯
    const renderNews = () => {
        return (news as newState).map(item => (
            <div className="news-item" key={item.id} onClick={(e) => goNews(e, item)}>
                <div className="imgwrap">
                    <img
                    className="img"
                    src={`http://localhost:8085${item.imgSrc}`}
                    alt=""
                    />
                </div>
                <div className="content" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                    <h3 className="title">{item.title}</h3>
                    <div className="info" >
                    <span>{item.from}</span>
                    <span>{item.date}</span>
                    </div>
                </div>
            </div>
        ))
    }

    // tsx结构
    const items = swiper.map((swiperItem, swiperIndex) => (
      <Swiper.Item key={swiperItem.id}>
        <div
          className='swiperContainer'
          onClick={() => {
            Toast.show(`你点击了卡片 ${swiperItem.id}`)
          }}
        >
            <img style={{height: 212}} src={`http://localhost:8085${swiperItem.imgSrc}`}></img>
        </div>
      </Swiper.Item>
    ))
    const ref = useRef<SwiperRef>(null)



    const flexDiv = () => {
        return (
            <div className='flexDiv'>
                {
                    flexDivData.map((flexItem, flexIndex) => (
                        <div key={flexIndex} className='flexIconDiv' onClick={() => {hGo(flexItem.path)}}>
                            {/* <FaceRecognitionOutline /> */}
                            <img src={flexItem.Nav} alt="" style={{
                                width: 48,
                                height: 'auto',}}
                            />
                            {flexItem.name}
                        </div>
                    ))
                }
            </div>
        )
    }
    
    // 副作用
    useEffect(() => {
        getSwipper()
        getGroups()
        getNews()
        // 获取当前城市
        getCurrentCity()
    }, [])

    return (
      <>
            {/* <SearchBar className='searchBar' placeholder='请输入内容' /> */}
            <div className='swiper'>
                <Swiper autoplay>{items}</Swiper>
                
                {/* 搜索框 */}
                <div className="search-box">
                    {/* 左侧白色区域 */}
                    <div className="search">
                        {/* 位置 */}
                        <div
                            className="location"
                            onClick={() => navigate('/citylist')}
                        >
                            <span className="name">{currentCity.label}</span>
                            <i className="iconfont icon-arrow" />
                        </div>
        
                        {/* 搜索表单 */}
                        <div
                            className="form"
                            onClick={() => navigate('/search')}
                        >
                            <i className="iconfont icon-seach" />
                            <span className="text">请输入小区或地址</span>
                        </div>
                    </div>
                    {/* 右侧地图图标 */}
                    <i
                        className="iconfont icon-map"
                        onClick={() => navigate('/map')}
                    />
                </div>

            </div>


            {flexDiv()}
                   {/* 租房小组 */}
            <div className="group">
            <h3 className="group-title">
                租房小组 <span className="more" onClick={hTest}>更多</span>
            </h3>

            {/* 宫格组件 */}
            
            <Grid columns={2} gap={groups.length}>
                {
                    groups.length > 0 && (groups as GroupState).map((group, groupIndex) => (
                        <Grid.Item key={group.id} className='group-item' onClick={(e) => {goGrid(e, group)}}>
                            <div className='desc'>
                                <div className='title'>{group.title}</div>
                                <div className='info'>{group.desc}</div>
                            </div>
                            <img src={`http://localhost:8085${group.imgSrc}`}></img>
                        </Grid.Item>
                    ))
                }
            </Grid>

            {/* 最新资讯 */}
                <div className="news">
                <h3 className="group-title">最新资讯</h3>
                <div>{renderNews()}</div>
                </div>
            </div>
      </>
    )
}
export default Index 
