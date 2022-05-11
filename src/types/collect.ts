export class Collect {
  userID: string = ''
  goodID: string = ''
  collected: boolean = false
  collect () {
    if (!this.userID) {
      return '请先登录'
    } else if (this.userID.length === 4) {
      return '管理员请登录普通账号进行收藏'
    } else if (!this.goodID) {
      return '商品不存在'
    } else if (this.collected) {
      return '不能重复收藏'
    } else {
      return true
    }
  }
  set (uid: string = '', gid: string = '', collected: boolean = true) {
    this.userID = uid
    this.goodID = gid
    this.collected = collected
  }
}