import React, { Component } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { AtButton } from "taro-ui";
import QRCode from "../../components/QRCode/index"

import "./index.scss"

interface ReserveOrderProps { }
interface ReserveOrderState {
  iconImage: string,
  QRCodeRef: any,
  currentCodeText: string
}

export default class ReserveOrder extends Component<ReserveOrderProps, ReserveOrderState> {
  constructor(props) {
    super(props)
    this.state = {
      iconImage: "cloud://court-cloud-dev-4gqwp6nu564859aa.636f-court-cloud-dev-4gqwp6nu564859aa-1312772459/icon/ticket.png",
      QRCodeRef: React.createRef(),
      currentCodeText: JSON.stringify({
        id: '123',
        date: "2022-08-03",
        openid: 'xxx',
        orderId: '111',
        orderStatus: "0",
        phone: '13543009092',
        courtNumber: [1],
        orderTime: '10:00~12:00',
        type: 'halfCourt'
      })
    }
  }

  toUse(ref: any) {
    const { currentCodeText } = this.state
    if (!ref.current || !currentCodeText) return;
    ref.current.setState({
      isOpened: true
    })
  }

  render() {
    const { iconImage, QRCodeRef, currentCodeText } = this.state;
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
          <AtButton className="reserve-order-button" size="small" onClick={this.toUse.bind(this, QRCodeRef)}>使用</AtButton>
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
        <QRCode codeText={currentCodeText} ref={QRCodeRef}></QRCode>
      </View>
    )
  }
}