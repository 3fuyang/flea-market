import { describe, expect, it } from 'vitest'
import { LoginForm } from '@/types/login'

let counter = 1

const loginForm = new LoginForm()

const test = (tp: 'member' | 'admin', uid: string, pwd: string, epec: string | boolean) => {
  return it(`li_${counter++}`, () => {
    loginForm.set(tp, uid, pwd)
    expect(loginForm.login()).toBe(epec)
    expect(loginForm).toMatchSnapshot()
  })
}

// describe creates a suite
describe('login', () => {
  test('member', '123', '', '普通用户账号应长7位')
  test('member', '1234', '', '普通用户账号应长7位')
  test('member', '12345', '', '普通用户账号应长7位')
  test('member', '1234567', '', '请输入密码')
  test('member', '12345678', '', '普通用户账号应长7位')
  test('' as 'admin', '', '', '请输入账号')
  test('member', '123', 'qwe', '普通用户账号应长7位')
  test('member', '1234', 'qwe', '普通用户账号应长7位')
  test('member', '12345', 'qwe', '普通用户账号应长7位')
  test('member', '1234567', 'qwe', true)
  test('member', '12345678', 'qwe', '普通用户账号应长7位')
  test('admin', '123', '', '管理员账号应长4位')
  test('admin', '1234', '', '请输入密码')
  test('admin', '12345', '', '管理员账号应长4位')
  test('admin', '1234567', '', '管理员账号应长4位')
  test('admin', '12345678', '', '管理员账号应长4位')
  test('' as 'admin', '', '', '请输入账号')
  test('admin', '123', 'qwe', '管理员账号应长4位')
  test('admin', '1234', 'qwe', true)
  test('admin', '12345', 'qwe', '管理员账号应长4位')
  test('admin', '1234567', 'qwe', '管理员账号应长4位')
  test('admin', '12345678', 'qwe', '管理员账号应长4位')
})