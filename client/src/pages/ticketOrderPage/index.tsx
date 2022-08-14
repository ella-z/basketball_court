import React, { Component } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { AtButton } from "taro-ui";

import "./index.scss"

interface TicketOrderProps { }
interface TicketOrderState {
  iconImage: string
}

export default class TicketOrder extends Component<TicketOrderProps, TicketOrderState> {
  constructor(props) {
    super(props)
    this.state = {
      iconImage: "cloud://court-cloud-dev-4gqwp6nu564859aa.636f-court-cloud-dev-4gqwp6nu564859aa-1312772459/icon/ticketOne.png"
    }
  }
  render() {
    const { iconImage } = this.state;
    return (
      <View className="ticket-order-list">
        <View className="ticket-order">
          <View className="ticket-order-text">
            <View className="title">
              <Text className="title-text">散客票</Text>
              <Image className="icon-image" src={iconImage}></Image>
            </View>
            <Text className="order-id">订单号：xxxxx123_daw</Text>
          </View>
          <AtButton className="ticket-order-button" size="small">使用</AtButton>
        </View>
      </View>
    )
  }
}