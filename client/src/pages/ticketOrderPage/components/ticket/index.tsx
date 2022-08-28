import React, { Component } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { AtButton } from "taro-ui";
import QRCode from "../../../../components/QRCode/index"
import { OrderState } from "../../../../type/index"

import "./index.scss"

interface TicketProps {
  info: OrderState,
  status: number,
  onCloseCode: any
}
interface TicketState {
  iconImage: string
  QRCodeRef: any,
  codeText: string
}

export default class TicketOrder extends Component<TicketProps, TicketState> {
  constructor(props) {
    super(props)
    this.state = {
      iconImage: require("../../../../assets/icons/ticketOne.png"),
      QRCodeRef: React.createRef(),
      codeText: ''
    }
  }

  toUse(ref: any) {
    this.setState({
      codeText: ''
    })
    if (!ref.current) return;
    ref.current.setState({
      isOpened: true
    })
    const { _id, type, phone } = this.props.info
    const data = {
      orderId: _id,
      type,
      phone
    }
    this.setState({
      codeText: JSON.stringify(data)
    })
  }

  render() {
    const { info, status } = this.props
    const { iconImage, codeText, QRCodeRef } = this.state;
    return (
      <View>
        <View className="ticket-order">
          <View className="ticket-order-text">
            <View className="title">
              <Text className="title-text">散客票</Text>
              <Image className="icon-image" src={iconImage}></Image>
            </View>
            <Text className="order-id">订单号：{info._id}</Text>
          </View>
          <View className="status-tips">
            {
              status === 0 ?
                <AtButton className="ticket-order-button" size="small" onClick={this.toUse.bind(this, QRCodeRef)}>使用</AtButton> : <Text className="usedTips">已使用</Text>
            }
          </View>
        </View>
        <QRCode codeText={codeText} ref={QRCodeRef} onCloseCode={this.props.onCloseCode}></QRCode>
      </View>

    )
  }
}