import React, { Component } from "react"
import Taro, { Config } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { AtButton, AtMessage } from "taro-ui";
import OrderModal from "./components/orderModal/index"
import { OrderInfoType } from "./type/index"

import "./index.scss"

interface MyProps { }

interface MyState {
  avatarUrl: string
  icons: any
  orderRef: any,
  currentOrder: OrderInfoType | null,
  userName: string,
  isLogin: boolean
}

export default class User extends Component<MyProps, MyState> {
  constructor(props) {
    super(props)
    this.state = {
      avatarUrl: require("../../assets/default_avatar.png"),
      icons: {
        card: require("../../assets/icons/card.png"),
        rightArrow: require("../../assets/icons/rightArrow.png"),
        basketballClothes: require("../../assets/icons/basketballClothes.png"),
        order: require("../../assets/icons/order.png"),
        scanning: require("../../assets/icons/scanning.png")
      },
      orderRef: React.createRef(),
      currentOrder: null,
      userName: '用户姓名',
      isLogin: false
    }
  }

  toTicketOrder = () => {
    Taro.navigateTo({ url: '/pages/ticketOrderPage/index' })
  }

  toReservetOrder = () => {
    Taro.navigateTo({ url: '/pages/reserveOrderPage/index' })
  }

  logout() {

  }

  toLogin(){
    Taro.navigateTo({ url: '/pages/loginPage/index' })
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

  componentDidMount() {
    let phone = wx.getStorageSync("phone")
    if (!phone) {
      this.setState({
        isLogin: false,
      })
      return;
    }
    phone = phone.split("")
    phone.splice(3, 4, "****")
    this.setState({
      isLogin: true,
      userName: phone.join("")
    })
  }

  render() {
    const { icons, orderRef, currentOrder, userName, isLogin } = this.state
    return (
      <View className="user-page">
        <AtMessage />
        <View className="user-info">
          <View className="avatar">
            <Image className="avatar-img" src={this.state.avatarUrl}></Image>
          </View>
          {
            isLogin ?
              <View className="user-text">
                <Text className="user-name">{userName}</Text>
                <Text className="user-tag">普通用户</Text>
              </View> :
              <View className="login-tips">
                请登录
              </View>
          }
          {
            isLogin ?
              <View className="sum">
                <View className="sum-title">
                  <Image className="sum-icon" src={icons['card']}></Image>
                    余额
                  </View>
                <Text className="sum-value">￥<Text className="num">100000</Text>
                </Text>
              </View>
              :
              <AtButton circle className="login-button" size="small" onClick={this.toLogin.bind(this)}>
                <Text className="login-text">登录</Text>
              </AtButton>


          }
        </View>
        <View className="order-list-wapper">
          {isLogin ? <View className="order-list" onClick={this.toScanning}>
            <Image className="order-icon" src={icons['scanning']}></Image>
            <Text className="order-title">扫码核销</Text>
            <Image className="list-icon" src={icons['rightArrow']}></Image>
          </View> : ''}
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
        {
          isLogin ? <AtButton circle className="logout-button" >退出登录</AtButton> : ''
        }
        <OrderModal currentOrder={currentOrder} ref={orderRef} />
      </View>
    )
  }
}  