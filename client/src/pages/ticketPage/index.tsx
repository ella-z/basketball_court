import { Component } from "react"
import Taro, { Config } from '@tarojs/taro'
import { AtButton } from 'taro-ui'
import { View, Text } from '@tarojs/components'
import PosterBar from "../../components/posterBar"

import "./index.scss"

export default class TicketPage extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <View className="ticket-page">
        <PosterBar />
        <View className="ticket-wapper">
          <Text className="ticket-title">
            散客购票
          </Text>
          <Text className='ticket-price'>
            <Text className="ticket-price-highlight">￥20</Text>
          /次</Text>
          <AtButton>在线支付</AtButton>
        </View>
      </View>
    )
  }
}