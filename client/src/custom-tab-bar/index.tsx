import { Component } from 'react'
import Taro from '@tarojs/taro'
import { View } from "@tarojs/components"
import { AtTabBar } from 'taro-ui'
import './index.scss'
import { connect } from 'react-redux'

type TabBarProps = {
  selected: number
}

type TabBarState = {
  current: number
}

class Index extends Component<TabBarProps, TabBarState> {
  constructor(props) {
    super(props)
    this.state = {
      current: 0
    }
  }

  urlList = [
    'pages/homePage/index',
    'pages/userPage/index',
  ]

  handleClick(value) {
    if (value === 0) {
      Taro.switchTab({
        url: '/pages/homePage/index',
        complete: () => {
          this.setState({
            current: value
          })
        }
      })
    } else {
      Taro.switchTab({
        url: '/pages/userPage/index',
        complete: () => {
          this.setState({
            current: value
          })
        }
      })
    }
  }

  componentWillMount() {
    const currentPage = Taro.getCurrentPages()
    if (currentPage.length > 0) {
      this.setState({
        current: this.urlList.indexOf(currentPage[0].route)
      })
    }
  }

  render() {
    const { selected } = this.props
    return (
      <View id="tabbar">
        <AtTabBar
          backgroundColor="#18181a"
          color='#8a8a8d'
          selectedColor='#78DB64'
          fixed
          tabList={[
            { title: '主页', iconType: 'home' },
            { title: '我的', iconType: 'user' },
          ]}
          onClick={this.handleClick.bind(this)}
          current={selected}
        />
      </View>

    )
  }
}

const mapStateToProps = (state: any) => {
  return {
    selected: state.tabBar.selected
  }
}

const mapDispatchToProps = () => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Index);