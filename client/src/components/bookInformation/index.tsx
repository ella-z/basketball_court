import { Component } from 'react'
import { Text, Button } from '@tarojs/components'
import { AtModal, AtModalHeader, AtModalContent, AtModalAction } from "taro-ui"

import "./index.scss"

interface BookState {
  isOpened: boolean
}

interface BookProps {

}

export default class BookInformation extends Component<BookProps, BookState> {
  constructor(props) {
    super(props)
    this.state = {
      isOpened: false
    }
  }

  closeInformation() {
    this.setState({
      isOpened: false
    })
  }

  render() {
    const { isOpened } = this.state;
    return <AtModal className="information-modal" isOpened={isOpened}>
      <AtModalHeader>订场须知</AtModalHeader>
      <AtModalContent>
        <Text className="notice">1.入场请打卡场所码并出示订场信息。</Text>
        <Text className="notice">2.请勿在场馆内吸烟。</Text>
        <Text className="notice">3.馆内有提供免费淋浴间、储物柜，如有需要可向前台咨询。</Text>
        <Text className="notice">4.如需更改订场时间，请提前24小时与场馆工作人员联系</Text>
        <Text className="notice">5.公共场所，请自行保管好随身物品，离开时请带齐随身物品，如有丢失，自行负责。</Text>
      </AtModalContent>
      <AtModalAction>  <Button className="comfirm-button" onClick={this.closeInformation.bind(this)}>确定</Button> </AtModalAction>
    </AtModal>
  }
}