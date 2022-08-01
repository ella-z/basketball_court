import React, { Component } from 'react'
import Taro, { Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'
import PosterBar from "../../components/posterBar"

export default class Index extends Component {
  constructor(props) {
    super(props)
  }
  toPage(type: string) {
    switch (type) {
      case "ticket": {
        Taro.navigateTo({ url: '/pages/ticketPage/index' })
        break;
      }
      case "reserve":{
        Taro.navigateTo({ url: '/pages/reservePage/index' })
        break;
      }
      case "recharge":{
        Taro.navigateTo({ url: '/pages/rechargePage/index' })
        break;
      }
      default:
        break;
    }

  }
  render() {
    return (
      <View className="home-page">
        <PosterBar />
        <View className="box-wapper">
          <View className="box" onClick={this.toPage.bind(this, 'reserve')}>
            <Text>
              我要
           <Text className="highlight-text">
                包场
           </Text>
            </Text>
          </View>
          <View className="box" onClick={this.toPage.bind(this, 'ticket')}>
            <Text>
              我是
              <Text className="highlight-text">
                散客
              </Text>
            </Text>
          </View>
          <View className="box" onClick={this.toPage.bind(this, 'recharge')}> <Text>
            我想
           <Text className="highlight-text">
              充值
           </Text>
          </Text>
          </View>
        </View>
        <View className=""></View>
      </View>
    )
  }
}
