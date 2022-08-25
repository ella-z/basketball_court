import React, { Component } from 'react'
import Taro from "@tarojs/taro"
import { View, Text, Image } from '@tarojs/components'
import { AtTabs, AtTabsPane, AtToast } from "taro-ui";
import ReserveTicket from "./components/reserveTicket/index"
import { request } from "../../utils/request"
import { OrderState } from "../../type/index"

import "./index.scss"

interface ReserveOrderProps { }
interface ReserveOrderState {
  currentCodeText: string,
  current: number,
  listLoading: boolean,
  unusedOrderList: OrderState[],
  usedOrderList: OrderState[],
  overTimeOrderList: OrderState[]
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
      current: 0,
      listLoading: false,
      unusedOrderList: [],
      usedOrderList: [],
      overTimeOrderList: []
    }
  }

  async getOrderList(status: number) {
    try {
      this.setState({
        listLoading: true
      })
      const data = {
        type: 'courtOrder',
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
      } else if (status === 1) {
        this.setState({
          usedOrderList: result.orderList
        })
      } else {
        this.setState({
          overTimeOrderList: result.orderList
        })
      }
      this.setState({
        listLoading: false
      })
      console.log(this.state)
    } catch (error) {
      console.error("获取订单信息错误：" + error)
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
    this.getOrderList(value)
  }

  componentDidMount() {
    const { current } = this.state;
    this.getOrderList(current)
  }

  render() {
    const { current, listLoading, unusedOrderList, usedOrderList, overTimeOrderList } = this.state;
    const tabList = [{ title: '未使用' }, { title: '已使用' }, { title: '已过期' }]
    return (
      <View>
        <AtToast className="toast" isOpened={listLoading} status="loading" duration={0} hasMask={true}></AtToast>
        <AtTabs current={current} tabList={tabList} onClick={this.handleClick.bind(this)}>
          <AtTabsPane current={current} index={0} >
            <View className="reserve-order-list">
              {
                unusedOrderList.map(item =>
                  <ReserveTicket info={item} status={0}></ReserveTicket>
                )
              }
            </View>
          </AtTabsPane>
          <AtTabsPane current={current} index={1}>
            <View className="reserve-order-list">
              {usedOrderList.map(item =>
                <ReserveTicket info={item} status={1}></ReserveTicket>
              )}
            </View>
          </AtTabsPane>
          <AtTabsPane current={current} index={2}>
            <View className="reserve-order-list">
              {overTimeOrderList.map(item =>
                <ReserveTicket info={item} status={2}></ReserveTicket>
              )}
            </View>
          </AtTabsPane>
        </AtTabs></View>

    )
  }
}