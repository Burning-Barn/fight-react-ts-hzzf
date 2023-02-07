import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Link, BrowserRouter, useRoutes} from 'react-router-dom'
import { Provider} from 'react-redux'
// 导入字体图标库的样式文件
import './assets/fonts/iconfont.css'
// 导入 react-virtualized 组件的样式
import 'react-virtualized/styles.css'

// 注意：应该将 组件 的导入放在样式导入后面，从而避免样式覆盖的问题
import App from './App.tsx';
import store from './store/index.ts'

ReactDOM.render(
  // bug1 !!!!!!!  BrowserRouter在这里包裹app,  一开始我在app.tsx里包裹，结果一直报错
  // Uncaught Error: useRoutes() may be used only in the context of a <Router> component.
  <BrowserRouter>
    <Provider store={store}>
    < App />
    </Provider>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
