import React, { Component } from 'react'

import FilterFooter from '../../../../components/FilterFooter/index.tsx'

import styles from './index.module.css'

type dataItem = {
  label: string
  value: string
}

export default class FilterMore<P extends any> extends Component<P> {
  state = {
    activeArr: []
  }

  changeActive = ({value}: dataItem) => {
    const { activeArr } = this.state
    console.log('item', value)
    // console.log('e', e)
    const isHave = activeArr.some((item) => item === value)
    if(isHave) {
      const _pre = this.state.activeArr
      const _index = _pre.indexOf((item) => item === value)
      _pre.splice(_index, 1)
      this.setState({
        activeArr: _pre
      }, () => {
        console.log('pre', this.state.activeArr)
      })
    }
    else {
      this.setState((preState) => ({
        activeArr: [...(preState as any).activeArr, value]
      }), () => {
        console.log('pre', this.state.activeArr)
      })
    }
  }

  // 渲染标签
  renderFilters(data: {label, value}[]) {
    const { changeActive } = this
    // 高亮类名： styles.tagActive
    return (
      <>
        {
          data.map((item) => {
            let _isActive = false
            _isActive = this.state.activeArr.some(_item => _item === item.value)
            // debugger
            return (
            <span key={item.value} onClick={e => changeActive(item)} className={[styles.tag, _isActive ? styles.tagActive : ''].join(' ')}>{item.label}</span>
          )})
        }
      </>
    )
  }

  componentDidMount() {
    const { moreValue } = this.props
    moreValue.length > 0 && this.setState({activeArr: moreValue})
  }

  render() {
    const { 
      onCancel, 
      onOk, 
      roomType: _roomType,
      oriented: _oriented, 
      floor: _floor, 
      characteristic: _characteristic 
    } = this.props
    console.log('xxxx', 
    _roomType,
    _oriented, 
    _floor, 
    _characteristic )

    return (
      <div className={styles.root}>
        {/* 遮罩层 */}
        <div className={styles.mask} />

        {/* 条件内容 */}
        <div className={styles.tags}>
          <dl className={styles.dl}>
            <dt className={styles.dt}>户型</dt>
            <dd className={styles.dd}>{this.renderFilters(_roomType)}</dd>

            <dt className={styles.dt}>朝向</dt>
            <dd className={styles.dd}>{this.renderFilters(_oriented)}</dd>

            <dt className={styles.dt}>楼层</dt>
            <dd className={styles.dd}>{this.renderFilters(_floor)}</dd>

            <dt className={styles.dt}>房屋亮点</dt>
            <dd className={styles.dd}>{this.renderFilters(_characteristic)}</dd>
          </dl>
        </div>

        {/* 底部按钮 */}
        <FilterFooter className={styles.footer} onCancel={onCancel} onOk={() => onOk(this.state.activeArr)} />
      </div>
    )
  }
}
