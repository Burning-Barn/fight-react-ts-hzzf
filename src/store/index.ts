import { createStore, applyMiddleware } from 'redux'
// import  from 'redux-thunk'

import reducers from './reducers.ts'
import { IRootReducer } from './reducers'

const store = createStore(reducers, applyMiddleware())

export default store
export type { IRootReducer }


export type RootState = ReturnType<typeof store.getState>

export type RootDispatch = typeof store.dispatch