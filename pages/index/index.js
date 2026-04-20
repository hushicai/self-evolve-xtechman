// pages/index/index.js - 首页（日历页面）
Page({
  data: {
    currentYear: 2026,
    currentMonth: 4,
    selectedDate: '',
    formattedSelectedDate: '',
    events: [],
    showEventList: false,
    selectedDateEvents: []
  },

  onLoad() {
    const today = new Date()
    const selectedDate = this.formatDate(today)
    this.setData({
      currentYear: today.getFullYear(),
      currentMonth: today.getMonth() + 1,
      selectedDate,
      formattedSelectedDate: this.formatDateWithWeek(selectedDate)
    })
    this.loadEvents()
  },

  loadEvents() {
    const events = wx.getStorageSync('calendar_events') || []
    this.setData({ events })
  },

  formatDate(date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  },

  // 格式化日期显示（带星期）
  formatDateWithWeek(dateStr) {
    const date = new Date(dateStr)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    const weekDay = weekDays[date.getDay()]
    return `${year}年${month}月${day}日 ${weekDay}`
  },

  onDateSelect(e) {
    const { date } = e.detail
    // 跳转到运势详情页
    wx.navigateTo({
      url: `/pages/fortune-detail/fortune-detail?date=${date}`
    })
  },

  onMonthChange(e) {
    const { year, month } = e.detail
    this.setData({
      currentYear: year,
      currentMonth: month
    })
  },

  onCloseEventList() {
    this.setData({ showEventList: false })
  },

  onAddEvent() {
    wx.navigateTo({
      url: `/pages/event-edit/event-edit?date=${this.data.selectedDate}`
    })
  },

  onEditEvent(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/event-edit/event-edit?id=${id}&date=${this.data.selectedDate}`
    })
  },

  onDeleteEvent(e) {
    const { id } = e.currentTarget.dataset
    
    // 直接删除（滑动删除已提供确认）
    const events = this.data.events.filter(event => event.id !== id)
    wx.setStorageSync('calendar_events', events)
    
    this.setData({ events })
    
    // 更新当前显示的事件列表
    const dayEvents = events.filter(event => event.date === this.data.selectedDate)
    this.setData({ selectedDateEvents: dayEvents })
    
    wx.showToast({ title: '已删除', icon: 'success' })
  },

  // 面板拖拽相关
  panelStartY: 0,
  panelStartTranslateY: 0,

  onPanelTouchStart(e) {
    this.panelStartY = e.touches[0].clientY
    this.panelStartTranslateY = 0
  },

  onPanelTouchMove(e) {
    const deltaY = e.touches[0].clientY - this.panelStartY
    // 只允许向下拖拽
    if (deltaY > 0) {
      // 拖拽超过 100px 就关闭
      if (deltaY > 100) {
        this.setData({ showEventList: false })
      }
    }
  },

  onPanelTouchEnd(e) {
    // 拖拽结束，保持原位
  },

  // 事件项滑动删除相关
  itemStartX: 0,
  swipedItemId: null,

  onItemTouchStart(e) {
    this.itemStartX = e.touches[0].clientX
    const { id } = e.currentTarget.dataset
    
    // 如果有其他已滑开的项，先关闭
    if (this.swipedItemId && this.swipedItemId !== id) {
      this.closeSwipedItem()
    }
  },

  onItemTouchMove(e) {
    const deltaX = e.touches[0].clientX - this.itemStartX
    const { id } = e.currentTarget.dataset
    
    // 左滑超过 60px 显示删除按钮
    if (deltaX < -60) {
      this.swipedItemId = id
      const events = this.data.selectedDateEvents.map(item => {
        if (item.id === id) {
          return { ...item, swiped: true }
        }
        return { ...item, swiped: false }
      })
      this.setData({ selectedDateEvents: events })
    }
  },

  onItemTouchEnd(e) {
    // 滑动结束
  },

  closeSwipedItem() {
    const events = this.data.selectedDateEvents.map(item => {
      return { ...item, swiped: false }
    })
    this.setData({ selectedDateEvents: events })
    this.swipedItemId = null
  },

  onShareAppMessage() {
    return {
      title: '简洁日历',
      path: '/pages/index/index'
    }
  }
})