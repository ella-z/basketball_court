import { Component } from 'react'
import Taro from '@tarojs/taro'
import { Swiper, SwiperItem, Image } from '@tarojs/components'
import { request } from "../../utils/request"
import './index.scss'

type PageState = {
  posterList: Array<string>
}

export default class posterBar extends Component<any, PageState> {
  constructor(props) {
    super(props)
    this.state = {
      posterList: []
    }
  }

  async getPosterList() {
    try {
      const response: any = await request('get_carousel');
      if (response.errMsg === "cloud.callFunction:ok") {
        this.setState({
          posterList: response.result.carouselList.map(item => item.url)
        })
      }
    } catch (error) {
      console.error('获取海报列表报错：', error)
    }
  }

  componentDidMount() {
    this.getPosterList()
  }

  render() {
    const { posterList } = this.state
    return (
      <Swiper
        circular
        indicatorDots
        autoplay>
        {
          posterList && posterList.map((item: string, index: number) => {
            return <SwiperItem key={index}>
              <Image className="swiper_image" src={item}></Image>
            </SwiperItem>
          })
        }
      </Swiper>
    )
  }
}
