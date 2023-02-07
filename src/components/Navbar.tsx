import React, { FC } from 'react'
import {useNavigate} from 'react-router-dom'
import { NavBar, Space, Toast } from 'antd-mobile'
// import './Navbar.scss'
import styles from './Navbar.module.css'

interface IProps {
    hBack: () => void
    title: string
}

const Navbar:FC<IProps> = (props) => {
    const navigate = useNavigate()
    const defaultAvtive = () => { navigate(-1) }
    return (
        <div id={styles.NavBar}>
            <NavBar  back='返回' onBack={props.hBack || defaultAvtive}>
                {props.title}
            </NavBar>
            {/* {props.children} */}
        </div>
    )
}

export default Navbar