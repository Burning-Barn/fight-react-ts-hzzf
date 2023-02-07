import React, { FC } from 'react'
import { NavBar, Space, Toast } from 'antd-mobile'
import './Navbar.scss'

interface IProps {
    hBack: () => void
    title: string
}

const Navbar:FC<IProps> = (props) => {
    return (
        <div id='citylistNavBar'>
            <NavBar  back='返回' onBack={props.hBack}>
                {props.title}
            </NavBar>
            {/* {props.children} */}
        </div>
    )
}

export default Navbar