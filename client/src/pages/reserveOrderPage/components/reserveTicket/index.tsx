import React, { Component } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { AtButton } from "taro-ui";
import QRCode from "../../../../components/QRCode/index";
import { OrderState } from "../../../../type/index";
import "./index.scss"

interface ReserveTicketProps {
  info: OrderState,
  status: number
}
interface ReserveTicketState {
  iconImage: string
  QRCodeRef: any,
  codeText: string
}

export default class ReserveTicket extends Component<ReserveTicketProps, ReserveTicketState> {
  constructor(props) {
    super(props)
    this.state = {
      iconImage: require("../../../../assets/icons/ticket.png"),
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
    const { _id, type, phone, date, courtTime, courtNumber } = this.props.info;
    const data: any = {
      orderId: _id,
      type,
      phone,
      date,
      courtTime,
      courtNumber
    }
    this.setState({
      codeText: JSON.stringify(data)
    })

  }

  render() {
    const { info, status } = this.props
    const { iconImage, QRCodeRef, codeText } = this.state;
    return (
      <View>
        <View className="reserve-order">
          <View className="reserve-order-text">
            <View className="title">
              <Text className="title-text">{info.type === 'allCourt' ? "全场票" : "半场票"}</Text>
              <Image className="icon-image" src={iconImage}></Image>
            </View>
            <Text className="court-id">球场号： <Text className="highlight">{info.courtNumber.join("、")} 号</Text>
            </Text>
            <Text className="court-time">
              时间：<Text className="highlight">{info.date} {info.courtTime}</Text>
            </Text>
            <Text className="order-id">订单号：{info._id}</Text>
          </View>
          <View className="status-tips">
            {
              status === 0 ? <AtButton className="reserve-order-button " size="small" onClick={this.toUse.bind(this, QRCodeRef)}>使用</AtButton> : ''
            }
            {
              status === 1 ? <Text className="used-tip">
                已使用
            </Text> : ''
            }
            {
              status === 2 ? <Text className="overtime-tip">
                已过期
          </Text> : ''
            }
          </View>

        </View>
        <QRCode codeText={codeText} ref={QRCodeRef}></QRCode>
      </View>
    )
  }
}