import React, { Component } from 'react'
import { useNavigate, Link } from 'react-router-dom'
// import './index.scss'
import styles from './index.module.css'
import Navbar from '../../components/Navbar.tsx'
import axios from 'axios'
import { SpinLoading  } from 'antd-mobile'
import { API } from '../../utils/api'



interface IProps {
    navigate: any
}

const myWithRouter = (ClassComponent) => {
    return (props) => {
        const navigate = useNavigate()
        return (
           <ClassComponent {...props} navigate={navigate}></ClassComponent> 
        )
    }
}

// 覆盖物样式
const labelStyle = {
    cursor: 'pointer',
    border: '0px solid rgb(255, 0, 0)',
    padding: '0px',
    whiteSpace: 'nowrap',
    fontSize: '12px',
    color: 'rgb(255, 255, 255)',
    textAlign: 'center'
}
 
class Map extends Component<IProps> {

    state = {
        map: null,
        // 小区下的房源列表
        housesList: [],
        // 表示是否展示房源列表
        isShowList: false,
        isLoading: false,
    }

    initMap = () => {
        const _this = this

        // 获取当前定位城市
        const { label, value } = JSON.parse(localStorage.getItem('hkzf_currentCity'))
        console.log(label, value)

        var map = new BMapGL.Map('container');
        this.state.map = map
        // map.centerAndZoom(new BMapGL.Point(116.331398,39.897445), 12);
        //创建地址解析器实例
        var myGeo = new BMapGL.Geocoder();
        // 将地址解析结果显示在地图上，并调整地图视野
        myGeo.getPoint(label, async function(point){
            if(point){
                map.centerAndZoom(point, 11);
                // map.addOverlay(new BMapGL.Marker(point, {title: '北京市海淀区上地10街'}))
                // 添加常用控件
                map.addControl(new BMapGL.NavigationControl())
                map.addControl(new BMapGL.ScaleControl())
                
                // 调用 renderOverlays 方法
                _this.renderOverlays(value)

                // const res = await axios.get(
                //     `http://localhost:8085/area/map?id=${value}`
                //   )
                //   console.log('房源数据：', res)
                //   res.data.body.forEach(item => {
                //     // 为每一条数据创建覆盖物
                //     const {
                //       coord: { longitude, latitude },
                //       label: areaName,
                //       count,
                //       value
                //     } = item
                //     // 创建覆盖物
                //     const areaPoint = new BMapGL.Point(longitude, latitude)
        
                //     const label = new BMapGL.Label('', {
                //       position: areaPoint,
                //       offset: new BMapGL.Size(-35, -35)
                //     })
        
                //     // 给 label 对象添加一个唯一标识
                //     label.id = value
        
                //     // 设置房源覆盖物内容
                //     label.setContent(`
                //       <div class="${styles.bubble}">
                //         <p class="${styles.name}">${areaName}</p>
                //         <p>${count}套</p>
                //       </div>
                //     `)
        
                //     // 设置样式
                //     label.setStyle(labelStyle)
        
                //     // 添加单击事件
                //     label.addEventListener('click', () => {
                //       console.log('房源覆盖物被点击了', label.id)
        
                //       // 放大地图，以当前点击的覆盖物为中心放大地图
                //       // 第一个参数：坐标对象
                //       // 第二个参数：放大级别
                //       map.centerAndZoom(areaPoint, 13)
        
                //       // 解决清除覆盖物时，百度地图API的JS文件自身报错的问题
                //       setTimeout(() => {
                //         // 清除当前覆盖物信息
                //         map.clearOverlays()
                //       }, 0)
                //     })
        
                //     // 添加覆盖物到地图中
                //     map.addOverlay(label)
                //   })
            }else{
                alert('您选择的地址没有解析到结果！');
            }
        }, label)

        
        // 给地图绑定移动事件
        this.state.map.addEventListener('movestart', () => {
            // console.log('movestart')
            if (this.state.isShowList) {
                this.setState({
                    isShowList: false
                })
            }
        })

    }

    async renderOverlays(id) {
        this.state.isLoading = true
        // const res = await axios.get(`http://localhost:8085/area/map?id=${id}`)
        const res = await API.get(`/area/map?id=${id}`)
        // console.log('renderOverlays 获取到的数据：', res)
        const data = res.data.body
        this.state.isLoading = false

        // 调用 getTypeAndZoom 方法获取级别和类型
        const { nextZoom, type } = this.getTypeAndZoom()
        console.log(nextZoom, type)

        data.forEach(item => {
        // 创建覆盖物
        this.createOverlays(item, nextZoom, type)
        })
    }

    // 创建覆盖物  // 创建覆盖物
    createOverlays(data, zoom, type) {
        const {
        coord: { longitude, latitude },
        label: areaName,
        count,
        value
        } = data

        // 创建坐标对象
        const areaPoint = new BMapGL.Point(longitude, latitude)

        if (type === 'circle') {
        // 区或镇
        this.createCircle(areaPoint, areaName, count, value, zoom)
        } else {
        // 小区
        this.createRect(areaPoint, areaName, count, value)
        }
    }

    // 创建区、镇覆盖物
    createCircle(point, name, count, id, zoom) {
        // 创建覆盖物
        const label = new BMapGL.Label('', {
        position: point,
        offset: new BMapGL.Size(-35, -35)
        })

        // 给 label 对象添加一个唯一标识
        label.id = id

        // 设置房源覆盖物内容
        label.setContent(`
        <div class="${styles.bubble}">
            <p class="${styles.name}">${name}</p>
            <p>${count}套</p>
        </div>
        `)

        // 设置样式
        label.setStyle(labelStyle)

        // 添加单击事件
        label.addEventListener('click', () => {
            // 调用 renderOverlays 方法，获取该区域下的房源数据
            this.renderOverlays(id)

            // 放大地图，以当前点击的覆盖物为中心放大地图
            this.state.map.centerAndZoom(point, zoom)

            // 解决清除覆盖物时，百度地图API的JS文件自身报错的问题
            setTimeout(() => {
                // 清除当前覆盖物信息
                this.state.map.clearOverlays()
            }, 0)
        })

        // 添加覆盖物到地图中
        this.state.map.addOverlay(label)
    }

    // 创建小区覆盖物
    createRect(point, name, count, id) {
    // 创建覆盖物
    const label = new BMapGL.Label('', {
        position: point,
        offset: new BMapGL.Size(-50, -28)
    })

    // 给 label 对象添加一个唯一标识
    label.id = id

    // 设置房源覆盖物内容
    label.setContent(`
        <div class="${styles.rect}">
        <span class="${styles.housename}">${name}</span>
        <span class="${styles.housenum}">${count}套</span>
        <i class="${styles.arrow}"></i>
        </div>
    `)

    // 设置样式
    label.setStyle(labelStyle)

    // 添加单击事件
    label.addEventListener('click', (e) => {
        console.log('小区被点击了')

        this.getHousesList(id)

        // 获取当前被点击项
        // const target = e.changedTouches[0]
        this.state.map.panBy(
            // window.innerWidth / 2 - target.clientX,
            window.innerWidth / 2 - e.currentTarget.domElement.offsetLeft,
            // (window.innerHeight - 330) / 2 - target.clientY
            (window.innerHeight - 330) / 2 - e.currentTarget.domElement.offsetTop

        )
        // console.log('小区被点击了')
    })

    // 添加覆盖物到地图中
    this.state.map.addOverlay(label)
    }

      // 获取小区房源数据
    async getHousesList(id) {
        const res = await axios.get(`http://localhost:8085/houses?cityId=${id}`)
        // console.log('小区的房源数据:', res)
        this.setState({
            housesList: res.data.body.list,

            // 展示房源列表
            isShowList: true
        })
    }


    getTypeAndZoom() {
        // 调用地图的 getZoom() 方法，来获取当前缩放级别
        const zoom = this.state.map.getZoom()
        let nextZoom, type
    
        // console.log('当前地图缩放级别：', zoom)
        if (zoom >= 10 && zoom < 12) {
          // 区
          // 下一个缩放级别
          nextZoom = 13
          // circle 表示绘制圆形覆盖物（区、镇）
          type = 'circle'
        } else if (zoom >= 12 && zoom < 14) {
          // 镇
          nextZoom = 15
          type = 'circle'
        } else if (zoom >= 14 && zoom < 16) {
          // 小区
          type = 'rect'
        }
    
        return {
          nextZoom,
          type
        }
      }

    componentDidMount() {
        // var map = new BMapGL.Map("container");
        // var point = new BMapGL.Point(116.404, 39.915);
        // map.centerAndZoom(point, 15); 
        this.initMap()
    }

    hBack = () => {
        this.props.navigate(-1)
        // this.state
    }

      // 封装渲染房屋列表的方法
    renderHousesList() {
        return this.state.housesList.map(item => (
            <div className={styles.house} key={item.houseCode}>
                <div className={styles.imgWrap}>
                <img
                    className={styles.img}
                    src={`${process.env.REACT_APP_BASE_URL}${item.houseImg}`}
                    alt=""
                />
                </div>
                <div className={styles.content}>
                <h3 className={styles.title}>{item.title}</h3>
                <div className={styles.desc}>{item.desc}</div>
                <div>
                    {/* ['近地铁', '随时看房'] */}
                    {item.tags.map((tag, index) => {
                    const tagClass = 'tag' + (index + 1)
                    return (
                        <span
                        className={[styles.tag, styles[tagClass]].join(' ')}
                        key={tag}
                        >
                        {tag}
                        </span>
                    )
                    })}
                </div>
                <div className={styles.price}>
                    <span className={styles.priceNum}>{item.price}</span> 元/月
                </div>
                </div>
            </div>
        ))
    }

    renderConatain = () => {
        return (<>
                    <Navbar title='地图'/>
                    <div id='container' className={styles.container}>
                        {/* 我是MAP */}
                    </div>
                    {/* 房源列表 */}
                    {/* 添加 styles.show 展示房屋列表 */}
                    <div
                    className={[
                        styles.houseList,
                        this.state.isShowList ? styles.show : ''
                    ].join(' ')}
                    >
                    <div className={styles.titleWrap}>
                        <h1 className={styles.listTitle}>房屋列表</h1>
                        <Link className={styles.titleMore} to="/home/list">
                        更多房源
                        </Link>
                    </div>

                    <div className={styles.houseItems}>
                        {/* 房屋结构 */}
                        {this.renderHousesList()}
                    </div>
                    </div>
                </>
        )
    }

    isLoading = () => {
        return <SpinLoading /> 
    }

    render() {
        const {hBack, renderConatain} = this
        const {isLoading} = this.state
        console.log('REACT_APP_BASE_URL',process.env.REACT_APP_BASE_URL)
        return (
            <div className={styles.map}>
                {
                   isLoading ? <SpinLoading />  : renderConatain()
                }
                 

                
            </div>
        )
    }
}

export default myWithRouter(Map)
