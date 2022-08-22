export type ReserveProps = {
}

export type DateItemState = {
  label: string;
  value: string;
}

export type TimeItemState = {
  label: string,
  value: string[],
  status: string,
  statusColor: string,
  courtNumberList: number[]
}

export interface ReserveTimeStatus {
  status: string,
  statusColor: string
}

export interface ReserveTimeValue {
  label: string,
  value: string[]
}

export interface CourtItem {
  courtUrl: string,
  courtType: string,
  courtNumber: number
}

export type ReserveState = {
  reserveDate: DateItemState | null,
  reserveDateValue: number,
  reserveDateList: DateItemState[],
  reserveTimeList: TimeItemState[],
  viewType: 'list' | 'detail',
  reserveTime: TimeItemState | null,
  halfCourtList: CourtItem[],
  allCourtList: CourtItem[],
  checkedCourt: number | null,
  checkCourtType: string,
  courtTypeOpened: boolean,
  payTypeOpened: boolean,
  loading: boolean,
  listLoading: boolean,
  reserveTimeStatusList: ReserveTimeStatus[]
  reserveTimeValueList: ReserveTimeValue[]
}