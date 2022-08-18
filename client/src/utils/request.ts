export const request = (name: string, data: any) => {
  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name,
      data,
      success: (res: any) => {
        resolve(res)
      },
      fail: (event: any) => {
        reject(event)
      }
    })
  })
}