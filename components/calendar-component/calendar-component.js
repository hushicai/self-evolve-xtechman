// components/calendar-component/calendar-component.js
// 日历组件 - cc-ui 简洁风格

const dateUtil = require('../../utils/dateUtil')

Component({
  properties: {
    year: {
      type: Number,
      value: new Date().getFullYear()
    },
    month: {
      type: Number,
      value: new Date().getMonth() + 1
    },
    selectedDate: {
      type: String,
      value: ''
    },
    events: {
      type: Array,
      value: []
    }
  },

  data: {
    weekDays: ['日', '一', '二', '三', '四', '五', '六'],
    calendarGrid: [],
    monthNames: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    touchStartX: 0,
    pickerRange: [
      ['2024', '2025', '2026', '2027', '2028', '2029', '2030'],
      ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
    ],
    pickerValue: [2, 3]
  },

  observers: {
    'year, month, events': function(year, month, events) {
      this.generateCalendar(year, month, events)
    }
  },

  lifetimes: {
    attached() {
      const today = new Date()
      const currentYear = String(today.getFullYear())
      const currentMonth = today.getMonth() + 1
      
      const yearIndex = this.data.pickerRange[0].indexOf(currentYear)
      const monthIndex = currentMonth - 1
      
      this.setData({ pickerValue: [yearIndex, monthIndex] })
      this.generateCalendar(this.data.year, this.data.month, this.data.events)
    }
  },

  methods: {
    generateCalendar(year, month, events) {
      const grid = dateUtil.generateCalendarGrid(year, month)
      
      const eventsMap = {}
      events.forEach(event => {
        eventsMap[event.date] = event
      })

      grid.forEach(cell => {
        if (cell.isCurrentMonth && cell.date) {
          cell.hasEvent = !!eventsMap[cell.date]
          cell.eventColor = eventsMap[cell.date]?.color || '#5677fc'
        }
      })

      this.setData({ calendarGrid: grid })
    },

    onDateTap(e) {
      const { date } = e.currentTarget.dataset
      if (!date) return
      this.setData({ selectedDate: date })
      this.triggerEvent('dateselect', { date })
    },

    onPrevMonth() {
      const { year, month } = dateUtil.getPrevMonth(this.data.year, this.data.month)
      this.setData({ year, month })
      this.triggerEvent('monthchange', { year, month })
    },

    onNextMonth() {
      const { year, month } = dateUtil.getNextMonth(this.data.year, this.data.month)
      this.setData({ year, month })
      this.triggerEvent('monthchange', { year, month })
    },

    onToday() {
      const today = new Date()
      const year = today.getFullYear()
      const month = today.getMonth() + 1
      const date = dateUtil.formatDateStr(year, month, today.getDate())

      const yearIndex = this.data.pickerRange[0].indexOf(String(year))
      const monthIndex = month - 1

      this.setData({ 
        year, 
        month, 
        selectedDate: date,
        pickerValue: [yearIndex, monthIndex]
      })
      
      this.triggerEvent('monthchange', { year, month })
      this.triggerEvent('dateselect', { date })
    },

    onPickerChange(e) {
      const value = e.detail.value
      const year = parseInt(this.data.pickerRange[0][value[0]])
      const month = value[1] + 1
      
      this.setData({ year, month, pickerValue: value })
      this.triggerEvent('monthchange', { year, month })
    },

    onTouchStart(e) {
      this.setData({ touchStartX: e.touches[0].clientX })
    },

    onTouchEnd(e) {
      const deltaX = e.changedTouches[0].clientX - this.data.touchStartX
      if (Math.abs(deltaX) > 50) {
        deltaX > 0 ? this.onPrevMonth() : this.onNextMonth()
      }
    }
  }
})