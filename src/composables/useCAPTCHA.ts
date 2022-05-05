/* 发送验证码函数
    参数列表:
    phone:电话号码,string
    type:验证码类型,int,1——注册、2——修改密码、3——换绑手机号
    返回值:
    一个字符串，若手机格式错误返回'Wrong phone number'，若成功发送返回6位验证码，若发送错误返回'error'
*/
import axios from 'axios'

async function sendCode (phone: string, type: number) {
  //检验手机号码格式
  if (!(/^1[3456789]\d{9}$/.test(phone))) {
      return 'Wrong phone number'
  }

  // 生成六位数字验证码
  const codeLength = 6
  let phoneCode = ''
  for (let i = 0; i < codeLength; ++i) {
      let index = Math.floor(Math.random() * (9))
      phoneCode += index.toString()
  }

  const note = ["绑定注册手机号", "修改密码", "更换绑定手机号"]
  // 发送验证码短信给用户
  const text = `验证码 ${phoneCode}\n您正在${note[type]}，该验证码仅用于身份验证，五分钟之内有效，请勿泄露给其他人使用。`
  const param = new URLSearchParams()
  param.append('Uid', 'Richy_D')
  param.append('Key', 'd41d8cd98f00b204e980')
  param.append('smsMob', phone)
  param.append('smsText', text)
  
  //这里要改成封装好的post请求函数，然后需要配置一下跨域
  const response = await axios.post('/captcha', param, 
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      }
    }
  )

  if (response.status === 200) {
    return phoneCode
  } else {
    return 'error'
  }
}

// 添加别名，进行导出
export { sendCode as useCAPTCHA }