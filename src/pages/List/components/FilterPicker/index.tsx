import React, { Component, useState, useEffect } from 'react'

import { CascadePickerView, PickerView } from 'antd-mobile'

import FilterFooter from '../../../../components/FilterFooter/index.tsx'

const province = [
  {
    label: '北京',
    value: '01',
    children: [
      {
        label: '东城区',
        value: '01-1'
      },
      {
        label: '西城区',
        value: '01-2'
      },
      {
        label: '崇文区',
        value: '01-3'
      },
      {
        label: '宣武区',
        value: '01-4'
      }
    ]
  },
  {
    label: '浙江',
    value: '02',
    children: [
      {
        label: '杭州',
        value: '02-1',
        children: [
          {
            label: '西湖区',
            value: '02-1-1'
          },
          {
            label: '上城区',
            value: '02-1-2'
          },
          {
            label: '江干区',
            value: '02-1-3'
          },
          {
            label: '下城区',
            value: '02-1-4'
          }
        ]
      },
      {
        label: '宁波',
        value: '02-2',
        children: [
          {
            label: 'xx区',
            value: '02-2-1'
          },
          {
            label: 'yy区',
            value: '02-2-2'
          }
        ]
      },
      {
        label: '温州',
        value: '02-3'
      },
      {
        label: '嘉兴',
        value: '02-4'
      },
      {
        label: '湖州',
        value: '02-5'
      },
      {
        label: '绍兴',
        value: '02-6'
      }
    ]
  }
]

const FilterPicker = <P extends any>(props: P) => {
    const [priceValue, setPriceValue] = useState<string[]>()
    const [modeValue, setModeValue] = useState<string[]>()
    const [areaValue, setAreaValue] = useState<string[]>()

    useEffect(() => {
      const { selectFilterData: _selectFilterData } = props
      // setValue(_selectFilterData)
      // setPriceValue()
      // setModeValue()
      // setAreaValue()
    }, [])

    const getPickViewJSX = () => {
      const _typeMapping = {
        area: ['area', 'subway'],
        mode: 'rentType',
        price: 'price',
        more: 'more',
      }
      const { filterData: _filterData, selectFilterData: _selectFilterData } = props
      const _currentSelected = _typeMapping[props.currentSelected]
      const _defaultValue = _selectFilterData[props.currentSelected]

      if(['price'].includes(props.currentSelected)) {
        return (
          <PickerView 
            columns={[_filterData[_currentSelected]]} 
            value={priceValue}
            defaultValue={_defaultValue}
            onChange={(val, extend) => {
              setPriceValue(val)
              // console.log('onChange', val, extend.items)
         }}/>
        )
      }
      else if(props.currentSelected === 'mode') { 
        return (
          <PickerView columns={[_filterData[_currentSelected]]} 
            value={modeValue}
            defaultValue={_defaultValue}
            onChange={(val, extend) => {
              setModeValue(val)
              console.log('onChange', val, extend.items)
         }}/>)
      }
      else if(props.currentSelected === 'area') { 
        return (
          <CascadePickerView options={ [ _filterData['area'], _filterData['subway'] ] } 
            value={areaValue}
            defaultValue={_defaultValue}
            onChange={(val, extend) => {
              setAreaValue(val)
              // console.log('onChange', val, extend.items)
          }} />
        )
      }
    }

    return (
      <>
        {/* 选择器组件： */}
        {getPickViewJSX()}

        {/* 底部按钮 */}
        <FilterFooter onCancel={props.onCancel} onOk={() => props.onOk({'price': priceValue, 'mode':modeValue, 'area':areaValue},  props.currentSelected)} />
      </>
    )
}

export default FilterPicker
