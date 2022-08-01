export default {
  pages: [
    'pages/index/index',
    'pages/my/index',
    'pages/ticketPage/index',
    'pages/rechargePage/index',
    'pages/reservePage/index'
  ],
  tabBar: {
    custom: true,
    list: [
      {
        pagePath: 'pages/index/index',
        text: '主页'
      },
      {
        pagePath: 'pages/my/index',
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
