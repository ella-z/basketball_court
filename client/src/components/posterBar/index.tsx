import { Component } from 'react'
import Taro from '@tarojs/taro'
import { Swiper, SwiperItem, Image } from '@tarojs/components'
import './index.scss'

type PageState = {
  imgList: Array<string>
}

export default class posterBar extends Component<any, PageState> {
  constructor(props) {
    super(props)
    this.state = {
      imgList: [
        require("../../assets/bg_1.png"),
        require("../../assets/bg_2.png"),
        require("../../assets/bg_3.png"),
      ]
    }
  }
  render() {
    const { imgList } = this.state
    return (
      <Swiper
        circular
        indicatorDots
        autoplay>
        {
          imgList && imgList.map((item: string, index: number) => {
            return <SwiperItem key={index}>
              <Image className="swiper_image" src={item}></Image>
            </SwiperItem>
          })
        }
      </Swiper>
    )
  }
}
