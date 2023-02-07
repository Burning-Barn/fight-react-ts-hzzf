import React, { Component, FC, ReactNode, useState, useEffect } from 'react'

import {
  Button,
  Toast,
  List,
  Input,
  Picker,
  TextArea ,
  Modal,
  Form,
  ImageUploader
} from 'antd-mobile'
import { ImageUploadItem } from 'antd-mobile/es/components/image-uploader'

import NavHeader from '../../../components/NavHeader/index.tsx'
import HousePackge from '../../../components/HousePackage'

import styles from './index.module.css'
import { useNavigate, useLocation,  } from 'react-router-dom'
import {API  } from '../../../utils/api'

const alert = Modal.alert

// 房屋类型
const roomTypeData = [
  [{ label: '一室', value: 'ROOM|d4a692e4-a177-37fd' },
  { label: '二室', value: 'ROOM|d1a00384-5801-d5cd' },
  { label: '三室', value: 'ROOM|20903ae0-c7bc-f2e2' },
  { label: '四室', value: 'ROOM|ce2a5daa-811d-2f49' },
  { label: '四室+', value: 'ROOM|2731c38c-5b19-ff7f' }]
]

// 朝向：
const orientedData = [
  { label: '东', value: 'ORIEN|141b98bf-1ad0-11e3' },
  { label: '西', value: 'ORIEN|103fb3aa-e8b4-de0e' },
  { label: '南', value: 'ORIEN|61e99445-e95e-7f37' },
  { label: '北', value: 'ORIEN|caa6f80b-b764-c2df' },
  { label: '东南', value: 'ORIEN|dfb1b36b-e0d1-0977' },
  { label: '东北', value: 'ORIEN|67ac2205-7e0f-c057' },
  { label: '西南', value: 'ORIEN|2354e89e-3918-9cef' },
  { label: '西北', value: 'ORIEN|80795f1a-e32f-feb9' }
]

// 楼层
const floorData = [
  { label: '高楼层', value: 'FLOOR|1' },
  { label: '中楼层', value: 'FLOOR|2' },
  { label: '低楼层', value: 'FLOOR|3' }
]

type IProps = {
  navigate: any
}

const RentAdd = () => {
  const initialState = {
      // 临时图片地址
      tempSlides: [],

      // 小区的名称和id
      community: {
        name: '',
        id: ''
      },
      // 价格
      price: '',
      // 面积
      size: 0,
      // 房屋类型
      roomType: '',
      // 楼层
      floor: '',
      // 朝向：
      oriented: '',
      // 房屋标题
      title: '',
      // 房屋图片
      houseImg: '',
      // 房屋配套：
      supporting: '',
      // 房屋描述
      description: ''
    }

    
  const [state, setstate] = useState(initialState)
  const [supporting, setSupporting] = useState('')
  const [fileList, setFileList] = useState<ImageUploadItem[]>()
  const [fileListUpload, setFileListUpload] = useState([])

  const [visible, setVisible] = useState(false)
  const [visibleFloorData, setVisibleFloorData] = useState(false)
  const [visibleOrientedData, setVisibleOrientedData] = useState(false)

  const [roomTypeDataValue, setRoomTypeDataValue] = useState('')
  const [floorDataValue, setFloorDataValue] = useState('')
  const [orientedDataValue, setOrientedDataValue] = useState('')

  const navigate = useNavigate()
  const location = useLocation()
  

  // 取消编辑，返回上一页
  const onCancel = async () => {
    
    const result = await Modal.confirm({
      content: '放弃发布房源',
    })
    if (result) {
      Toast.show({ content: '点击了确认', position: 'bottom' })
    } else {
      Toast.show({ content: '点击了取消', position: 'bottom' })
    }

    // alert('提示', '?', [
    //   {
    //     text: '放弃',
    //     onPress: async () => this.props.navigate(-1)
    //   },
    //   {
    //     text: '继续编辑'
    //   }
    // ])
  }

  const addHouse = async () => {
    const _hasFile = fileListUpload.length 
    const {
      title,
      description,
      price,
      size,
      floor,
      community
    } = state
    let _houseImg
    // supporting 
  // const [roomTypeDataValue, setRoomTypeDataValue] = useState('')
  // const [floorDataValue, setFloorDataValue] = useState('')
  // const [orientedDataValue, setOrientedDataValue] = useState('')

    if(_hasFile > 1) {
      // 已经有上传的图片了
      const form = new FormData()
      fileListUpload.forEach(item => form.append('file', item))

      const res = await API.post('/houses/image', form, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      // console.log(res)
      _houseImg = res.data.body.join('|')
      console.log('houseImg', _houseImg)

    }

    
    // 发布房源
    const res = await API.post('/user/houses', {
      title,
      description,
      oriented: orientedDataValue,
      supporting: supporting,
      price,
      roomType: roomTypeDataValue,
      size,
      floor:floorDataValue,
      community: community.id,
      houseImg: _houseImg
    })

    if (res.data.status === 200) {
      // 发布成功
      Toast.show({content: '发布成功'})
      navigate('/rent')
    } else {
      Toast.show({content: '发布失败'})
    }
  }

  // const setFileList = (items: ImageUploadItem[]):void => {

  // }
  
  async function mockUpload(file: File) {
    // setFileList()
    // await sleep(3000)
    setFileListUpload((pre) => ([
      ...pre,
      file
    ]))
    debugger
    return {
      url: URL.createObjectURL(file),
    }
  }

  const getHouseSupporting = (data) => {
    setSupporting(data.join(','))
  }

  const afterChange = (items: ImageUploadItem[]): void => {
    console.log('items', items)
    // setFileList('')
  }

  useEffect(() => {
    console.log('state======', state)
    console.log('roomTypeDataValue======', roomTypeDataValue)
    console.log('floorDataValue======', floorDataValue)
    console.log('orientedDataValue======', orientedDataValue)
    console.log('supporting======', supporting)
    console.log('fileListUpload======', fileListUpload)
  })

  const getValue = (name, value) => {
    console.log('name', name)
    console.log('value', value)
    setstate((pre) => {
      return {
        ...pre,
        [name]: value
      }
    })
  }

  useEffect(() => {
    console.log('location', location)
    console.log('location', (location as any)?.state?.cityName?.community)
    console.log('location', (location as any)?.state?.cityName?.communityName)
    const _id = (location as any)?.state?.cityName?.community
    const _name = (location as any)?.state?.cityName?.communityName
    if(_id) {
      setstate((pre) => ({
        ...pre,
        community: {
          name: _name,
          id: _id
        }
      }))

    }
  }, [])

    const Item = List.Item
    const {
      community,
      price,
      roomType,
      floor,
      oriented,
      description,
      tempSlides,
      title,
      size
    } = state

    return (
      <div className={styles.root} style={{
        overflow: 'auto',
        height: '100%'}}>
        <Form
        layout='horizontal'>
        <NavHeader onLeftClick={onCancel}>发布房源</NavHeader>

        <List
          className={styles.header}
          header='房源信息'
        >
          {/* 选择所在小区 */}
          <Item
            extra={community.name || '请输入小区名称'}
            onClick={() => navigate('/rent/search', {replace: true})}
          >
            小区名称
          </Item>
          {/* <Item> */}
            <Form.Item label='租金' >
              <Input placeholder="请输入租金/月" onChange={(e) => getValue('price', e)} />
              {/* <Input placeholder="请输入租金/月"  value={price}  /> */}
            </Form.Item>
          {/* </Item>
          <Item> */}
            <Form.Item label='建筑面积' >
              <Input placeholder="请输入建筑面积" onChange={(e) => getValue('size', e)} />
            </Form.Item>

          {/* </Item> */}
          <Form.Item label='户型' 
            extra={            
              <Button
                size='small'
                onClick={() => {
                  setVisible(true)
                }}
              >
                选择
              </Button>
            } >
            <Input
              placeholder='请输入内容'
              value={roomTypeDataValue}
            />
            <Picker
              columns={roomTypeData}
              visible={visible}
              onClose={() => {
                setVisible(false)
              }}
              value={[roomTypeDataValue]}
              onConfirm={v => {
                debugger
                setRoomTypeDataValue(v[0])
              }}
            />
          </Form.Item>

          
          <Form.Item label='楼层'
            extra={
              <Button
                size='mini'
                onClick={() => {
                  setVisibleFloorData(true)
                }}
              >
                选择
              </Button>
            }>
            <Input
              placeholder='请输入内容'
              value={floorDataValue}
            />
              <Picker
                columns={[floorData]}
                visible={visibleFloorData}
                onClose={() => {
                  setVisibleFloorData(false)
                }}
                value={[floorDataValue]}
                onConfirm={v => {
                  setFloorDataValue(v[0])
                }}
              />
          </Form.Item >

          {/* const [visible, setVisible] = useState(false)
  const [visibleFloorData, setVisibleFloorData] = useState(false)
  const [visibleOrientedData, setVisibleOrientedData] = useState(false)
  const [roomTypeDataValue, setRoomTypeDataValue] = useState()
  const [floorDataValue, setFloorDataValue] = useState()
  const [orientedDataValue, setOrientedDataValue] = useState() */}
          
          <Form.Item label='朝向'
            extra={
              <Button
                onClick={() => {
                  setVisibleOrientedData(true)
                }}
              >
                选择
              </Button>
            }>
            <Input
              placeholder='请输入内容'
              value={orientedDataValue}
            />
              <Picker
                columns={[orientedData]}
                visible={visibleOrientedData}
                onClose={() => {
                  setVisibleOrientedData(false)
                }}
                value={[orientedDataValue]}
                onConfirm={v => {
                  setOrientedDataValue(v[0])
                }}
              />
          </Form.Item>

          {/* <Picker columns={roomTypeData} value={[roomType]}>
          </Picker>

          <Picker columns={floorData} value={[floor]} >
          </Picker>
          <Picker columns={orientedData} value={[oriented]} >
          </Picker> */}
        </List>

        <List
          className={styles.title}
          header='房屋标题'
          data-role="rent-list"
        >
          
          <Form.Item >
            <Input
              onChange={(e) => getValue('title', e)}
              placeholder="请输入标题（例如：整租 小区名 2室 5000元）"
            />
          </Form.Item>
        </List>

        <List
          className={styles.pics}
          header='房屋图像'
          data-role="rent-list"
        >
          {/* <ImagePicker
            files={tempSlides}
            multiple={true}
            className={styles.imgpicker}
          /> */}
          <ImageUploader
            value={fileList}
            onChange={afterChange}
            upload={mockUpload}
          />
        </List>

        <List
          header='房屋配置'
          className={styles.supporting}
          data-role="rent-list"
        >
          <HousePackge select onSelect={getHouseSupporting}/>
        </List>

        <List
          header='房屋描述'
          className={styles.desc}
          data-role="rent-list"
        >
          <Item>
            <TextArea 
              placeholder="请输入房屋描述信息"
              value={description}
              onChange={(e) => getValue('description', e)}
            /></Item>
        </List>

        <div className={styles.bottom}>
          <div className={styles.cancel} onClick={onCancel}>
            取消
          </div>
          <div className={styles.confirm} onClick={addHouse}>
            提交
          </div>
        </div>
      
        </Form>
        </div>
    )
  
}


export default RentAdd
