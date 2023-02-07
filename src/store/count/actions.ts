import {INCREMENT, DECREMENT} from './const.ts'
import { IInitCountState, IAction } from './type.ts'

const increment = (data: number): IAction => ({type: INCREMENT, data})

const decrement = (data: number): IAction => ({type: DECREMENT, data})

export {increment, decrement}