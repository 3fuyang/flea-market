import { describe, it, expect } from 'vitest'
import { Collect } from '@/types/collect'

const collect = new Collect()

let counter = 1

const test = (uid: string, gid: string, clctd: boolean, expc: string | boolean) => {
  return it(`cl_${counter++}`, () => {
    collect.set(uid, gid, clctd)
    expect(collect.collect()).toBe(expc)
    expect(collect).toMatchSnapshot()
  })
}

describe('collect', () => {
  test('', '1', true, '请先登录')
  test('', '1', false, '请先登录')
  test('', '', true, '请先登录')
  test('', '', false, '请先登录')
  test('0001', '1', true, '管理员请登录普通账号进行收藏')
  test('0001', '1', false, '管理员请登录普通账号进行收藏')
  test('0001', '', true, '管理员请登录普通账号进行收藏')
  test('0001', '', false, '管理员请登录普通账号进行收藏')
  test('1234567', '1', true, '不能重复收藏')
  test('1234567', '1', false, true)
  test('1234567', '', true, '商品不存在')
  test('1234567', '', false, '商品不存在')
})