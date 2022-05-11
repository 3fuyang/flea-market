import { describe, expect, it } from 'vitest'
import { LoginForm } from '@/types/login'

const loginForm = new LoginForm()

// describe creates a suite
describe('login', () => {
  // it is an alias of test
  it('li_1', () => {
    loginForm.set('member', '123', '')
    expect(loginForm.login()).toBe('普通用户账号应长7位')
    expect(loginForm).toMatchSnapshot()
  })

  it('li_2', () => {
    loginForm.set('member', '1234', '')
    expect(loginForm.login()).toBe('普通用户账号应长7位')
    expect(loginForm).toMatchSnapshot()    
  })

  it('li_3', () => {
    loginForm.set('member', '12345', '')
    expect(loginForm.login()).toBe('普通用户账号应长7位')
    expect(loginForm).toMatchSnapshot()
  })  

  it('li_4', () => {
    loginForm.set('member', '1234567', '')
    expect(loginForm.login()).toBe('请输入密码')
    expect(loginForm).toMatchSnapshot()
  })
  
  it('li_5', () => {
    loginForm.set('member', '12345678', '')
    expect(loginForm.login()).toBe('普通用户账号应长7位')
    expect(loginForm).toMatchSnapshot()
  }) 
  
  it('li_6', () => {
    loginForm.set('' as 'admin', '', '')
    expect(loginForm.login()).toBe('请输入账号')
    expect(loginForm).toMatchSnapshot()
  })  

  it('li_7', () => {
    loginForm.set('member', '123', 'qwe')
    expect(loginForm.login()).toBe('普通用户账号应长7位')
    expect(loginForm).toMatchSnapshot()
  })

  it('li_8', () => {
    loginForm.set('member', '1234', 'qwe')
    expect(loginForm.login()).toBe('普通用户账号应长7位')
    expect(loginForm).toMatchSnapshot()
  })

  it('li_9', () => {
    loginForm.set('member', '12345', 'qwe')
    expect(loginForm.login()).toBe('普通用户账号应长7位')
    expect(loginForm).toMatchSnapshot()
  })

  it('li_10', () => {
    loginForm.set('member', '1234567', 'qwe')
    expect(loginForm.login()).toBeTruthy()
    expect(loginForm).toMatchSnapshot()
  })

  it('li_11', () => {
    loginForm.set('member', '12345678', 'qwe')
    expect(loginForm.login()).toBe('普通用户账号应长7位')
    expect(loginForm).toMatchSnapshot()
  })

  it('li_12', () => {
    loginForm.set('admin', '123', '')
    expect(loginForm.login()).toBe('管理员账号应长4位')
    expect(loginForm).toMatchSnapshot()
  })

  it('li_13', () => {
    loginForm.set('admin', '1234', '')
    expect(loginForm.login()).toBe('请输入密码')
    expect(loginForm).toMatchSnapshot()
  })

  it('li_14', () => {
    loginForm.set('admin', '12345', '')
    expect(loginForm.login()).toBe('管理员账号应长4位')
    expect(loginForm).toMatchSnapshot()
  })  

  it('li_15', () => {
    loginForm.set('admin', '1234567', '')
    expect(loginForm.login()).toBe('管理员账号应长4位')
    expect(loginForm).toMatchSnapshot()
  })
  
  it('li_16', () => {
    loginForm.set('admin', '12345678', '')
    expect(loginForm.login()).toBe('管理员账号应长4位')
    expect(loginForm).toMatchSnapshot()
  }) 
  
  it('li_17', () => {
    loginForm.set('' as 'admin', '', '')
    expect(loginForm.login()).toBe('请输入账号')
    expect(loginForm).toMatchSnapshot()
  })  

  it('li_18', () => {
    loginForm.set('admin', '123', 'qwe')
    expect(loginForm.login()).toBe('管理员账号应长4位')
    expect(loginForm).toMatchSnapshot()
  })

  it('li_19', () => {
    loginForm.set('admin', '1234', 'qwe')
    expect(loginForm.login()).toBeTruthy()
    expect(loginForm).toMatchSnapshot()
  })

  it('li_20', () => {
    loginForm.set('admin', '12345', 'qwe')
    expect(loginForm.login()).toBe('管理员账号应长4位')
    expect(loginForm).toMatchSnapshot()
  })

  it('li_21', () => {
    loginForm.set('admin', '1234567', 'qwe')
    expect(loginForm.login()).toBe('管理员账号应长4位')
    expect(loginForm).toMatchSnapshot()
  })

  it('li_22', () => {
    loginForm.set('admin', '12345678', 'qwe')
    expect(loginForm.login()).toBe('管理员账号应长4位')
    expect(loginForm).toMatchSnapshot()
  })
})