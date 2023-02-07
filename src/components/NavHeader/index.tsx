import React, {useState, FC} from 'react'
import {useNavigate, useParams, useSearchParams, useLocation} from 'react-router-dom'
import './index.scss'

type IProps = {
    currentName: string
    className: any
    classNameSwiper: any
}

const NavHeader:FC<IProps> = (props) => {
    const navigate = useNavigate()
    
    return (
            <div className={['swiper', props.classNameSwiper || ''].join(' ')}>
                {/* 搜索框 */}
                <div className={["search-box", props.className || ''].join(' ')}>
                    {/* 左侧白色区域 */}
                    <div className="search">
                        {/* 位置 */}
                        <div
                            className="location"
                            onClick={() => navigate('/citylist')}
                        >
                            <span className="name">{props.currentName}</span>
                            <i className="iconfont icon-arrow" />
                        </div>

                        {/* {props.children} */}
        
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
    )
}

export default NavHeader
