export class DealReport {
  adminID: string = '0001'
  orderID: string = '1'
  reported: '待处理' | '已封禁' | '已驳回' = '待处理'
  reply: string = ''
  dealReport (stat: '待处理' | '已封禁' | '已驳回') {
    if (this.reported !== '待处理') {
      return '不可重复处理举报'
    } else if (!this.reply) {
      return '请输入回复'
    } else {
      this.reported = stat
      return true
    }
  }
  set (rptd: '待处理' | '已封禁' | '已驳回', rpl: string) {
    this.reported = rptd
    this.reply = rpl
  }
}