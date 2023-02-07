import {INCREMENT, DECREMENT} from './const.ts'
import { IInitCountState, IAction } from './type.ts'

const initCount: IInitCountState = {
    count: 0
}
const countReducer = (preState=initCount, actions: IAction): IInitCountState => {
    const { type, data } = actions
    switch(type) {
        case INCREMENT: 
            return  { ...preState, count: preState.count + data}
        case DECREMENT: 
            return { ...preState, count: preState.count - data}
        default:
            return {...preState}
    }
}

export { countReducer }