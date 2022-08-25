import React, { Component, useEffect } from "react"
import Taro, { Config } from '@tarojs/taro'
import { View, Text, Picker, Image, Button } from '@tarojs/components'
import PosterBar from "../../components/posterBar"
import { AtList, AtListItem, AtButton, AtModal, AtModalHeader, AtModalContent, AtToast, AtMessage, AtActivityIndicator } from 'taro-ui'
import { getDateTime, getWeekTime, getDateFormat } from "../../utils/time"
import "./index.scss"
import { request } from "../../utils/request"
import { ReserveProps, TimeItemState, ReserveState, CourtItem } from "./type/index"


export default class ReservePage extends Component<ReserveProps, ReserveState> {
  constructor(props) {
    super(props)
    const dateList = [0, 1, 2, 3, 4, 5, 6].map(item => {
      let date = new Date();
      date.setTime(date.getTime() + item * 24 * 3600 * 1000)
      return {
        label: getDateTime(date) + " " + getWeekTime(date.getTime()),
        value: getDateFormat(date)
      }
    })

    this.state = {
      reserveDate: dateList[0] || null,
      reserveDateValue: 0,
      reserveDateList: dateList,
      reserveTimeList: [],
      reserveTimeValueList: [
        {
          label: '08:00-10:00',
          value: ["08:00", "10:00"],
        },
        {
          label: '10:00-12:00',
          value: ["10:00", "12:00"],
        },
        {
          label: '12:30-14:30',
          value: ["12:30", "14:30"],
        },
        {
          label: '14:30-16:30',
          value: ["14:30", "16:30"],
        },
        {
          label: '16:30-18:30',
          value: ["16:30", "18:30"],
        },
        {
          label: '18:30-20:30',
          value: ["18:30", "20:30"],
        },
        {
          label: '20:30-22:30',
          value: ["20:30", "22:30"],
        },
      ],
      reserveTimeStatusList: [
        {
          status: "可预订",
          statusColor: "#78DB64"
        },
        {
          status: "不可预订",
          statusColor: "#999"
        },
        {
          status: "已订满",
          statusColor: "#F56C6C"
        },
      ],
      viewType: 'list',
      reserveTime: null,
      halfCourtList: [],
      allCourtList: [],
      // reservedCourtList: [],
      checkedCourt: null,
      checkCourtType: '',
      courtTypeOpened: false,
      payTypeOpened: false,
      loading: false,
      listLoading: false
    }
  }

  onDateChange = (event: any) => {
    this.setState({
      reserveDate: this.state.reserveDateList[event.detail.value],
      reserveDateValue: event.detail.value
    }, () => {
      this.init();
      this.getList();
    })
  }

  onToDetail = (item: any) => {
    this.setState({
      courtTypeOpened: true,
      reserveTime: item,
    })
  }

  init() {
    this.setState({
      viewType: 'list',
      reserveTime: null,
      checkedCourt: null,
      checkCourtType: '',
      courtTypeOpened: false,
      payTypeOpened: false,
      loading: false,
      listLoading: false
    })
  }

  /**
   * 取消选择篮球场
   */
  onBackToList = () => {
    this.getList()
    this.init()
  }

  onCheckedCourt = (item: any) => {
    const { checkCourtType, reserveTime } = this.state;
    if ((checkCourtType === 'halfCourt' && reserveTime?.courtNumberList.includes(item.courtNumber)) || (checkCourtType === 'allCourt' && reserveTime?.courtNumberList.some(court => court === item.courtNumber * 2 || court === item.courtNumber * 2 - 1))) return;
    const { checkedCourt } = this.state;
    if (checkedCourt !== item.courtNumber) {
      this.setState({
        checkedCourt: item.courtNumber
      })
    }
  }

  changeCourtType(type: string) {
    this.setState({
      viewType: 'detail',
      checkCourtType: type,
      courtTypeOpened: false
    })
  }

  openPayTypeModal() {
    this.setState({
      payTypeOpened: true
    })
  }

  // 确认订场函数
  async orderComfirm(payType: string) {
    try {
      this.setState({
        payTypeOpened: false
      })
      const phone = wx.getStorageSync('phone');
      const vipLevel = wx.getStorageSync('vipLevel')
      const { reserveDate, reserveTime, checkCourtType, checkedCourt } = this.state
      if (reserveDate === null || reserveTime === null || !checkCourtType || checkedCourt === null || !phone) {
        Taro.atMessage({
          'message': '订场失败，请联系客服',
          'type': 'error',
        })
        console.log("信息缺失:", reserveDate, reserveTime, checkCourtType, checkedCourt, phone)
        return;
      }
      this.setState({
        loading: true,
      })
      let courtNumber: number[] = [];
      if (checkCourtType === 'halfCourt') {
        courtNumber = [checkedCourt];
      } else {
        courtNumber = checkedCourt === 1 ? [1, 2] : [3, 4]
      }
      let overTime = new Date(`${reserveDate.value} ${reserveTime.value[1]}`)
      const data = {
        type: checkCourtType,
        date: reserveDate.value,
        overTime: overTime.getTime(),
        phone,
        courtNumber,
        courtTime: reserveTime.label,
        payType,
        orderStatus: 0
      }
      if (payType === 'online') {
        const orderInfo = `${reserveDate.value} ${reserveTime.label} 球场订单`
        const payResponse: any = await request('pay', {
          type: checkCourtType,
          vipLevel,
          body: orderInfo
        })
        if (payResponse.result.resultCode === 'SUCCESS') {
          const _this = this;
          wx.requestPayment({
            ...payResponse.result.payment,
            success() {
              _this.addOrder({ ...data, orderNumber: payResponse.result.orderNumber })
            },
            fail() {
              _this.setState({
                loading: false
              })
            }
          })
        } else {
          Taro.atMessage({
            'message': '支付失败，请联系客服',
            'type': 'error',
          })
        }
      } else {
        this.addOrder(data)
      }


    } catch (error) {
      console.error("订场报错：", error)
      this.setState({
        loading: false
      })
    }
  }
  async addOrder(data: any) {
    try {
      const { payType, orderNumber } = data
      if (payType === 'online' && !orderNumber) {
        this.setState({
          loading: false
        })
        Taro.atMessage(
          {
            'message': '生成订单失败，请联系客服',
            'type': 'error',
          }
        )
        return;
      }
      const orderResponse: any = await request('add_order', data);
      if (orderResponse.errMsg !== "cloud.callFunction:ok" || !orderResponse.result.success) {
        this.setState({
          loading: false
        })
        let errorMessage = `订场失败，${orderResponse.result.message}`;
        if (payType === 'online') {
          const refundResponse: any = await request('refund', {
            payNumber: orderNumber
          })
          if (refundResponse.errMsg !== "cloud.callFunction:ok" || refundResponse.result.resultCode === "FAIL") {
            Taro.atMessage({
              'message': "退款失败，请联系客服",
              'type': 'error'
            })
            return;
          }
          errorMessage += "，订场金额将原路退回"
        }
        Taro.atMessage({
          'message': errorMessage,
          'type': 'error',
        })
      } else {
        Taro.atMessage({
          'message': "订场成功！",
          'type': 'success',
        })
        this.onBackToList()
      }
      this.setState({
        loading: false
      })
    } catch (error) {
      console.error("订场报错：", error)
      this.setState({
        loading: false
      })
    }
  }

  async getList() {
    try {
      const { reserveDate, reserveTimeValueList, reserveTimeStatusList } = this.state
      if (reserveDate === null) {
        Taro.atMessage({
          "type": 'error',
          "message": '日期不能为空'
        })
        return;
      }
      this.setState(
        {
          listLoading: true
        }
      )
      const response: any = await request("get_order", {
        type: 'courtDetail',
        date: reserveDate.value
      })
      if (response.errMsg !== "cloud.callFunction:ok") {
        console.error("获取列表报错！")
        return;
      }
      const { reservationInfo, courtInfo } = response.result;
      let courtCount = response.result.courtInfo.filter(item => item.courtType === "halfCourt").length;
      const list = reserveTimeValueList.map(item => {
        const targetReservation = reservationInfo.find(court => court.courtTime === item.label)
        const currentTime = new Date().getTime();
        const courtTime = new Date(`${reserveDate.value} ${item.value[1]}`.replace(/-/g, '/')).getTime();
        let status = targetReservation.courtNumberList.length === courtCount ? '已订满' : '可预订';
        status = currentTime > courtTime ? '不可预订' : status;
        const statusItem = reserveTimeStatusList.find(timeStatus => timeStatus.status === status)
        const newItem: TimeItemState = {
          label: item.label,
          value: item.value,
          status,
          statusColor: statusItem?.statusColor || "",
          courtNumberList: targetReservation.courtNumberList
        }
        return newItem
      })
      const halfCourtList = courtInfo.filter((court: CourtItem) => court.courtType === "halfCourt")
      const allCourtList = courtInfo.filter((court: CourtItem) => court.courtType === "allCourt")
      this.setState(
        {
          listLoading: false,
          reserveTimeList: list,
          halfCourtList,
          allCourtList
        }
      )
    } catch (error) {
      console.error("获取列表失败：", error)
    }
  }

  payModalClose() {
    this.setState({
      payTypeOpened: false
    })
  }

  imageLoaded() {
    console.log(111)
  }

  componentDidMount() {
    this.getList()
  }

  render() {
    const { viewType, reserveDateList, reserveDate, reserveDateValue, reserveTimeList, reserveTime, halfCourtList, checkedCourt, checkCourtType, courtTypeOpened, allCourtList, payTypeOpened, loading, listLoading } = this.state;
    return <View className="reserve-page">
      <AtMessage />
      <AtToast className="toast" isOpened={loading} status="loading" duration={0} hasMask={true}></AtToast>
      <PosterBar />
      {viewType === "list" ?
        <View className="list-view">
          <Picker mode='selector' range={reserveDateList.map(item => item.label)} value={reserveDateValue} onChange={this.onDateChange}>
            <AtList>
              <AtListItem title={reserveDate ? reserveDate.label : ''} extraText='点击选择' />
            </AtList>
          </Picker>
          <View className="reserve-table">
            <Text className="reserve-table-title">预约时间段</Text>
            <AtActivityIndicator isOpened={listLoading} mode='center' content='加载中...'></AtActivityIndicator>
            {
              !listLoading && reserveTimeList.map(item => {
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
              <Text>已预订</Text>
            </View>
            <View className="tag-wapper">
              <Text className="tag-color" style="border-color:#fff"></Text>
              <Text>可预订</Text>
            </View>
          </View>
          <View className={["court-wapper", checkCourtType === "halfCourt" ? "halfCourt-wapper" : ""].join(" ")} >
            {(checkCourtType === 'halfCourt' ? halfCourtList : allCourtList).map((item: any) => {
              return <View className={`court-box ${checkedCourt === item.courtNumber ? "checked-box" : ''}`} onClick={() => { this.onCheckedCourt(item) }}>
                <Image style="width:100%;height:100%" className={`${(checkCourtType === 'halfCourt' && reserveTime?.courtNumberList.includes(item.courtNumber)) || (checkCourtType === 'allCourt' && reserveTime?.courtNumberList.some(court => court === item.courtNumber * 2 || court === item.courtNumber * 2 - 1)) ? 'img-reserved' : ''}`} src={item.courtUrl} onLoad={this.imageLoaded.bind(this)} />
                <Text className="court-index">{item.courtNumber}</Text>
                {(checkCourtType === 'halfCourt' && reserveTime?.courtNumberList.includes(item.courtNumber)) || (checkCourtType === 'allCourt' && reserveTime?.courtNumberList.some(court => court === item.courtNumber * 2 || court === item.courtNumber * 2 - 1)) ? <Text className="reserved-text">已预订</Text> : ''}
              </View>
            }
            )}
          </View>
          <View className="button-wapper">
            <AtButton className="cancel-button" onClick={this.onBackToList}>取消</AtButton>
            <AtButton className="comfirm-button" onClick={this.openPayTypeModal.bind(this)}>确定</AtButton>
          </View>
        </View>
      }
      <AtModal isOpened={courtTypeOpened}>
        <AtModalHeader>选择场地类型</AtModalHeader>
        <AtModalContent>
          <AtButton size="small" onClick={this.changeCourtType.bind(this, 'halfCourt')}>半场</AtButton>
          <AtButton size="small" onClick={this.changeCourtType.bind(this, 'allCourt')}>全场</AtButton>
        </AtModalContent>
      </AtModal>
      <AtModal isOpened={payTypeOpened} onClose={this.payModalClose.bind(this)}>
        <AtModalHeader>选择场地类型</AtModalHeader>
        <AtModalContent>
          <AtButton size="small" onClick={this.orderComfirm.bind(this, 'online')}>在线支付</AtButton>
          <AtButton className="offline-pay" size="small" onClick={this.orderComfirm.bind(this, 'offline')}>余额支付</AtButton>
        </AtModalContent>
      </AtModal>
    </View >
  }
}