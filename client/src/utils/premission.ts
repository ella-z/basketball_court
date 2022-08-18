import Taro from '@tarojs/taro'
export const verifyPremission = (): boolean => {
  const phone = wx.getStorageSync("phone")
  if (!phone) {
    Taro.navigateTo({ url: '/pages/loginPage/index' })
    return false
  }
  return true
}