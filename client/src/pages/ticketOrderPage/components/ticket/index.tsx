import React, { Component } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { AtButton } from "taro-ui";
import QRCode from "../../../../components/QRCode/index"

import "./index.scss"

interface TicketProps { }
interface TicketState {
  iconImage: string
  QRCodeRef: any,
}

export default class TicketOrder extends Component<TicketProps, TicketState> {
  constructor(props) {
    super(props)
    this.state = {
      iconImage: require("../../../../assets/icons/ticketOne.png"),
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
        <View className="ticket-order">
          <View className="ticket-order-text">
            <View className="title">
              <Text className="title-text">散客票</Text>
              <Image className="icon-image" src={iconImage}></Image>
            </View>
            <Text className="order-id">订单号：xxxxx123_daw</Text>
          </View>
          <AtButton className="ticket-order-button" size="small" onClick={this.toUse.bind(this, QRCodeRef)}>使用</AtButton>
        </View>
        <QRCode codeText='123' ref={QRCodeRef}></QRCode>
      </View>


    )
  }
}