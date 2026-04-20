// pages/event-edit/event-edit.js
// 事件编辑页面 - cc-ui 简洁风格

Page({
  data: {
    date: '',
    eventId: '',
    title: '',
    time: '09:00',
    type: 'fortune',
    color: '#9333ea',
    types: [
      { value: 'fortune', label: '运势', color: '#9333ea', icon: '✦' },
      { value: 'zodiac', label: '星座', color: '#0891b2', icon: '☽' },
      { value: 'lucky', label: '幸运', color: '#ea580c', icon: '★' },
      { value: 'anniversary', label: '纪念', color: '#be185d', icon: '♥' }
    ]
  },

  onLoad(options) {
    const { date, id } = options
    
    if (id) {
      this.loadEvent(id)
    } else {
      this.setData({ date })
    }
  },

  loadEvent(id) {
    const events = wx.getStorageSync('calendar_events') || []
    const event = events.find(e => e.id === id)
    
    if (event) {
      this.setData({
        eventId: id,
        date: event.date,
        title: event.title,
        time: event.time || '09:00',
        type: event.type,
        color: event.color
      })
    }
  },

  onTitleInput(e) {
    this.setData({ title: e.detail.value })
  },

  onTimeChange(e) {
    this.setData({ time: e.detail.value })
  },

  onTypeSelect(e) {
    const { value } = e.currentTarget.dataset
    const typeObj = this.data.types.find(t => t.value === value)
    this.setData({ type: value, color: typeObj.color })
  },

  onSave() {
    if (!this.data.title.trim()) {
      wx.showToast({ title: '请输入内容', icon: 'none' })
      return
    }

    const events = wx.getStorageSync('calendar_events') || []
    
    if (this.data.eventId) {
      const index = events.findIndex(e => e.id === this.data.eventId)
      if (index > -1) {
        events[index] = {
          id: this.data.eventId,
          date: this.data.date,
          title: this.data.title.trim(),
          time: this.data.time,
          type: this.data.type,
          color: this.data.color
        }
      }
    } else {
      events.push({
        id: Date.now().toString(),
        date: this.data.date,
        title: this.data.title.trim(),
        time: this.data.time,
        type: this.data.type,
        color: this.data.color
      })
    }

    wx.setStorageSync('calendar_events', events)
    wx.showToast({ title: '已保存', icon: 'success' })
    
    setTimeout(() => wx.navigateBack(), 1000)
  },

  onDelete() {
    if (!this.data.eventId) return

    wx.showModal({
      title: '删除',
      content: '确定删除？',
      success: (res) => {
        if (res.confirm) {
          const events = wx.getStorageSync('calendar_events') || []
          const filtered = events.filter(e => e.id !== this.data.eventId)
          wx.setStorageSync('calendar_events', filtered)
          wx.showToast({ title: '已删除', icon: 'success' })
          setTimeout(() => wx.navigateBack(), 1000)
        }
      }
    })
  }
})