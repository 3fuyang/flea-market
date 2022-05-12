import { describe, it, expect } from "vitest"
import { DealReport } from "@/types/deal-report"

let counter = 1

const dealer = new DealReport()

const test = (rptd: '待处理' | '已封禁' | '已驳回', rpl: string, expc: string | boolean) => {
  return it(`cl_${counter++}`, () => {
    dealer.set(rptd, rpl)
    expect(dealer.dealReport('已封禁')).toBe(expc)
    expect(dealer).toMatchSnapshot()
  })
}

describe('report', () => {
  test('待处理', 'Something', true)
  test('待处理', '', '请输入回复')
  test('已驳回', 'Something', '不可重复处理举报')
  test('已驳回', '', '不可重复处理举报')
})