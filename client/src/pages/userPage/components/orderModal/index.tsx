import { Component } from "react"
import Taro, { Config } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { AtModal, AtModalHeader, AtModalContent, AtModalAction, AtToast, AtMessage } from "taro-ui"
import { OrderInfoType } from "../../type/index"
import { request } from "../../../../utils/request"

import "./index.scss"

interface OrderModalState {
  isOpened: boolean,
  loading: boolean
}

interface OrderModalProps {
  currentOrder: OrderInfoType | null,
}

export default class OrderModal extends Component<OrderModalProps, OrderModalState> {
  constructor(props) {
    super(props)
    this.state = {
      isOpened: false,
      loading: false
    }
  }

  cancel() {
    this.setState({
      isOpened: false
    })
  }

  getType(type: string | undefined) {
    if (type === undefined) return ''
    if (type === "halfCourt") {
      return '半场'
    } else if (type === "allCourt") {
      return '全场'
    } else {
      return '散客场'
    }
  }

  async comfirm() {
    try {
      if (!this.props.currentOrder?.orderId) {
        Taro.atMessage({
          "type": "error",
          "message": "订单信息id不存在，无法核销"
        })
        return;
      }
      this.setState({
        loading: true
      })
      const data = {
        _id: this.props.currentOrder.orderId
      }
      const response: any = await request("verify_order", data);
      const { errMsg, result } = response
      if (errMsg !== 'cloud.callFunction:ok' || !result.success) {
        Taro.atMessage({
          "type": "error",
          "message": "核销失败"
        })
      } else {
        Taro.atMessage({
          "type": "success",
          "message": "核销成功"
        })
        this.setState({
          isOpened: false
        })
      }
      this.setState({
        loading: false
      })
    } catch (error) {
      console.error('核销报错：', error)
    }
  }

  render() {
    const { isOpened, loading } = this.state
    const { currentOrder } = this.props
    return <View>
      <AtMessage />
      <AtToast isOpened={loading} status="loading" duration={0} hasMask={true} ></AtToast>
      <AtModal isOpened={isOpened}>
        <AtModalHeader>
          订单
      </AtModalHeader>
        <AtModalContent>
          <View className="info-item">
            <Text className="title">订单Id：</Text>
            {currentOrder?.orderId || ''}
          </View>
          {
            currentOrder?.orderTime ? <View className="info-item">
              <Text className="title">日期：</Text>
              {currentOrder.orderTime}
            </View> : ''
          }
          <View className="info-item">
            <Text className="title">类型：</Text>
            {this.getType(currentOrder?.type)}
          </View>
          {currentOrder?.courtNumber ? <View className="info-item">
            <Text className="title">场号：</Text>
            {currentOrder?.courtNumber.map((item: number) => item + '号场')}
          </View> : ''}
          <View className="info-item">
            <Text className="title">电话号码：</Text>
            {currentOrder?.phone}
          </View>
        </AtModalContent>
        <AtModalAction>
          <Button onClick={this.cancel.bind(this)}>取消</Button>
          <Button onClick={this.comfirm.bind(this)}>确认核销</Button>
        </AtModalAction>
      </AtModal>
    </View>
  }
}