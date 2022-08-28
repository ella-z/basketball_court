import { Component } from "react"
import Taro from '@tarojs/taro'
import { QRCode } from 'taro-code'
import { Text, View } from "@tarojs/components"

import "./index.scss"

interface QRCodeProps {
  codeText: string
  onCloseCode?: any
}

interface QRCodeState {
  isOpened: boolean
}

export default class CodeIndex extends Component<QRCodeProps, QRCodeState> {
  constructor(props) {
    super(props)
    this.state = {
      isOpened: false
    }
  }

  getPx = (number: number, designWidth = 750): number => {
    const sys = Taro.getSystemInfoSync();
    const scale = sys.screenWidth / designWidth; // 缩放比例
    return Number(Number(number * scale).toFixed(0)); // 返回缩放后的值
  }

  overlayClick = () => {
    this.setState({
      isOpened: false
    }, () => {
      this.props.onCloseCode && this.props.onCloseCode()
    })
  }

  render() {
    const { isOpened } = this.state
    const { codeText } = this.props
    return (
      <View className={isOpened ? 'code-wapper' : 'none'}>
        <View className="overlay" onClick={this.overlayClick.bind(this)}></View>
        <View className="code">
          <Text className="title">
            <Text className="highlight">态度</Text>
          篮球公园
          </Text>
          <QRCode
            text={codeText}
            size={this.getPx(510)}
            errorCorrectLevel='M'
            typeNumber={2}
          />
        </View>
      </View>
    )
  }
}