import { Component } from 'react'
import Taro from '@tarojs/taro'
import { Provider } from 'react-redux'
import configStore from './store'

const store = configStore()


import './app.scss'

class App extends Component {

  componentDidMount() {
    if (process.env.TARO_ENV === 'weapp') {
      Taro.cloud.init()
    }
  }

  componentDidShow() { }

  componentDidHide() { }

  componentDidCatchError() { }

  // this.props.children 是将要会渲染的页面
  render() {
    return (
      <Provider store={store}>
        {this.props.children}
      </Provider>
    )
  }
}

export default App
