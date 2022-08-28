import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import './index.scss'
import PosterBar from "../../components/posterBar"
import PriceModal from "./components/priceModal"
import BookInformation from "../../components/bookInformation/index"
import { verifyPremission } from "../../utils/premission"
import { connect } from 'react-redux'
import { change } from "../../store/actions/tabBar"

interface HomeProps {
  change: Function
}
interface HomeState {
  icons: any,
  priceModalRef: any,
  informationRef: any,
}

class Home extends Component<HomeProps, HomeState> {
  constructor(props) {
    super(props)
    this.state = {
      icons: {
        list: require("../../assets/icons/list.png"),
        court: require("../../assets/icons/court.png"),
        basketball: require("../../assets/icons/basketball.png"),
        consume: require("../../assets/icons/consume.png"),
        phone: require("../../assets/icons/phone.png"),
        listNumbers: require("../../assets/icons/listNumbers.png")
      },
      priceModalRef: React.createRef(),
      informationRef: React.createRef(),

    }
  }



  toPage(type: string) {
    const premission = verifyPremission();
    if (!premission) {
      return
    }
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

  openModal(ref: any) {
    if (!ref.current) return;
    ref.current.setState({
      isOpened: true
    })
  }

  makePhoneCall() {
    Taro.makePhoneCall({
      phoneNumber: '15360959330',
      fail: () => {

      }
    })
  }

  componentDidShow() {
    this.props.change(0)
  }

  render() {
    const { icons, priceModalRef, informationRef } = this.state;
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
          <View className="button" onClick={this.openModal.bind(this, priceModalRef)}>
            <Image className="button-icon" src={icons['list']}></Image>
            价目表
          </View>
          <View className="button" onClick={this.openModal.bind(this, informationRef)}>
            <Image className="button-icon" src={icons['listNumbers']}></Image>
            订场须知
          </View>
          <View className="button" onClick={this.makePhoneCall.bind(this)}>
            <Image className="button-icon" src={icons['phone']}></Image>
            联系客服
          </View>
        </View>
        <BookInformation ref={informationRef} />
        <PriceModal ref={priceModalRef} />
      </View>
    )
  }
}

const mapStateToProps = () => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {
    change: (selected: Number) => dispatch(change(selected))
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Home);