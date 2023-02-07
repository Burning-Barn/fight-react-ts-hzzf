import { connect } from 'react-redux'
import {FC, useState} from 'react'
import { Button, Input  } from 'antd-mobile'
import { useDispatch, useSelector } from 'react-redux'
import {increment, decrement} from '../../store/count/actions.ts'
import { IRootReducer } from '../../store/index.ts'
import { RootState, RootDispatch } from '../../store/index.ts'

type IProps = {

}

const Count:FC<IProps> = (props) => {
    const [value, setValue] = useState('')
    const dispatch = useDispatch<RootDispatch>()
    // const count = useSelector((state: IRootReducer) => {
    //     return state.countReducer.count
    // })


    
    const count = useSelector((state: RootState) => {
        return state.countReducer.count
    })


    const hIncrement = () => {
        dispatch(increment(value))
    }

    const hdecrement = () => {
        dispatch(decrement(+value))

    }

    return (
        <div>
            <div>
                count--hook: {count}
            </div>
            <Input
                placeholder='请输入内容'
                value={value}
                onChange={val => {
                    setValue(val)
                }}
            />
            <Button onClick={hIncrement}>hIncrement</Button>
            <Button onClick={hdecrement}>hdecrement</Button>
            counthook.....
        </div>
    )
}


export default Count