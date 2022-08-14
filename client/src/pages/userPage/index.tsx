import React, { Component } from "react"
import Taro, { Config } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { AtAvatar, AtButton, AtMessage } from "taro-ui";
import OrderModal from "./components/orderModal/index"
import { OrderInfoType } from "./type/index"

import "./index.scss"

interface MyProps { }

interface MyState {
  avatarUrl: string
  icons: any
  orderRef: any,
  currentOrder: OrderInfoType | null
}

export default class User extends Component<MyProps, MyState> {
  constructor(props) {
    super(props)
    this.state = {
      avatarUrl: require("../../assets/a.png"),
      icons: {
        card: "cloud://court-cloud-dev-4gqwp6nu564859aa.636f-court-cloud-dev-4gqwp6nu564859aa-1312772459/icon/card.png",
        rightArrow: "cloud://court-cloud-dev-4gqwp6nu564859aa.636f-court-cloud-dev-4gqwp6nu564859aa-1312772459/icon/right.png",
        basketballClothes: "cloud://court-cloud-dev-4gqwp6nu564859aa.636f-court-cloud-dev-4gqwp6nu564859aa-1312772459/icon/basketballClothes.png",
        order: "cloud://court-cloud-dev-4gqwp6nu564859aa.636f-court-cloud-dev-4gqwp6nu564859aa-1312772459/icon/order.png",
        scanning: "cloud://court-cloud-dev-4gqwp6nu564859aa.636f-court-cloud-dev-4gqwp6nu564859aa-1312772459/icon/scanning.png"
      },
      orderRef: React.createRef(),
      currentOrder: null
    }
  }

  toTicketOrder = () => {
    Taro.navigateTo({ url: '/pages/ticketOrderPage/index' })
  }

  toReservetOrder = () => {
    Taro.navigateTo({ url: '/pages/reserveOrderPage/index' })
  }

  getPhone = (e) => {
    console.log(1)
    wx.cloud.callFunction({
      name: 'phone',
      data: {
        code: e.detail.code
      },
      success: (res) => {
        console.log(res)
      }
    })
  }

  toScanning = () => {
    Taro.scanCode({
      success: (res) => {
        if (res.errMsg === "scanCode:ok") {
          const { orderRef } = this.state
          const order = JSON.parse(res.result);
          const { date, orderId, orderTime, phone, courtNumber, type } = order
          if (!orderId) return;
          this.setState({
            currentOrder: {
              orderId: order.orderId,
              orderTime: date + " " + orderTime,
              phone: phone,
              courtNumber: courtNumber,
              type: type
            }
          })
          if (!orderRef.current) return;
          orderRef.current.setState({
            isOpened: true
          })
        } else {
          Taro.atMessage({
            'message': '扫码失败!',
            'type': 'error',
          })
        }
      },
    })
  }

  render() {
    const { icons, orderRef, currentOrder } = this.state
    return (
      <View className="user-page">
        <AtMessage />
        <View className="user-info">
          <AtAvatar circle size="large" image={this.state.avatarUrl} />
          <View className="user-text">
            <Text className="user-name">用户姓名</Text>
            <Text className="user-tag">普通用户</Text>
          </View>
          <View className="sum">
            <View className="sum-title">
              <Image className="sum-icon" src={icons['card']}></Image>
              余额
            </View>
            <Text className="sum-value">￥<Text className="num">100000</Text>
            </Text>
          </View>
        </View>
        <View className="order-list-wapper">
          <View className="order-list" onClick={this.toScanning}>
            <Image className="order-icon" src={icons['scanning']}></Image>
            <Text className="order-title">扫码核销</Text>
            <Image className="list-icon" src={icons['rightArrow']}></Image>
          </View>
          <View className="order-list" onClick={this.toTicketOrder}>
            <Image className="order-icon" src={icons['basketballClothes']}></Image>
            <Text className="order-title">散场订单</Text>
            <Image className="list-icon" src={icons['rightArrow']}></Image>
          </View>
          <View className="order-list" onClick={this.toReservetOrder}>
            <Image className="order-icon" src={icons['order']}></Image>
            <Text className="order-title">包场订单</Text>
            <Image className="list-icon" src={icons['rightArrow']}></Image>
          </View>
        </View>
        <AtButton circle className="logout-button" openType="getPhoneNumber" onGetPhoneNumber={this.getPhone}>退出登录</AtButton>
        <OrderModal currentOrder={currentOrder} ref={orderRef} />
      </View>
    )
  }
}  