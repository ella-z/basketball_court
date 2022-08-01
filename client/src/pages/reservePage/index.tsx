import { Component } from "react"
import Taro, { Config } from '@tarojs/taro'
import { View, Text, Picker, Image } from '@tarojs/components'
import PosterBar from "../../components/posterBar"
import "./index.scss"
import { AtList, AtListItem, AtButton } from 'taro-ui'

import { getDateTime, getWeekTime } from "../../utils/time"
import { isBuffer } from "lodash"

type ReserveProps = {
}

type DateItemState = {
  label: string;
  value: Date;
}

type TimeItemState = {
  label: string,
  status: string,
  statusColor: string
}

type ReserveState = {
  reserveDate: DateItemState | null,
  reserveDateList: DateItemState[],
  reserveTimeList: TimeItemState[],
  viewType: 'list' | 'detail',
  reserveTime: TimeItemState | null,
  imgList: any[],
  checkedCourtIndex: number | null
}

export default class ReservePage extends Component<ReserveProps, ReserveState> {
  constructor(props) {
    super(props)
    const dateList = [0, 1, 2, 3, 4, 5, 6].map(item => {
      let date = new Date();
      date.setTime(date.getTime() + item * 24 * 3600 * 1000)
      return {
        label: getDateTime(date) + " " + getWeekTime(date.getTime()),
        value: date
      }
    })
    this.state = {
      reserveDate: dateList[0] || null,
      reserveDateList: dateList,
      reserveTimeList: [
        {
          label: '08:00~10:00',
          status: '可预订',
          statusColor: "#78DB64",
        },
        {
          label: '10:00~12:00',
          status: '可预订',
          statusColor: "#78DB64"
        },
        {
          label: '12:30~14:30',
          status: '可预订',
          statusColor: "#78DB64"
        },
        {
          label: '14:30~16:30',
          status: '可预订',
          statusColor: "#78DB64"
        },
        {
          label: '16:30~18:30',
          status: '可预订',
          statusColor: "#78DB64"
        },
        {
          label: '18:30~20:30',
          status: '不可预订',
          statusColor: '#999'
        },
        {
          label: '20:30~22:30',
          status: '已订满',
          statusColor: '#F56C6C'
        },
      ],
      viewType: 'list',
      reserveTime: null,
      imgList: [{
        url: require("../../assets/court_1.png"),
        status: 'reserved',
      },
      {
        url: require("../../assets/court_2.png"),
        status: 'noReserved',
      },
      {
        url: require("../../assets/court_3.png"),
        status: 'noReserved',
      },
      {
        url: require("../../assets/court_4.png"),
        status: 'noReserved',
      },

      ],
      checkedCourtIndex: null
    }
  }

  onDateChange = (event: any) => {
    this.setState({
      reserveDate: this.state.reserveDateList[event.detail.value],
    })
  }

  onToDetail = (item: any) => {
    console.log(this.state.reserveDate, item)
    this.setState({
      viewType: 'detail',
      reserveTime: item
    })
  }

  /**
   * 取消选择篮球场
   */
  onBackToList = () => {
    this.setState({
      viewType: 'list',
      reserveTime: null
    })
  }

  onCheckedCourt = (item: any, index: number) => {
    if (item.status === "reserved") return;
    this.setState({
      checkedCourtIndex: index
    })
  }

  render() {
    const { viewType, reserveDateList, reserveDate, reserveTimeList, reserveTime, imgList, checkedCourtIndex } = this.state
    return <View className="reserve-page">
      <PosterBar />
      {viewType === "list" ?
        <View className="list-view">
          <Picker mode='selector' range={reserveDateList.map(item => item.label)} onChange={this.onDateChange}>
            <AtList>
              <AtListItem title={reserveDate ? reserveDate.label : ''} extraText='点击选择' />
            </AtList>
          </Picker>
          <View className="reserve-table">
            <Text className="reserve-table-title">预约时间段</Text>
            {
              reserveTimeList.map(item => {
                return <View className="reserve-table-box">
                  <Text className="time">{item.label}</Text>
                  <Text className="status" style={{ color: item.statusColor }}>{item.status}</Text>
                  <AtButton size='small' disabled={item.status !== "可预订"} onClick={() => this.onToDetail(item)}>选择场地</AtButton>
                </View>
              })
            }
          </View>
        </View>
        : <View className="detail-view">
          <View className="time-wapper">
            <Text className="time-title">预约时间：</Text>
            {reserveTime && reserveDate ? reserveDate.label + " " + reserveTime.label : ''}
          </View>
          <View className="tag-list">
            <View className="tag-wapper">
              <Text className="tag-color" style="border-color:#f82e2e;background-color:#f82e2e"></Text>
              <Text>已预定</Text>
            </View>
            <View className="tag-wapper">
              <Text className="tag-color" style="border-color:#fff"></Text>
              <Text>可预定</Text>
            </View>
          </View>
          <View className="court-wapper">
            {imgList.map((item: any, index: number) => {
              return <View className={`court-box ${checkedCourtIndex === index ? "checked-box" : ''}`} onClick={() => { this.onCheckedCourt(item, index) }}>
                <Image style="width:100%;height:100%" className={`${item.status === 'reserved' ? 'img-reserved' : ''}`} src={item.url} />
                <Text className="court-index">{index + 1}</Text>
                {item.status === "reserved" ? <Text className="reserved-text">已预定</Text> : ''}
              </View>
            }
            )}
          </View>
          <View className="button-wapper">
            <AtButton className="cancel-button" onClick={this.onBackToList}>取消</AtButton>
            <AtButton className="comfirm-button">确定</AtButton>
          </View>
        </View>
      }

    </View>
  }
}