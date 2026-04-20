// app.js - 小程序入口
App({
  onLaunch() {
    // 小程序启动时执行
    console.log('XTechMan 小程序启动')
    
    // 初始化全局数据
    this.initGlobalData()
  },

  initGlobalData() {
    // 获取系统信息
    const systemInfo = wx.getSystemInfoSync()
    this.globalData.systemInfo = systemInfo
    
    // 加载本地存储的事件数据
    const events = wx.getStorageSync('calendar_events') || []
    this.globalData.events = events
  },

  globalData: {
    systemInfo: null,
    events: [],
    userInfo: null
  }
})