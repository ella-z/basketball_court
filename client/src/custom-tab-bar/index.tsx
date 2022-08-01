import React, { Component } from 'react'
import Taro, { Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
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
  handleClick(value) {
    this.setState({
      current: value
    })
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
