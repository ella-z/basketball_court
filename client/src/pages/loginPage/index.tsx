import React, { Component } from "react"
import Taro from '@tarojs/taro'
import { View, Text, Image, Checkbox, CheckboxGroup } from "@tarojs/components"
import { AtButton, AtToast, AtMessage } from "taro-ui"
import { request } from "../../utils/request"
import BookInformation from "../../components/bookInformation/index"

import "./index.scss"

interface LoginState {
  wechatIcon: string,
  logoIcon: string,
  checkValue: boolean,
  loading: boolean,
  informationRef: any
}

export default class LoginPage extends Component<any, LoginState> {
  constructor(props) {
    super(props)
    this.state = {
      wechatIcon: require("../../assets/icons/wechat.png"),
      logoIcon: require("../../assets/logo.png"),
      checkValue: false,
      loading: false,
      informationRef: React.createRef()
    }
  }

  changeCheckValue(event) {
    this.setState({
      checkValue: event.detail.value.includes('check')
    })
  }

  async toGetPhone(e) {
    try {
      this.setState({
        loading: true
      })
      const response: any = await request('phone', {
        code: e.detail.code
      })
      const { errMsg, result } = response;
      if (errMsg !== 'cloud.callFunction:ok') {
        Taro.atMessage({
          'message': '登录失败',
          'type': "error",
        })
        return;
      }
      console.log(response)
      wx.setStorageSync('phone', result.phoneInfo.phoneNumber)
      this.setState({
        loading: false
      })
    } catch (error) {
      console.error('登录报错：', error)
    }

  }

  toLogin() {
    const { checkValue } = this.state
    if (!checkValue) {
      Taro.atMessage({
        'message': '请先阅读并同意订场须知',
        'type': "error",
      })
      return;
    }
  }

  toOpenInformation(ref: any) {
    if (!ref.current) return;
    ref.current.setState({
      isOpened: true
    })
  }

  render() {
    let { wechatIcon, logoIcon, checkValue, loading, informationRef } = this.state;
    return <View className="login-page">
      <AtMessage />
      <BookInformation ref={informationRef} />
      <AtToast className="toast" isOpened={loading} status="loading" duration={0} hasMask={true}></AtToast>
      <View className="title-wapper">
        <Image className="logo" src={logoIcon}></Image>
        <Text className="title">态度篮球公园</Text>
      </View>
      <View className="login-page-bottom">
        <View className="checkbox-wapper">
          <CheckboxGroup onChange={this.changeCheckValue.bind(this)}>
            <Checkbox className="checkbox-view" value="check" checked={checkValue}>
            </Checkbox>
          </CheckboxGroup>
          <Text className="checkbox-tips" onClick={this.toOpenInformation.bind(this, informationRef)}>阅读并同意态度篮球公园的
            <Text className="highlight">订场须知</Text>
          </Text>
        </View>
        {
          !checkValue ? <AtButton circle onClick={this.toLogin.bind(this)}>
            <Image className="icon" src={wechatIcon}></Image>
            <Text>微信用户一键登录</Text>
          </AtButton> : <AtButton circle openType="getPhoneNumber" onGetPhoneNumber={this.toGetPhone.bind(this)}>
              <Image className="icon" src={wechatIcon}></Image>
              <Text>微信用户一键登录</Text>
            </AtButton>
        }
      </View>
    </View>

  }
}