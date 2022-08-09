import { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image, Button } from '@tarojs/components'
import { AtModal, AtModalContent } from "taro-ui"
import './index.scss'

interface PriceModalProps { }
interface PriceModalState {
  isOpened: boolean,
  pricePoster: string
}

export default class PriceModal extends Component<PriceModalProps, PriceModalState>{
  constructor(props: PriceModalProps) {
    super(props)
    this.state = {
      isOpened: false,
      pricePoster: require("../../../../assets/pricePoster.png")
    }
  }

  openPriceModal() {
    this.setState(
      { isOpened: true }
    )
  }

  confirmModal() {
    this.setState({
      isOpened: false
    })
  }

  render() {
    const { isOpened, pricePoster } = this.state;
    return <AtModal isOpened={isOpened} onConfirm={this.confirmModal}>
      <AtModalContent>
        <Image className="price-poster" src={pricePoster}></Image>
      </AtModalContent>
    </AtModal>
  }
}