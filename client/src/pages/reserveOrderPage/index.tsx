import React, { Component, useState, } from 'react'
import Taro, { usePullDownRefresh, useReady } from "@tarojs/taro"
import { View, Text } from '@tarojs/components'
import { AtTabs, AtTabsPane, AtToast } from "taro-ui";
import ReserveTicket from "./components/reserveTicket/index"
import { request } from "../../utils/request"

import "./index.scss"

export default function ReserveOrder() {
  const [currentPage, setCurrentPage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [unusedOrderList, setUnusedOrderList] = useState([])
  const [usedOrderList, setUsedOrderList] = useState([])
  const [overTimeOrderList, setOverTimeOrderList] = useState([])

  const getOrderList = async (status: number) => {
    try {
      setLoading(true)
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
        setLoading(false)
        return
      }
      if (status === 0) {
        setUnusedOrderList(result.orderList)
      } else if (status === 1) {
        setUsedOrderList(result.orderList)
      } else {
        setOverTimeOrderList(result.orderList)
      }
      setLoading(false)
    } catch (error) {
      console.error("获取订单信息错误：" + error)
    }
  }

  const handleClick = (value: number) => {
    setCurrentPage(value)
    getOrderList(value)
  }

  useReady(() => {
    getOrderList(currentPage);
  })

  usePullDownRefresh(() => {
    getOrderList(currentPage);
  })


  return (
    <View>
      <AtToast className="toast" isOpened={loading} status="loading" duration={0} hasMask={true}></AtToast>
      <AtTabs current={currentPage} tabList={[{ title: '未使用' }, { title: '已使用' }, { title: '已过期' }]} onClick={handleClick}>
        <AtTabsPane current={currentPage} index={0} >
          <View className="reserve-order-list">
            {
              (currentPage === 0 && unusedOrderList.length === 0 && loading === false) ?
                <Text className="empty-tips">暂无数据</Text> :
                unusedOrderList.map(item =>
                  <ReserveTicket info={item} status={0}></ReserveTicket>
                )
            }
          </View>
        </AtTabsPane>
        <AtTabsPane current={currentPage} index={1}>
          <View className="reserve-order-list">
            {
              (currentPage === 1 && usedOrderList.length === 0 && loading === false) ?
                <Text className="empty-tips">暂无数据</Text> :
                usedOrderList.map(item =>
                  <ReserveTicket info={item} status={1}></ReserveTicket>
                )
            }
          </View>
        </AtTabsPane>
        <AtTabsPane current={currentPage} index={2}>
          <View className="reserve-order-list">
            {
              (currentPage === 2 && overTimeOrderList.length === 0 && loading === false) ?
                <Text className="empty-tips">暂无数据</Text> :
                overTimeOrderList.map(item =>
                  <ReserveTicket info={item} status={2}></ReserveTicket>
                )
            }
          </View>
        </AtTabsPane>
      </AtTabs>
    </View>
  )

}