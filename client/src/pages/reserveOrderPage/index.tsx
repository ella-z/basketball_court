import React, { Component } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { AtTabs, AtTabsPane } from "taro-ui";
import ReserveTicket from "./components/reserveTicket/index"

import "./index.scss"

interface ReserveOrderProps { }
interface ReserveOrderState {
  currentCodeText: string,
  current: number
}

export default class ReserveOrder extends Component<ReserveOrderProps, ReserveOrderState> {
  constructor(props) {
    super(props)
    this.state = {
      currentCodeText: JSON.stringify({
        id: '123',
        date: "2022-08-03",
        openid: 'xxx',
        orderId: '111',
        orderStatus: "0",
        phone: '13543009092',
        courtNumber: [1],
        orderTime: '10:00~12:00',
        type: 'halfCourt'
      }),
      current: 0
    }
  }

  toUse(ref: any) {
    const { currentCodeText } = this.state
    if (!ref.current || !currentCodeText) return;
    ref.current.setState({
      isOpened: true
    })
  }

  handleClick(value: number) {
    this.setState({
      current: value
    })
  }

  render() {
    const { current } = this.state;
    const tabList = [{ title: '未使用' }, { title: '已使用' }, { title: '已过期' }]
    return (
      <AtTabs current={current} tabList={tabList} onClick={this.handleClick.bind(this)}>
        <AtTabsPane current={current} index={0} >
          <View className="reserve-order-list">
            <ReserveTicket></ReserveTicket>
          </View>
        </AtTabsPane>
        <AtTabsPane current={current} index={1}>
          <View className="reserve-order-list">标签页二的内容</View>
        </AtTabsPane>
        <AtTabsPane current={current} index={2}>
          <View className="reserve-order-list">标签页三的内容</View>
        </AtTabsPane>
      </AtTabs>
    )
  }
}