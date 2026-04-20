// test/event-edit.test.js - 事件编辑页面逻辑测试

// 模拟微信 API
const mockStorage = {}
global.wx = {
  getStorageSync: jest.fn((key) => mockStorage[key] || []),
  setStorageSync: jest.fn((key, value) => { mockStorage[key] = value }),
  showToast: jest.fn(),
  showModal: jest.fn(),
  navigateBack: jest.fn()
}

// 模拟 Page 逻辑
class EventEditPage {
  constructor() {
    this.data = {
      date: '',
      eventId: '',
      title: '',
      time: '09:00',
      type: 'reminder',
      color: '#5677fc',
      types: [
        { value: 'reminder', label: '提醒', color: '#5677fc' },
        { value: 'meeting', label: '会议', color: '#ff9800' },
        { value: 'birthday', label: '生日', color: '#4caf50' },
        { value: 'deadline', label: '截止', color: '#f44336' }
      ]
    }
  }

  onLoad(options) {
    const { date, id } = options
    if (id) {
      this.loadEvent(id)
    } else {
      this.data.date = date
    }
  }

  loadEvent(id) {
    const events = wx.getStorageSync('calendar_events') || []
    const event = events.find(e => e.id === id)
    if (event) {
      this.data = {
        ...this.data,
        eventId: id,
        date: event.date,
        title: event.title,
        time: event.time || '09:00',
        type: event.type,
        color: event.color
      }
    }
  }

  onTitleInput(value) {
    this.data.title = value
  }

  onTimeChange(value) {
    this.data.time = value
  }

  onTypeSelect(value) {
    const typeObj = this.data.types.find(t => t.value === value)
    this.data.type = value
    this.data.color = typeObj.color
  }

  onSave() {
    if (!this.data.title.trim()) {
      return { success: false, error: '请输入内容' }
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
    return { success: true }
  }

  onDelete() {
    if (!this.data.eventId) return { deleted: false }
    
    const events = wx.getStorageSync('calendar_events') || []
    const filtered = events.filter(e => e.id !== this.data.eventId)
    wx.setStorageSync('calendar_events', filtered)
    return { deleted: true }
  }
}

// 清理 mock
beforeEach(() => {
  Object.keys(mockStorage).forEach(key => delete mockStorage[key])
})

describe('event-edit 页面逻辑', () => {
  describe('新建事件', () => {
    test('onLoad 无 id 时初始化日期', () => {
      const page = new EventEditPage()
      page.onLoad({ date: '2026-04-20' })
      expect(page.data.date).toBe('2026-04-20')
      expect(page.data.eventId).toBe('')
    })

    test('onSave 新建事件', () => {
      const page = new EventEditPage()
      page.onLoad({ date: '2026-04-20' })
      page.onTitleInput('测试事件')
      page.onTimeChange('14:00')
      page.onTypeSelect('meeting')

      const result = page.onSave()
      expect(result.success).toBe(true)
      
      const events = wx.getStorageSync('calendar_events')
      expect(events.length).toBe(1)
      expect(events[0].title).toBe('测试事件')
      expect(events[0].time).toBe('14:00')
      expect(events[0].type).toBe('meeting')
      expect(events[0].color).toBe('#ff9800')
    })

    test('onSave 空标题返回错误', () => {
      const page = new EventEditPage()
      page.onLoad({ date: '2026-04-20' })
      
      const result = page.onSave()
      expect(result.success).toBe(false)
      expect(result.error).toBe('请输入内容')
    })
  })

  describe('编辑事件', () => {
    test('onLoad 有 id 时加载事件', () => {
      // 预设一个事件
      const existingEvent = {
        id: '123',
        date: '2026-04-20',
        title: '已有事件',
        time: '10:00',
        type: 'birthday',
        color: '#4caf50'
      }
      mockStorage['calendar_events'] = [existingEvent]

      const page = new EventEditPage()
      page.onLoad({ id: '123' })

      expect(page.data.eventId).toBe('123')
      expect(page.data.title).toBe('已有事件')
      expect(page.data.time).toBe('10:00')
      expect(page.data.type).toBe('birthday')
      expect(page.data.color).toBe('#4caf50')
    })

    test('onSave 更新已有事件', () => {
      const existingEvent = {
        id: '123',
        date: '2026-04-20',
        title: '已有事件',
        time: '10:00',
        type: 'reminder',
        color: '#5677fc'
      }
      mockStorage['calendar_events'] = [existingEvent]

      const page = new EventEditPage()
      page.onLoad({ id: '123' })
      page.onTitleInput('修改后的事件')
      page.onTypeSelect('deadline')

      const result = page.onSave()
      expect(result.success).toBe(true)

      const events = wx.getStorageSync('calendar_events')
      expect(events.length).toBe(1)
      expect(events[0].title).toBe('修改后的事件')
      expect(events[0].type).toBe('deadline')
      expect(events[0].color).toBe('#f44336')
    })
  })

  describe('类型选择', () => {
    test('选择 reminder 类型', () => {
      const page = new EventEditPage()
      page.onTypeSelect('reminder')
      expect(page.data.type).toBe('reminder')
      expect(page.data.color).toBe('#5677fc')
    })

    test('选择 meeting 类型', () => {
      const page = new EventEditPage()
      page.onTypeSelect('meeting')
      expect(page.data.type).toBe('meeting')
      expect(page.data.color).toBe('#ff9800')
    })

    test('选择 birthday 类型', () => {
      const page = new EventEditPage()
      page.onTypeSelect('birthday')
      expect(page.data.type).toBe('birthday')
      expect(page.data.color).toBe('#4caf50')
    })

    test('选择 deadline 类型', () => {
      const page = new EventEditPage()
      page.onTypeSelect('deadline')
      expect(page.data.type).toBe('deadline')
      expect(page.data.color).toBe('#f44336')
    })
  })

  describe('删除事件', () => {
    test('onDelete 删除已有事件', () => {
      const events = [
        { id: '1', title: '事件1', date: '2026-04-20' },
        { id: '2', title: '事件2', date: '2026-04-21' }
      ]
      mockStorage['calendar_events'] = events

      const page = new EventEditPage()
      page.data.eventId = '1'
      
      const result = page.onDelete()
      expect(result.deleted).toBe(true)

      const remaining = wx.getStorageSync('calendar_events')
      expect(remaining.length).toBe(1)
      expect(remaining[0].id).toBe('2')
    })

    test('onDelete 无 eventId 时不删除', () => {
      const events = [
        { id: '1', title: '事件1', date: '2026-04-20' }
      ]
      mockStorage['calendar_events'] = events

      const page = new EventEditPage()
      // eventId 为空
      
      const result = page.onDelete()
      expect(result.deleted).toBe(false)

      const remaining = wx.getStorageSync('calendar_events')
      expect(remaining.length).toBe(1)
    })
  })

  describe('时间处理', () => {
    test('onTimeChange 更新时间', () => {
      const page = new EventEditPage()
      page.onTimeChange('18:30')
      expect(page.data.time).toBe('18:30')
    })

    test('默认时间为 09:00', () => {
      const page = new EventEditPage()
      expect(page.data.time).toBe('09:00')
    })
  })

  describe('边界情况', () => {
    test('标题 trim 处理', () => {
      const page = new EventEditPage()
      page.onLoad({ date: '2026-04-20' })
      page.onTitleInput('  有空格的标题  ')
      
      const result = page.onSave()
      expect(result.success).toBe(true)
      
      const events = wx.getStorageSync('calendar_events')
      expect(events[0].title).toBe('有空格的标题')
    })

    test('加载不存在的事件', () => {
      mockStorage['calendar_events'] = []
      
      const page = new EventEditPage()
      page.onLoad({ id: 'nonexistent' })
      
      // 应该保持默认值
      expect(page.data.eventId).toBe('')
      expect(page.data.title).toBe('')
    })
  })
})