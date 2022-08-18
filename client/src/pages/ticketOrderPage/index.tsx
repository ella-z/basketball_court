import React, { Component } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { AtTabs, AtTabsPane } from "taro-ui";
import Ticket from "./components/ticket/index"

import "./index.scss"

interface TicketOrderProps { }
interface TicketOrderState {
  current: number
}

export default class TicketOrder extends Component<TicketOrderProps, TicketOrderState> {
  constructor(props) {
    super(props)
    this.state = {
      current: 0
    }
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
          <View className="order-list">
            <Ticket></Ticket>
          </View>
        </AtTabsPane>
        <AtTabsPane current={current} index={1}>
          <View className="order-list">标签页二的内容</View>
        </AtTabsPane>
        <AtTabsPane current={current} index={2}>
          <View className="order-list">标签页三的内容</View>
        </AtTabsPane>
      </AtTabs>
    )
  }
}