import { connect } from 'react-redux'
import {FC, useState} from 'react'
import {increment, decrement} from '../../store/count/actions.ts'
import { Button, Input  } from 'antd-mobile'
import { RootState, RootDispatch } from '../../store/index.ts'

type IProps = {

}

const Count:FC<IProps> = (props) => {
    const [value, setValue] = useState('')

    const hIncrement = () => {
        props.increment(+value)
    }

    const hdecrement = () => {
        props.decrement(+value)

    }

    return (
        <div>
            <div>
                count: {props.countReducer.count}
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
            count.....
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        countReducer: state.countReducer
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        increment: (data) => dispatch(increment(data)),
        decrement: (data) => dispatch(decrement(data)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Count)