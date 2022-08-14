import { Component } from "react"
import Taro, { Config } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { AtModal, AtModalHeader, AtModalContent, AtModalAction } from "taro-ui"

import { OrderInfoType } from "../../type/index"

import "./index.scss"

interface OrderModalState {
  isOpened: boolean
}

interface OrderModalProps {
  currentOrder: OrderInfoType | null
}

export default class OrderModal extends Component<OrderModalProps, OrderModalState> {
  constructor(props) {
    super(props)
    this.state = {
      isOpened: false
    }
  }

  cancel() {
    this.setState({
      isOpened: false
    })
  }

  render() {
    const { isOpened } = this.state
    const { currentOrder } = this.props
    return <AtModal isOpened={isOpened}>
      <AtModalHeader>
        订单
      </AtModalHeader>
      <AtModalContent>
        <View className="info-item">
          <Text className="title">订单Id：</Text>
          {currentOrder?.orderId || ''}
        </View>
        <View className="info-item">
          <Text className="title">日期：</Text>
          {currentOrder?.orderTime}
        </View>
        <View className="info-item">
          <Text className="title">类型：</Text>
          {currentOrder?.type === 'halfCourt' ? '半场' : '全场'}
        </View>
        <View className="info-item">
          <Text className="title">场号：</Text>
          {currentOrder?.courtNumber.map((item: number) => item + '号场')}
        </View>
        <View className="info-item">
          <Text className="title">电话号码：</Text>
          {currentOrder?.phone}
        </View>
      </AtModalContent>
      <AtModalAction>
        <Button onClick={this.cancel.bind(this)}>取消</Button>
        <Button>确认核销</Button>
      </AtModalAction>
    </AtModal>
  }
}