// pages/index/index.js - 首页（日历页面）
const fortuneUtil = require('../../utils/fortuneUtil')

Page({
  data: {
    currentYear: 2026,
    currentMonth: 4,
    selectedDate: '',
    fortuneData: null
  },

  onLoad() {
    const today = new Date()
    const selectedDate = this.formatDate(today)
    this.setData({
      currentYear: today.getFullYear(),
      currentMonth: today.getMonth() + 1,
      selectedDate,
      fortuneData: fortuneUtil.generateFortuneData(selectedDate)
    })
  },

  formatDate(date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  },

  onDateSelect(e) {
    const { date } = e.detail
    this.setData({
      selectedDate: date,
      fortuneData: fortuneUtil.generateFortuneData(date)
    })
  },

  onMonthChange(e) {
    const { year, month } = e.detail
    this.setData({
      currentYear: year,
      currentMonth: month
    })
  },

  onFortuneTap() {
    wx.navigateTo({
      url: `/pages/fortune-detail/fortune-detail?date=${this.data.selectedDate}`
    })
  },

  onShareAppMessage() {
    return {
      title: '简洁日历',
      path: '/pages/index/index'
    }
  }
})