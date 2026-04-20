// test/lunarUtil.test.js - 农历工具函数测试

const { getLunarDate, formatLunarDay } = require('../utils/lunarUtil')

describe('lunarUtil', () => {
  describe('getLunarDate', () => {
    test('应正确转换公历日期为农历', () => {
      // 2026-04-20 是农历三月初四
      const lunar = getLunarDate(2026, 4, 20)
      expect(lunar).toBeDefined()
      expect(lunar.getMonth()).toBe(3)
      expect(lunar.getDay()).toBe(4)
    })

    test('应正确处理闰月', () => {
      // 2023年有闰二月，2023-03-22 是闰二月初一
      // lunar-javascript 用负数表示闰月，-2表示闰二月
      const lunar = getLunarDate(2023, 3, 22)
      expect(lunar).toBeDefined()
      expect(lunar.getMonth()).toBe(-2) // -2 表示闰二月
    })

    test('应处理边界日期', () => {
      // 测试年初和年末
      const lunar1 = getLunarDate(2026, 1, 1)
      expect(lunar1).toBeDefined()
      
      const lunar2 = getLunarDate(2026, 12, 31)
      expect(lunar2).toBeDefined()
    })
  })

  describe('formatLunarDay', () => {
    test('应正确格式化农历日', () => {
      // 初一
      expect(formatLunarDay(1)).toBe('初一')
      // 初十
      expect(formatLunarDay(10)).toBe('初十')
      // 十五
      expect(formatLunarDay(15)).toBe('十五')
      // 廿三
      expect(formatLunarDay(23)).toBe('廿三')
      // 三十
      expect(formatLunarDay(30)).toBe('三十')
    })

    test('应处理异常值', () => {
      // 小于1的值
      expect(formatLunarDay(0)).toBe('')
      // 大于30的值
      expect(formatLunarDay(31)).toBe('')
    })
  })
})