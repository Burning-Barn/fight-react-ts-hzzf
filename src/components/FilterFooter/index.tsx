import React from 'react'

// import { Flex } from 'antd-mobile'
import PropTypes from 'prop-types'

import styles from './index.module.css'

type IProps = {
  cancelText: string,
  okText: string,
  onCancel: () => void,
  onOk: () => void,
  className?: string
}

function FilterFooter({
  cancelText = '取消',
  okText = '确定',
  onCancel,
  onOk,
  className
}: IProps) {
  return (
    // <Flex className={[styles.root, className || ''].join(' ')}>
    <div className={[styles.root, className || ''].join(' ')}>
      {/* 取消按钮 */}
      <span
        className={[styles.btn, styles.cancel].join(' ')}
        onClick={onCancel}
      >
        {cancelText}
      </span>

      {/* 确定按钮 */}
      <span className={[styles.btn, styles.ok].join(' ')} onClick={onOk}>
        {okText}
      </span>
    </div>
  )
}

export default FilterFooter
