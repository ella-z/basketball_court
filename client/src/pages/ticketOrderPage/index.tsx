import React, { Component } from 'react'
import Taro from "@tarojs/taro"
import { View } from '@tarojs/components'
import { AtTabs, AtTabsPane, AtMessage, AtToast } from "taro-ui";
import Ticket from "./components/ticket/index"
import { request } from "../../utils/request"
import { OrderState } from "../../type/index"

import "./index.scss"

interface TicketOrderProps { }
interface TicketOrderState {
  current: number,
  listLoading: boolean,
  unusedOrderList: OrderState[],
  usedOrderList: OrderState[],
}

export default class TicketOrder extends Component<TicketOrderProps, TicketOrderState> {
  constructor(props) {
    super(props)
    this.state = {
      current: 0,
      listLoading: false,
      unusedOrderList: [],
      usedOrderList: []
    }
  }

  async getOrderList(status: number) {
    try {
      this.setState({
        listLoading: true
      })
      const data = {
        type: 'wildOrder',
        orderStatus: status
      }
      const response: any = await request('get_order', data)
      const { errMsg, result } = response;
      if (errMsg !== "cloud.callFunction:ok" || result.status != 'success') {
        Taro.atMessage({
          "type": "error",
          "message": "获取订单失败，请重试！"
        })
        this.setState({
          listLoading: false
        })
        return
      }
      if (status === 0) {
        this.setState({
          unusedOrderList: result.orderList
        })
      } else {
        this.setState({
          usedOrderList: result.orderList
        })
      }
      this.setState({
        listLoading: false
      })
    } catch (error) {
      console.error("获取订单信息错误：" + error)
    }
  }

  handleClick(value: number) {
    this.setState({
      current: value
    })
    this.getOrderList(value)
  }



  componentDidMount() {
    const { current } = this.state;
    this.getOrderList(current)
  }

  render() {
    const { current, unusedOrderList, usedOrderList, listLoading } = this.state;
    const tabList = [{ title: '未使用' }, { title: '已使用' }]
    return (
      <View>
        <AtMessage />
        <AtToast className="toast" isOpened={listLoading} status="loading" duration={0} hasMask={true}></AtToast>
        <AtTabs current={current} tabList={tabList} onClick={this.handleClick.bind(this)}>
          <AtTabsPane current={current} index={0} >
            <View className="order-list">
              {unusedOrderList.map(item =>
                <Ticket info={item} status={0}></Ticket>
              )}
            </View>
          </AtTabsPane>
          <AtTabsPane current={current} index={1}>
            <View className="order-list">
              {usedOrderList.map(item =>
                <Ticket info={item} status={1}></Ticket>
              )}
            </View>
          </AtTabsPane>
        </AtTabs>
      </View>

    )
  }
}