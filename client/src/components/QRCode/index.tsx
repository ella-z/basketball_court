import { Component } from "react"
import Taro from '@tarojs/taro'
import { QRCode } from 'taro-code'
import { Text } from "@tarojs/components"
import { AtModal, AtModalHeader, AtModalContent } from "taro-ui"

import "./index.scss"

interface QRCodeProps {
  codeText: string
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

  render() {
    const { isOpened } = this.state
    const { codeText } = this.props
    return (
      <AtModal isOpened={isOpened}>
        <AtModalHeader>
          <Text className="highlight">态度</Text>
          篮球公园
          </AtModalHeader>
        <AtModalContent>
          <QRCode
            text={codeText}
            size={this.getPx(510)}
            errorCorrectLevel='M'
            typeNumber={2}
          />
        </AtModalContent>
      </AtModal>

    )
  }
}