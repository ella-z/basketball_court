import React, { Component } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { AtButton } from "taro-ui";

import "./index.scss"

interface ReserveOrderProps { }
interface ReserveOrderState {
  iconImage: string
}

export default class ReserveOrder extends Component<ReserveOrderProps, ReserveOrderState> {
  constructor(props) {
    super(props)
    this.state = {
      iconImage: require('../../assets/icon/ticket.png')
    }
  }
  render() {
    const { iconImage } = this.state;
    return (
      <View className="reserve-order-list">
        <View className="reserve-order">
          <View className="reserve-order-text">
            <View className="title">
              <Text className="title-text">全场票</Text>
              <Image className="icon-image" src={iconImage}></Image>
            </View>
            <Text className="court-id">球场号：<Text className="highlight">3号</Text> 、<Text className="highlight">4号</Text></Text>
            <Text className="order-id">订单号：xxxxx123_daw</Text>
          </View>
          <AtButton className="reserve-order-button" size="small">使用</AtButton>
        </View>
        <View className="reserve-order">
          <View className="reserve-order-text">
            <View className="title">
              <Text className="title-text">半场票</Text>
              <Image className="icon-image" src={iconImage}></Image>
            </View>
            <Text className="court-id">球场号：<Text className="highlight">1号</Text> </Text>
            <Text className="order-id">订单号：xxxxx123_daw</Text>
          </View>
          <AtButton className="reserve-order-button" size="small">使用</AtButton>
        </View>
      </View>
    )
  }
}