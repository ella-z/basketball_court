import React, { Component } from "react"
import Taro, { Config } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { AtButton, AtMessage, AtToast } from "taro-ui";
import OrderModal from "./components/orderModal/index"
import { OrderInfoType } from "./type/index"
import { change } from "../../store/actions/tabBar"
import { connect } from 'react-redux'
import { request } from "../../utils/request"


import "./index.scss"

interface MyProps {
  change: Function
}

interface MyState {
  avatarUrl: string
  icons: any
  orderRef: any,
  currentOrder: OrderInfoType | null,
  userName: string,
  isLogin: boolean,
  pageLoading: boolean,
  balance: number,
  vipLevel: number,
  vipList: any[],
  tipsOpened: boolean,
  tipsText: string
}

class User extends Component<MyProps, MyState> {
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
      isLogin: false,
      pageLoading: false,
      balance: 0,
      vipLevel: 0,
      vipList: [
        {
          level: 0,
          text: '普通用户',
          color: "#999"
        },
        {
          level: 1,
          text: '新秀',
          color: '#0C840A'
        },
        {
          level: 2,
          text: '全明星',
          color: '#78DB64'
        },
        {
          level: 3,
          text: '超级明星',
          color: '#68EDCB'
        },
        {
          level: 8,
          text: '管理员',
          color: '#fff'
        }
      ],
      tipsOpened: false,
      tipsText: ""
    }
  }

  toTicketOrder = () => {
    const phone = wx.getStorageSync('phone')
    if (!phone) {
      this.toLogin()
      return;
    }
    Taro.navigateTo({ url: '/pages/ticketOrderPage/index' })
  }

  toReservetOrder = () => {
    const phone = wx.getStorageSync('phone')
    if (!phone) {
      this.toLogin()
      return;
    }
    Taro.navigateTo({ url: '/pages/reserveOrderPage/index' })
  }

  logout() {
    this.setState({
      pageLoading: true
    })
    wx.removeStorageSync('phone')
    this.setUserInfo()
    this.setState({
      pageLoading: false
    })
  }

  toLogin() {
    Taro.navigateTo({ url: '/pages/loginPage/index' })
  }

  toScanning = () => {
    Taro.scanCode({
      success: (res) => {
        if (res.errMsg === "scanCode:ok") {
          const { orderRef } = this.state
          const order = JSON.parse(res.result);
          const { date, orderId, courtTime, phone, courtNumber, type } = order
          if (!orderId) return;
          let data: OrderInfoType = {
            orderId: order.orderId,
            phone: phone,
            type: type,
          }
          if (type !== "wildBall") {
            data = {
              orderId: order.orderId,
              orderTime: date + " " + courtTime,
              phone: phone,
              courtNumber: courtNumber,
              type: type
            }
          }
          this.setState({ currentOrder: data })
          if (!orderRef.current) return;
          orderRef.current.setState({
            isOpened: true
          })
        } else {
          Taro.atMessage({
            'message': '扫码失败!',
            'type': 'error',
          })
          this.setState({
            tipsText: '扫码失败',
            tipsOpened: true
          })
        }
      },
    })
  }

  async getUserInfo() {
    try {
      this.setState({
        pageLoading: true
      })
      const phone = wx.getStorageSync('phone');
      if (!phone) {
        Taro.navigateTo({ url: "pages/loginPage/index" })
      }
      const response: any = await request("login", {
        phone
      })
      const { errMsg } = response
      if (errMsg !== "cloud.callFunction:ok") {
        Taro.atMessage({
          'message': '获取个人信息错误，请联系客服',
          'type': "error",
        })
        this.setState({
          tipsText: '获取个人信息错误，请联系客服',
          tipsOpened: true
        })
        return;
      }
      const { user } = response.result;
      this.setState({
        pageLoading: false,
        balance: user.balance,
        vipLevel: user.vipLevel
      })
    } catch (error) {
      console.error("获取余额失败：" + error)
    }
  }

  setUserInfo() {
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

  componentDidShow() {
    this.props.change(1)
    let phone = wx.getStorageSync("phone")
    if (!!phone) {
      this.setUserInfo()
      this.getUserInfo()
    }
  }

  render() {
    const { icons, orderRef, currentOrder, userName, isLogin, pageLoading, balance, vipLevel, vipList, tipsOpened, tipsText } = this.state
    const targetVip = vipList.find(item => item.level === vipLevel)
    return (
      <View className="user-page">
        <AtMessage />
        <AtToast isOpened={tipsOpened} text={tipsText}></AtToast>
        <AtToast className="toast" isOpened={pageLoading} status="loading" duration={0} hasMask={true}></AtToast>
        <View className="user-info">
          <View className="avatar">
            <Image className="avatar-img" src={this.state.avatarUrl}></Image>
          </View>
          {
            isLogin ?
              <View className="user-text">
                <Text className="user-name">{userName}</Text>
                <Text className="user-tag" style={`border-color:${targetVip.color};color:${targetVip.color}`}>{targetVip.text}</Text>
              </View> :
              <View className="login-tips">
                请登录
              </View>
          }
          {
            (isLogin) ?
              vipLevel !== 8 ? <View className="sum">
                <View className="sum-title">
                  <Image className="sum-icon" src={icons['card']}></Image>
                    余额
                  </View>
                <Text className="sum-value">￥<Text className="num">{balance}</Text>
                </Text>
              </View> : ''
              :
              <AtButton circle className="login-button" size="small" onClick={this.toLogin.bind(this)}>
                <Text className="login-text">登录</Text>
              </AtButton>
          }
        </View>
        <View className="order-list-wapper">
          {(isLogin && vipLevel === 8) ? <View className="order-list" onClick={this.toScanning}>
            <Image className="order-icon" src={icons['scanning']}></Image>
            <Text className="order-title">扫码核销</Text>
            <Image className="list-icon" src={icons['rightArrow']}></Image>
          </View> : ''}
          {
            vipLevel !== 8 ? <View>
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
            </View> : ''
          }

        </View>
        {
          isLogin ? <AtButton circle className="logout-button" onClick={this.logout.bind(this)}>退出登录</AtButton> : ''
        }
        <OrderModal currentOrder={currentOrder} ref={orderRef} />
      </View>
    )
  }
}

const mapStateToProps = () => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {
    change: (selected: Number) => dispatch(change(selected))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(User);