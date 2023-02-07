import React, { Component } from 'react'
import  { useLocation, useParams, useSearchParams, useNavigate } from 'react-router-dom'

import { Carousel, Flex, Modal, Toast } from 'antd-mobile'
import { API } from '../../utils/api'
import {isAuth} from '../../utils/auth'

import NavHeader from '../../components/NavHeader/index.tsx'
import HouseItem from '../../components/HouseItem'
import HousePackage from '../../components/HousePackage'

// import { BASE_URL } from '../../utils/url'

import styles from './index.module.css'
const  BASE_URL = `http://localhost:8085`

// 猜你喜欢
const recommendHouses = [
  {
    id: 1,
    src: BASE_URL + '/img/message/1.png',
    desc: '72.32㎡/南 北/低楼层',
    title: '安贞西里 3室1厅',
    price: 4500,
    tags: ['随时看房']
  },
  {
    id: 2,
    src: BASE_URL + '/img/message/2.png',
    desc: '83㎡/南/高楼层',
    title: '天居园 2室1厅',
    price: 7200,
    tags: ['近地铁']
  },
  {
    id: 3,
    src: BASE_URL + '/img/message/3.png',
    desc: '52㎡/西南/低楼层',
    title: '角门甲4号院 1室1厅',
    price: 4300,
    tags: ['集中供暖']
  }
]

// 百度地图

const labelStyle = {
  position: 'absolute',
  zIndex: -7982820,
  backgroundColor: 'rgb(238, 93, 91)',
  color: 'rgb(255, 255, 255)',
  height: 25,
  padding: '5px 10px',
  lineHeight: '14px',
  borderRadius: 3,
  boxShadow: 'rgb(204, 204, 204) 2px 2px 2px',
  whiteSpace: 'nowrap',
  fontSize: 12,
  userSelect: 'none'
}

const myWithRouter = (RNode) => {
  return ():React.ReactNode => {
    debugger
    const params = useParams()
    const [searchParams, setSearchParams] = useSearchParams()
    const location = useLocation()
    const navigate = useNavigate()
  
    const _id = searchParams.get('id')
    return (
      <>
          <RNode  id={_id} location={location} navigate={navigate}></RNode>
      </>
    ) 
  }
}

type IProps = {
  id: any
  location: any
  navigate: any
}

 class HouseDetail extends Component<IProps> {
  state = {
    isLoading: false,
    isFavorite: false,

    houseInfo: {
      // 房屋图片
      slides: [],
      // 标题
      title: '',
      // 标签
      tags: [],
      // 租金
      price: 0,
      // 房型
      roomType: '两室一厅',
      // 房屋面积
      size: 89,
      // 装修类型
      renovation: '精装',
      // 朝向
      oriented: [],
      // 楼层
      floor: '',
      // 小区名称
      community: '',
      // 地理位置
      coord: {
        latitude: '39.928033',
        longitude: '116.529466'
      },
      // 房屋配套
      supporting: [],
      // 房屋标识
      houseCode: '',
      // 房屋描述
      description: ''
    }
  } 
   async getHouseDetail() {
    const { id } = this.props

    // 开启loading
    this.setState({
      isLoading: true
    })

    const res = await API.get(`/houses/${id}`)

    console.log(res.data.body)

    this.setState({
      houseInfo: res.data.body,
      isLoading: false
    })

    const { community, coord } = res.data.body

    // 渲染地图
    // this.renderMap(community, coord)
  }

  checkFavorite = async () => {
    const _isAuth = isAuth()

    if(!_isAuth) {
      return
    }
    
    const res = await API.get(`/user/favorites/${this.props.id}`)
    const { status, body } = res.data
    if (status === 200) {
      // 表示请求已经成功，需要更新 isFavorite 的值
      this.setState({
        isFavorite: body.isFavorite,
      })
    }

  }

  pushFavorite = async () => {
    debugger
    const _this = this
    const _isAuth = isAuth()
    if(!_isAuth) {
      Modal.alert({
        content: '未登录，去登录',
        onConfirm: () => {
          _this.props.navigate('/login')
        },
      })
      return
    }

    if(_this.state.isFavorite) {
      // 已收藏，应该删除收藏
        _this.setState({isFavorite: false})
      const res = await API.delete(`/user/favorites/${this.props.id}`)
      if(res.status === 200) {
        // _this.setState({isFavorite: false})
        Toast.show({
          // icon: 'fail',
          content: '取消收藏成功',
        })
      } 
      else if(res.status === 400) {
        Toast.show({
          icon: 'fail',
          content: '登录超时，请重新登陆',
        })
      }
    }
    else {
      // 未收藏，应该添加收藏
      const res = await API.post(`/user/favorites/${this.props.id}`)
      if(res.status === 200) {
        _this.setState({isFavorite: true})
        Toast.show({
          // icon: 'fail',
          content: '收藏成功',
        })
      }
      else if(res.status === 400) {
        Toast.show({
          icon: 'fail',
          content: '登录超时，请重新登陆',
        })
      }
      else {

      }

    }


  }

  componentDidMount() {
    console.log('searchParams', this.props.id)
    this.getHouseDetail()
    this.renderMap('天山星城', {
      latitude: '31.219228',
      longitude: '121.391768'
    })
    
    this.checkFavorite()
  }

  // 渲染轮播图结构
  renderSwipers() {
    const {
      houseInfo: { slides }
    } = this.state

    return slides.map(item => (
      <a
        key={item.id}
        href="http://itcast.cn"
        style={{
          display: 'inline-block',
          width: '100%',
          height: 252
        }}
      >
        <img
          src={BASE_URL + item.imgSrc}
          alt=""
          style={{ width: '100%', verticalAlign: 'top' }}
        />
      </a>
    ))
  }

  // 渲染地图
  renderMap(community, coord) {
    const { latitude, longitude } = coord

    const map = new BMapGL.Map('map')
    const point = new BMapGL.Point(longitude, latitude)
    map.centerAndZoom(point, 17)

    const label = new BMapGL.Label('', {
      position: point,
      offset: new BMapGL.Size(0, -36)
    })

    label.setStyle(labelStyle)
    label.setContent(`
      <span>${community}</span>
      <div class="${styles.mapArrow}"></div>
    `)
    map.addOverlay(label)
  }

    // 渲染标签
    renderTags() {
      const {
        houseInfo: { tags }
      } = this.state
  
      return tags.map((item, index) => {
        // 如果标签数量超过3个，后面的标签就都展示位第三个标签的样式
        let tagClass = ''
        if (index > 2) {
          tagClass = 'tag3'
        } else {
          tagClass = 'tag' + (index + 1)
        }
  
        return (
          <span key={item} className={[styles.tag, styles[tagClass]].join(' ')}>
            {item}
          </span>
        )
      })
    }

    render() {
      const {
        isLoading,
        houseInfo: {
          community,
          title,
          price,
          roomType,
          size,
          floor,
          oriented,
          supporting,
          description
        }
      } = this.state
      return (
        <div className={styles.root} style={{height: '100%', overflow:'scroll'}}>
          {/* 导航栏 */}
          <NavHeader
            className={styles.navHeader}
            rightContent={[<i key="share" className="iconfont icon-share" />]}
          >
            {community}
          </NavHeader>
  
          {/* 轮播图 */}
          <div className={styles.slides}>
            {!isLoading ? (
              ''
              // <Carousel autoplay infinite autoplayInterval={5000}>
              //   {this.renderSwipers()}
              // </Carousel>
            ) : (
              ''
            )}
          </div>
  
          {/* 房屋基础信息 */}
          <div className={styles.info}>
            <h3 className={styles.infoTitle}>{title}</h3>
            <div className={styles.tags}>
              <div>{this.renderTags()}</div>
            </div>
  
            <div className={styles.infoPrice}>
              <div className={styles.infoPriceItem}>
                <div>
                  {price}
                  <span className={styles.month}>/月</span>
                </div>
                <div>租金</div>
              </div>
              <div className={styles.infoPriceItem}>
                <div>{roomType}</div>
                <div>房型</div>
              </div>
              <div className={styles.infoPriceItem}>
                <div>{size}平米</div>
                <div>面积</div>
              </div>
            </div>
  
            <div className={styles.infoBasic} align="start">
              <div>
                <div>
                  <span className={styles.title}>装修：</span>
                  精装
                </div>
                <div>
                  <span className={styles.title}>楼层：</span>
                  {floor}
                </div>
              </div>
              <div>
                <div>
                  <span className={styles.title}>朝向：</span>
                  {oriented.join('、')}
                </div>
                <div>
                  <span className={styles.title}>类型：</span>普通住宅
                </div>
              </div>
            </div>
          </div>
  
          {/* 地图位置 */}
          <div className={styles.map}>
            <div className={styles.mapTitle}>
              小区：
              <span>{community}</span>
            </div>
            <div className={styles.mapContainer} id="map">
              地图
            </div>
          </div>
  
          {/* 房屋配套 */}
          <div className={styles.about}>
            <div className={styles.houseTitle}>房屋配套</div>
            {/* <HousePackage list={supporting} /> */}
            {/* <div className="title-empty">暂无数据</div> */}
  
            {supporting.length === 0 ? (
              <div className={styles.titleEmpty}>暂无数据</div>
            ) : (
              <HousePackage list={supporting} />
            )}
          </div>
  
          {/* 房屋概况 */}
          <div className={styles.set}>
            <div className={styles.houseTitle}>房源概况</div>
            <div>
              <div className={styles.contact}>
                <div className={styles.user}>
                  <img src={BASE_URL + '/img/avatar.png'} alt="头像" />
                  <div className={styles.useInfo}>
                    <div>王女士</div>
                    <div className={styles.userAuth}>
                      <i className="iconfont icon-auth" />
                      已认证房主
                    </div>
                  </div>
                </div>
                <span className={styles.userMsg}>发消息</span>
              </div>
  
              <div className={styles.descText}>
                {description || '暂无房屋描述'}
              </div>
            </div>
          </div>
  
          {/* 推荐 */}
          <div className={styles.recommend}>
            <div className={styles.houseTitle}>猜你喜欢</div>
            <div className={styles.items}>
              {recommendHouses.map(item => (
                <HouseItem {...item} key={item.id} />
              ))}
            </div>
          </div>
  
          {/* 底部收藏按钮 */}
          <div className={styles.fixedBottom} style={{
            position: `fixed`,
            justifyContent: `space-around`,
            bottom: `52px`,}}>
            <div>
              <img
                src={BASE_URL + '/img/unstar.png'}
                className={styles.favoriteImg}
                alt="收藏"
              />
              <span onClick={this.pushFavorite} className={styles.favorite}>{this.state.isFavorite? `已收藏` : `收藏`}</span>
            </div>
            <div>在线咨询</div>
            <div>
              <a href="tel:400-618-4000" className={styles.telephone}>
                电话预约
              </a>
            </div>
          </div>
        </div>
      )
    }
}

export default myWithRouter(HouseDetail)
// export default HouseDetail
