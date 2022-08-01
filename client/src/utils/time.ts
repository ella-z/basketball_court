/**
 * 将时间戳转换成为时间格式（YYYY年MM月DD日）
 * @param val 
 */
export function getDateTime(val: string | Date): string {
  let time = new Date(val);
  let year = time.getFullYear();
  let month =
    time.getMonth() + 1 < 10
      ? "0" + (time.getMonth() + 1)
      : time.getMonth() + 1;
  let date = time.getDate() < 10 ? "0" + time.getDate() : time.getDate();
  return `${year}年${month}月${date}日`;
}

/**
 * 将日期转化为YYYY-MM-DD时间格式
 * @param val 
 */
export function getDateFormat(val: Date): string {
  let time = new Date(val);
  let year = time.getFullYear();
  let month =
    time.getMonth() + 1 < 10
      ? "0" + (time.getMonth() + 1)
      : time.getMonth() + 1;
  let day = time.getDate() < 10 ? "0" + time.getDate() : time.getDate();
  return [year, month, day].join('-');
}

/**
 * 获取时间戳对应的星期
 * @param time 
 */
export function getWeekTime(time: number): string {
  const weekList = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  let date = new Date(time);
  return weekList[date.getDay()];
}