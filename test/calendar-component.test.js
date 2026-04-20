// test/calendar-component.test.js - 日历组件逻辑测试

const dateUtil = require('../utils/dateUtil')

// 模拟组件逻辑
describe('calendar-component 逻辑', () => {
  describe('月份切换', () => {
    test('上一月逻辑', () => {
      // 模拟组件的 onPrevMonth 逻辑
      const state = { year: 2026, month: 4 }
      const { year, month } = dateUtil.getPrevMonth(state.year, state.month)
      expect(year).toBe(2026)
      expect(month).toBe(3)
    })

    test('下一月逻辑', () => {
      const state = { year: 2026, month: 4 }
      const { year, month } = dateUtil.getNextMonth(state.year, state.month)
      expect(year).toBe(2026)
      expect(month).toBe(5)
    })

    test('1月上一月跨年', () => {
      const { year, month } = dateUtil.getPrevMonth(2026, 1)
      expect(year).toBe(2025)
      expect(month).toBe(12)
    })

    test('12月下一月跨年', () => {
      const { year, month } = dateUtil.getNextMonth(2026, 12)
      expect(year).toBe(2027)
      expect(month).toBe(1)
    })
  })

  describe('日历网格生成', () => {
    test('生成42格子网格', () => {
      const grid = dateUtil.generateCalendarGrid(2026, 4)
      expect(grid.length).toBe(42)
    })

    test('网格包含日期字符串', () => {
      const grid = dateUtil.generateCalendarGrid(2026, 4)
      const day15 = grid.find(c => c.day === 15)
      expect(day15.date).toBe('2026-04-15')
    })

    test('网格正确标记今天', () => {
      const today = new Date()
      const grid = dateUtil.generateCalendarGrid(today.getFullYear(), today.getMonth() + 1)
      const todayCell = grid.find(c => c.isToday)
      expect(todayCell).toBeTruthy()
    })
  })

  describe('事件标记逻辑', () => {
    test('事件映射到网格', () => {
      const grid = dateUtil.generateCalendarGrid(2026, 4)
      const events = [{ date: '2026-04-20', title: '测试', color: '#5677fc' }]
      
      const eventsMap = {}
      events.forEach(e => { eventsMap[e.date] = e })
      
      grid.forEach(cell => {
        if (cell.isCurrentMonth && cell.date) {
          cell.hasEvent = !!eventsMap[cell.date]
          cell.eventColor = eventsMap[cell.date]?.color || '#5677fc'
        }
      })
      
      const eventDay = grid.find(c => c.date === '2026-04-20')
      expect(eventDay.hasEvent).toBe(true)
      expect(eventDay.eventColor).toBe('#5677fc')
    })
  })

  describe('日期选择逻辑', () => {
    test('格式化日期显示', () => {
      const dateStr = '2026-04-20'
      const date = new Date(dateStr)
      const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
      const formatted = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${weekDays[date.getDay()]}`
      expect(formatted).toBe('2026年4月20日 周一')
    })
  })
})