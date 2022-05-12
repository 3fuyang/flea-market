import { describe, it, expect } from 'vitest'
import { Confirm } from '@/types/confirm'

const confirm = new Confirm()

let counter = 1

const test = (stat: '待付款' | '待确认' | '待评价' | '已完成', expc: string | boolean) => {
  return it(`cf_${counter++}`, () => {
    confirm.set(stat)
    expect(confirm.confirm()).toBe(expc)
    expect(confirm).toMatchSnapshot()
  })
}

describe('confirm', () => {
  test('待付款', '请先付款')
  test('待确认', true)
  test('待评价', '不可重复确认')
})