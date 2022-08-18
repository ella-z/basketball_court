export default {
  entryPagePath: 'pages/homePage/index',
  pages: [
    "pages/homePage/index",
    "pages/userPage/index",
    "pages/ticketPage/index",
    "pages/rechargePage/index",
    "pages/reservePage/index",
    "pages/ticketOrderPage/index",
    "pages/reserveOrderPage/index",
    "pages/loginPage/index",
  ],
  tabBar: {
    custom: true,
    color: "#8a8a8d",
    selectedColor: "#78DB64",
    backgroundColor: "#18181a",
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
  },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#18181a',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'white'
  },
  cloud: true
}
