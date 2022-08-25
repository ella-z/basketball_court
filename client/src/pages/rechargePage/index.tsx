import { Component } from "react"
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtInput, AtButton, AtMessage, AtActivityIndicator, AtToast } from "taro-ui"
import { request } from "../../utils/request"

import "./index.scss"

type RechargeProps = {
}

type RechargeState = {
  rechargePrice: string,
  balance: number,
  pageLoading: boolean,
  chargeLoading: boolean,
  orderNumber: number | null
}

export default class RechargePage extends Component<RechargeProps, RechargeState> {
  constructor(props) {
    super(props)
    this.state = {
      rechargePrice: '',
      balance: 0,
      pageLoading: true,
      chargeLoading: false,
      orderNumber: null
    }
  }

  handleChange(val: string) {
    this.setState({
      rechargePrice: val
    })
  }

  async createOrder(data: any) {
    try {
      const { orderNumber } = data
      if (!orderNumber) {
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
          chargeLoading: false
        })
        let errorMessage = `充值失败，${orderResponse.result.message}`;
        const refundResponse: any = await request('refund', {
          payNumber: orderNumber
        })
        if (refundResponse.errMsg !== "cloud.callFunction:ok" || refundResponse.result.resultCode === "FAIL") {
          Taro.atMessage({
            'message': "退款失败，请联系客服",
            'type': 'error'
          })
          return;
        }
        errorMessage += "，订场金额将原路退回"
        Taro.atMessage({
          'message': errorMessage,
          'type': 'error',
        })
      } else {
        Taro.atMessage({
          'message': "充值成功！",
          'type': 'success',
        })
        this.getBalance()
      }
      this.setState({
        chargeLoading: false,
        rechargePrice: ""
      }
      )
    } catch (error) {
      console.error('创建订单失败：' + error)
    }
  }

  async chargePrice() {
    this.setState({
      chargeLoading: true
    })
    const phone = wx.getStorageSync('phone');
    if (!phone) {
      Taro.navigateTo({ url: '/pages/loginPage/index' })
      return;
    }

    const orderInfo = "态度篮球公园充值订单";
    const payResponse: any = await request('pay', {
      type: "pay",
      price: this.state.rechargePrice,
      body: orderInfo
    })
    if (payResponse.result.resultCode === 'SUCCESS') {
      const _this = this;
      wx.requestPayment({
        ...payResponse.result.payment,
        async success() {
          _this.createOrder({
            type: 'pay',
            price: Number(_this.state.rechargePrice),
            phone,
            createDate: new Date().getTime(),
            orderNumber: payResponse.result.orderNumber
          })
        },
        fail() {
          _this.setState({
            chargeLoading: false
          })
        }
      })
    } else {
      this.setState({
        chargeLoading: false
      })
      Taro.atMessage({
        'message': '支付失败，请联系客服',
        'type': 'error',
      })
    }
  }

  async getBalance() {
    try {
      this.setState({
        pageLoading: true
      })
      const phone = wx.getStorageSync('phone');
      const response: any = await request("login", {
        phone
      })
      const { errMsg } = response
      if (errMsg !== "cloud.callFunction:ok") {
        Taro.atMessage({
          'message': '获取个人信息错误，请联系客服',
          'type': "error",
        })
        return;
      }
      const { user } = response.result;
      this.setState({
        pageLoading: false,
        balance: user.balance
      })
    } catch (error) {
      console.error("获取余额失败：" + error)
    }
  }

  componentDidMount() {
    this.getBalance()
  }

  render() {
    const { pageLoading, balance, chargeLoading } = this.state;
    return <View className="recharge-page">
      <AtToast isOpened={chargeLoading} status="loading" duration={0} hasMask={true} ></AtToast>
      <AtMessage />
      <View className="card">
        <Text className="card-title">卡余额（元）</Text>
        <AtActivityIndicator isOpened={pageLoading} mode='center' color='#fff' size={64}></AtActivityIndicator>
        {
          pageLoading ? '' : <Text className="card-price">
            <Text className="card-price-icon">￥</Text>
            {balance}
          </Text>
        }
      </View>
      <View className="recharge-box">
        <Text className="recharge-label">
          请输入要充值的金额
        </Text>
        <AtInput name="rechargeInput" type='number' value={this.state.rechargePrice} cursor={this.state.rechargePrice.length} placeholder="请输入充值金额" onChange={this.handleChange.bind(this)} />
        <AtButton circle onClick={this.chargePrice.bind(this)}>充值</AtButton>
      </View>
      <View className="tips-wapper">
        <Text className="tips-title">温馨提示</Text>
        <View className="tips-container">
          <Text>1. 充值金额须大于等于
          <Text className="highlight">600</Text>
          </Text>
        </View>
      </View>
    </View>
  }
}