import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import './index.scss'
import PosterBar from "../../components/posterBar"
import PriceModal from "./components/priceModal"

interface HomeProps { }
interface HomeState {
  icons: any,
  priceModalRef: any
}

export default class Home extends Component<HomeProps, HomeState> {
  constructor(props) {
    super(props)
    this.state = {
      icons: {
        list: "cloud://court-cloud-dev-4gqwp6nu564859aa.636f-court-cloud-dev-4gqwp6nu564859aa-1312772459/icon/list.png",
        court: "cloud://court-cloud-dev-4gqwp6nu564859aa.636f-court-cloud-dev-4gqwp6nu564859aa-1312772459/icon/court.png",
        basketball: "cloud://court-cloud-dev-4gqwp6nu564859aa.636f-court-cloud-dev-4gqwp6nu564859aa-1312772459/icon/basketball.png",
        consume: "cloud://court-cloud-dev-4gqwp6nu564859aa.636f-court-cloud-dev-4gqwp6nu564859aa-1312772459/icon/consume.png",
        phone: "cloud://court-cloud-dev-4gqwp6nu564859aa.636f-court-cloud-dev-4gqwp6nu564859aa-1312772459/icon/phone.png"
      },
      priceModalRef: React.createRef()
    }
  }

  toPage(type: string) {
    switch (type) {
      case "ticket": {
        Taro.navigateTo({ url: '/pages/ticketPage/index' })
        break;
      }
      case "reserve": {
        Taro.navigateTo({ url: '/pages/reservePage/index' })
        break;
      }
      case "recharge": {
        Taro.navigateTo({ url: '/pages/rechargePage/index' })
        break;
      }
      default:
        break;
    }
  }

  openPriceModal(ref: any) {
    if (!ref.current) return;
    ref.current.setState({
      isOpened: true
    })
  }

  makePhoneCall() {
    Taro.makePhoneCall({
      phoneNumber: '13727016125',
      fail: () => {

      }
    })
  }

  render() {
    const { icons, priceModalRef } = this.state;
    return (
      <View className="home-page">
        <PosterBar />
        <View className="box-wapper">
          <View className="box" onClick={this.toPage.bind(this, 'reserve')}>
            <Image className="icon-image" src={icons['court']}></Image>
            <Text>
              我要
           <Text className="highlight-text">
                包场
           </Text>
            </Text>
          </View>
          <View className="box" onClick={this.toPage.bind(this, 'ticket')}>
            <Image className="icon-image" src={icons['basketball']}></Image>
            <Text>
              我是
              <Text className="highlight-text">
                散客
              </Text>
            </Text>
          </View>
          <View className="box" onClick={this.toPage.bind(this, 'recharge')}>
            <Image className="icon-image" src={icons['consume']}></Image>
            <Text>
              我想
           <Text className="highlight-text">
                充值
           </Text>
            </Text>
          </View>
        </View>
        <View className="button-wapper">
          <View className="button" onClick={this.openPriceModal.bind(this, priceModalRef)}>
            <Image className="button-icon" src={icons['list']}></Image>
            价目表
          </View>
          <View className="button" onClick={this.makePhoneCall.bind(this)}>
            <Image className="button-icon" src={icons['phone']}></Image>
            联系客服
          </View>
        </View>
        <PriceModal ref={priceModalRef} />
      </View>
    )
  }
}
