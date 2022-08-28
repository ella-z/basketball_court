import { Component } from "react"
import Taro, { Config } from '@tarojs/taro'
import { AtButton, AtMessage, AtToast } from 'taro-ui'
import { View, Text } from '@tarojs/components'
import PosterBar from "../../components/posterBar"
import { request } from "../../utils/request"

import "./index.scss"

interface ticketState {
  loading: boolean,
  tipsOpened: boolean,
  tipsText: string
}

export default class TicketPage extends Component<any, ticketState> {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      tipsOpened: false,
      tipsText: ""
    }
  }

  async createOrder(data: any) {
    try {
      const { payType, orderNumber } = data
      if (payType === 'online' && !orderNumber) {
        this.setState({
          loading: false
        })
        Taro.atMessage(
          {
            'message': '生成订单失败，请联系客服',
            'type': 'error',
          }
        )
        return;
      }
      const orderResponse: any = await request('add_order', data);
      if (orderResponse.errMsg !== "cloud.callFunction:ok" || !orderResponse.result.success) {
        this.setState({
          loading: false
        })
        let errorMessage = `购票失败，${orderResponse.result.message}`;
        if (payType === 'online') {
          const refundResponse: any = await request('refund', {
            payNumber: orderNumber
          })
          if (refundResponse.errMsg !== "cloud.callFunction:ok" || refundResponse.result.resultCode === "FAIL") {
            Taro.atMessage({
              'message': "退款失败，请联系客服",
              'type': 'error'
            })
            this.setState({
              tipsText: '退款失败，请联系客服',
              tipsOpened: true
            })
            return;
          }
          errorMessage += "，购票金额将原路退回"
        }
        Taro.atMessage({
          'message': errorMessage,
          'type': 'error',
        })
        this.setState({
          tipsText: errorMessage,
          tipsOpened: true
        })
      } else {
        Taro.atMessage({
          'message': "购票成功！",
          'type': 'success',
        })
        this.setState({
          tipsText: '购票成功！',
          tipsOpened: true
        })
      }
      this.setState({
        loading: false
      })
    } catch (error) {
      console.error("购票失败：", error)
      this.setState({
        loading: false
      })
    }
  }

  async toPay(payType: string) {
    try {
      const phone = wx.getStorageSync('phone');
      const vipLevel = wx.getStorageSync('vipLevel')
      if (!phone) {
        Taro.atMessage({
          'message': '购票失败，请联系客服',
          'type': 'error',
        })
        this.setState({
          tipsText: '购票失败，请联系客服',
          tipsOpened: true
        })
        return;
      }
      this.setState({
        loading: true,
      })
      const data = {
        type: 'wildBall',
        payType,
        phone,
        vipLevel,
        createTime: new Date().getTime(),
        orderStatus: 0
      }
      if (payType === 'online') {
        const orderInfo = "散客订单"
        const payResponse: any = await request('pay', {
          type: "wildball",
          vipLevel,
          body: orderInfo
        })
        if (payResponse.result.resultCode === 'SUCCESS') {
          const _this = this;
          wx.requestPayment({
            ...payResponse.result.payment,
            success() {
              _this.createOrder({ ...data, orderNumber: payResponse.result.orderNumber })
            },
            fail() {
              _this.setState({
                loading: false
              })
            }
          })
        } else {
          Taro.atMessage({
            'message': '支付失败，请联系客服',
            'type': 'error',
          })
          this.setState({
            tipsText: '支付失败，请联系客服',
            tipsOpened: true
          })
        }
      } else {
        this.createOrder(data)
      }

    } catch (error) {
      console.error("购票报错：", error)
      this.setState({
        loading: false
      })
    }
  }

  render() {
    const { loading, tipsOpened, tipsText } = this.state
    return (
      <View className="ticket-page">
        <AtToast className="toast" isOpened={loading} status="loading" duration={0} hasMask={true}></AtToast>
        <AtMessage />
        <AtToast isOpened={tipsOpened} text={tipsText}></AtToast>
        <PosterBar />
        <View className="ticket-wapper">
          <Text className="ticket-title">
            散客购票
          </Text>
          <Text className="ticket-price">在线支付： <Text className="highlight">￥20</Text>/次</Text>
          <Text className="member-price">余额支付： <Text className="highlight">￥15</Text>/次</Text>
          <AtButton className="online-button" onClick={this.toPay.bind(this, 'online')}>在线支付</AtButton>
          <AtButton className="sum-button" onClick={this.toPay.bind(this, 'offline')}>余额支付</AtButton>
        </View>
      </View>
    )
  }
}