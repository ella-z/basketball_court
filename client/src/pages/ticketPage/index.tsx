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
          <Text className="ticket-price">在线支付： <Text className="highlight">￥20</Text>/次</Text>
          <Text className="member-price">余额支付： <Text className="highlight">￥15</Text>/次</Text>
          <AtButton className="online-button">在线支付</AtButton>
          <AtButton className="sum-button">余额支付</AtButton>
        </View>
      </View>
    )
  }
}