export default {
  entryPagePath:'pages/homePage/index',
  pages: [
    'pages/homePage/index',
    'pages/userPage/index',
    'pages/ticketPage/index',
    'pages/rechargePage/index',
    'pages/reservePage/index',
    'pages/ticketOrderPage/index',
    'pages/reserveOrderPage/index'
  ],
  tabBar: {
    custom: true,
    list: [
      {
        pagePath: 'pages/homePage/index',
        text: '主页'
      },
      {
        pagePath: 'pages/userPage/index',
        text: '我的'
      }
    ],
    'color': '#8a8a8d',
    'backgroundColor': '#18181a',
  },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#18181a',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'white'
  },
  cloud: true
}
