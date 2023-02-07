import {combineReducers} from 'redux'
import countReducer from './count/index.ts'
import {IInitCountState, IAction} from './count/type.ts'

export interface IRootReducer {
    countReducer: IInitCountState
}

export default combineReducers<IRootReducer>({
    countReducer
})