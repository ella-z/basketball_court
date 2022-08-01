import { Component } from "react"
import Taro, { Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtInput, AtButton } from "taro-ui"

import "./index.scss"

type RechargeProps = {
}

type RechargeState = {
  rechargePrice: string
}

export default class RechargePage extends Component<RechargeProps, RechargeState> {
  constructor(props) {
    super(props)
    this.state = {
      rechargePrice: ''
    }
  }

  handleChange(val: string) {
    console.log(val)
    this.setState({
      rechargePrice: val
    })
  }

  render() {
    return <View className="recharge-page">
      <View className="card">
        <Text className="card-title">卡余额（元）</Text>
        <Text className="card-price">
          <Text className="card-price-icon">￥</Text>
          600
        </Text>
      </View>
      <View className="recharge-box">
        <Text className="recharge-label">
          请输入要充值的金额
        </Text>
        <AtInput name="rechargeInput" type='number' value={this.state.rechargePrice} cursor={this.state.rechargePrice.length} placeholder="请输入充值金额" onChange={this.handleChange.bind(this)} />
        <AtButton circle>充值</AtButton>
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