import { Component } from "react"
import Taro, { Config } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { AtAvatar, AtButton } from "taro-ui";

import "./index.scss"

interface MyProps { }

interface MyState {
  avatarUrl: string
  icons: any
}

export default class User extends Component<MyProps, MyState> {
  constructor(props) {
    super(props)
    this.state = {
      avatarUrl: require("../../assets/a.png"),
      icons: {
        card: require("../../assets/icon/card.png"),
        rightArrow: require("../../assets/icon/rightArrow.png"),
        basketballClothes: require("../../assets/icon/basketballClothes.png"),
        order: require("../../assets/icon/order.png"),
      }
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

  render() {
    const { icons } = this.state
    return (
      <View className="user-page">
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
      </View>
    )
  }
}  