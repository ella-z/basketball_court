import React, { useState, useRef } from 'react'
import Taro, { usePullDownRefresh, useReady } from "@tarojs/taro"
import { View, Text } from '@tarojs/components'
import { AtTabs, AtTabsPane, AtMessage, AtToast } from "taro-ui";
import Ticket from "./components/ticket/index"
import { request } from "../../utils/request"

import "./index.scss"

export default function TicketOrder() {
  const [unusedOrderList, setUnusedOrderList] = useState([])
  const [usedOrderList, setUsedOrderList] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)

  const getOrderList = async (status: number) => {
    try {
      setLoading(true)
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
        setLoading(false)
        return
      }
      if (status === 0) {
        setUnusedOrderList(result.orderList)
      } else {
        setUsedOrderList(result.orderList)
      }
      setLoading(false)

    } catch (error) {
      console.error("获取订单信息错误：" + error)
      setLoading(false)
    }
  }

  const handleClick = (value: number) => {
    setCurrentPage(value)
    Taro.nextTick(() => {
      getOrderList(value)
    })
  }

  useReady(() => {
    getOrderList(currentPage);
  })

  usePullDownRefresh(() => {
    getOrderList(currentPage);
    wx.stopPullDownRefresh();
  })

  return (
    <View>
      <AtMessage />
      <AtToast className="toast" isOpened={loading} status="loading" duration={0} hasMask={true}></AtToast>
      <AtTabs current={currentPage} tabList={[{ title: '未使用' }, { title: '已使用' }]} onClick={handleClick}>
        <AtTabsPane current={currentPage} index={0} >
          <View className="order-list">
            {currentPage === 0 && ((unusedOrderList.length !== 0 || loading === true) ?
              unusedOrderList.map(item =>
                <Ticket info={item} status={0} onCloseCode={getOrderList.bind(this, 0)}></Ticket>
              )
              : <Text className="empty-tips">暂无数据</Text>)
            }
          </View>
        </AtTabsPane>
        <AtTabsPane current={currentPage} index={1}>
          <View className="order-list">
            {currentPage === 1 && ((usedOrderList.length !== 0 || loading === true) ? usedOrderList.map(item =>
              <Ticket info={item} status={1} onCloseCode={getOrderList.bind(this, 0)}></Ticket>
            ) : <Text className="empty-tips">暂无数据</Text>)}
          </View>
        </AtTabsPane>
      </AtTabs>
    </View>

  )

}