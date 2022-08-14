import { Component } from "react"
import Taro from '@tarojs/taro'
import { View, Text, Image, Checkbox } from "@tarojs/components"
import { AtButton } from "taro-ui"

import "./index.scss"

interface OptionState {
  value: string,
  label: string,
}

interface LoginState {
  wechatIcon: string,
  logoIcon: string
}

export default class LoginPage extends Component<any, LoginState> {
  constructor(props) {
    super(props)
    this.state = {
      wechatIcon: "cloud://court-cloud-dev-4gqwp6nu564859aa.636f-court-cloud-dev-4gqwp6nu564859aa-1312772459/icon/wechat.png",
      logoIcon: require("../../assets/logo.png")
    }
  }


  render() {
    const { wechatIcon, logoIcon } = this.state;
    return <View className="login-page">
      <View className="title-wapper">
        <Image className="logo" src={logoIcon}></Image>
        <Text className="title">态度篮球公园</Text>
      </View>
      <View className="login-page-bottom">
        <View className="checkbox-wapper">
          <Checkbox className="checkbox-view" value='x'>
          </Checkbox>
          <Text className="checkbox-tips">阅读并同意态度篮球公园的<Text className="highlight">订场须知</Text></Text>
        </View>
        <AtButton circle>
          <Image className="icon" src={wechatIcon}></Image>
          <Text>微信用户一键登录</Text>
        </AtButton>
      </View>
    </View>

  }
}