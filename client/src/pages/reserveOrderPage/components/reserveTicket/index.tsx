import React, { Component } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { AtButton } from "taro-ui";
import QRCode from "../../../../components/QRCode/index"

import "./index.scss"

interface ReserveTicketProps { }
interface ReserveTicketState {
  iconImage: string
  QRCodeRef: any,
}

export default class ReserveTicket extends Component<ReserveTicketProps, ReserveTicketState> {
  constructor(props) {
    super(props)
    this.state = {
      iconImage: require("../../../../assets/icons/ticket.png"),
      QRCodeRef: React.createRef(),
    }
  }

  toUse(ref: any) {
    if (!ref.current) return;
    ref.current.setState({
      isOpened: true
    })
  }

  render() {
    const { iconImage, QRCodeRef } = this.state;
    return (
      <View>
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
        <QRCode codeText='123' ref={QRCodeRef}></QRCode>
      </View>
    )
  }
}