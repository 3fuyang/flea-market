// 测试用，类型建模
export class LoginForm {
  // 类型
  type: 'member' | 'admin' = 'member'
  // 用户名
  userID: string = ''
  // 密码
  password: string = ''
  // 登录
  login () {
    if (!this.userID) {
      return '请输入账号'
    } else if (this.type === 'member' && this.userID.length !== 7) {
      return '普通用户账号应长7位'
    } else if (this.type === 'admin' && this.userID.length !== 4) {
      return '管理员账号应长4位'
    } else if (!this.password) {
      return '请输入密码'
    } else {
      // 登录
      return true
    }
  }
  // setter
  set (tp: 'member' | 'admin' = 'member', id: string = '', pwd: string = '') {
    this.type = tp
    this.userID = id
    this.password = pwd
  }
}