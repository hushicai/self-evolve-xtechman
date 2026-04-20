// test/dateUtil.test.js - 日期工具函数测试

const dateUtil = require('../utils/dateUtil')

describe('dateUtil', () => {
  describe('getDaysInMonth', () => {
    test('2026年4月有30天', () => {
      expect(dateUtil.getDaysInMonth(2026, 4)).toBe(30)
    })
    
    test('2026年2月有28天（非闰年）', () => {
      expect(dateUtil.getDaysInMonth(2026, 2)).toBe(28)
    })
    
    test('2024年2月有29天（闰年）', () => {
      expect(dateUtil.getDaysInMonth(2024, 2)).toBe(29)
    })
    
    test('2026年12月有31天', () => {
      expect(dateUtil.getDaysInMonth(2026, 12)).toBe(31)
    })
  })

  describe('getFirstDayOfMonth', () => {
    test('2026年4月1日是周三（返回3）', () => {
      expect(dateUtil.getFirstDayOfMonth(2026, 4)).toBe(3)
    })
    
    test('2026年1月1日是周四（返回4）', () => {
      expect(dateUtil.getFirstDayOfMonth(2026, 1)).toBe(4)
    })
  })

  describe('formatDateStr', () => {
    test('格式化 2026年4月20日', () => {
      expect(dateUtil.formatDateStr(2026, 4, 20)).toBe('2026-04-20')
    })
    
    test('格式化 2026年1月1日（补零）', () => {
      expect(dateUtil.formatDateStr(2026, 1, 1)).toBe('2026-01-01')
    })
  })

  describe('generateCalendarGrid', () => {
    test('2026年4月网格有42个格子', () => {
      const grid = dateUtil.generateCalendarGrid(2026, 4)
      expect(grid.length).toBe(42)
    })
    
    test('2026年4月网格前有3个空格子（周三开始）', () => {
      const grid = dateUtil.generateCalendarGrid(2026, 4)
      const emptyBefore = grid.filter(c => !c.isCurrentMonth && c.day === '').slice(0, 3)
      expect(emptyBefore.length).toBe(3)
    })
    
    test('2026年4月网格包含30个当月日期', () => {
      const grid = dateUtil.generateCalendarGrid(2026, 4)
      const currentMonth = grid.filter(c => c.isCurrentMonth)
      expect(currentMonth.length).toBe(30)
    })
  })

  describe('getPrevMonth', () => {
    test('4月的前一月是3月', () => {
      expect(dateUtil.getPrevMonth(2026, 4)).toEqual({ year: 2026, month: 3 })
    })
    
    test('1月的前一月是去年12月', () => {
      expect(dateUtil.getPrevMonth(2026, 1)).toEqual({ year: 2025, month: 12 })
    })
  })

  describe('getNextMonth', () => {
    test('4月的下一月是5月', () => {
      expect(dateUtil.getNextMonth(2026, 4)).toEqual({ year: 2026, month: 5 })
    })
    
    test('12月的下一月是明年1月', () => {
      expect(dateUtil.getNextMonth(2026, 12)).toEqual({ year: 2027, month: 1 })
    })
  })
})