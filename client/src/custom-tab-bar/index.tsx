import React, { Component } from 'react'
import Taro, { Config } from '@tarojs/taro'
import { AtTabBar } from 'taro-ui'
import './index.scss'

type TabBarState = {
  current: number
}

export default class Index extends Component<any, TabBarState> {
  constructor(props) {
    super(props)
    this.state = {
      current: 0
    }
  }

  urlList = [
    'pages/homePage/index',
    'pages/userPage/index',
  ]

  handleClick(value) {
    if (value === 0) {
      Taro.switchTab({
        url: '/pages/homePage/index',
        complete: () => {
          this.setState({
            current: value
          })
        }
      })
    } else {
      Taro.switchTab({
        url: '/pages/userPage/index',
        complete: () => {
          this.setState({
            current: value
          })
        }
      })
    }
  }
  
  componentWillMount() {
    const currentPage = Taro.getCurrentPages()
    if (currentPage.length > 0) {
      this.setState({
        current: this.urlList.indexOf(currentPage[0].route)
      })
    }

  }

  render() {
    return (
      <AtTabBar
        backgroundColor="#18181a"
        color='#8a8a8d'
        selectedColor='#78DB64'
        fixed
        tabList={[
          { title: '主页', iconType: 'home' },
          { title: '我的', iconType: 'user' },
        ]}
        onClick={this.handleClick.bind(this)}
        current={this.state.current}
      />
    )
  }
}
