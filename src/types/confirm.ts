export class Confirm {
  orderID: string = '1'
  stat: '待付款' | '待确认' | '待评价' | '已完成' = '待确认'
  confirm () {
    switch (this.stat) {
      case '待付款':
        return '请先付款'
      case '待确认':
        return true
      default:
        return '不可重复确认'
    }
  }
  set (st: '待付款' | '待确认' | '待评价' | '已完成' = '待确认') {
    this.stat = st
  }
}