// utils/lunarUtil.js - 农历工具函数

const { Solar } = require('lunar-javascript')

/**
 * 获取农历日期对象
 * @param {number} year 公历年份
 * @param {number} month 公历月份 (1-12)
 * @param {number} day 公历日
 * @returns {Object} 农历日期对象
 */
function getLunarDate(year, month, day) {
  const solar = Solar.fromYmd(year, month, day)
  return solar.getLunar()
}

/**
 * 格式化农历日显示
 * @param {number} day 农历日 (1-30)
 * @returns {string} 格式化的农历日字符串
 */
function formatLunarDay(day) {
  if (day < 1 || day > 30) return ''
  
  const lunarDays = [
    '初一', '初二', '初三', '初四', '初五',
    '初六', '初七', '初八', '初九', '初十',
    '十一', '十二', '十三', '十四', '十五',
    '十六', '十七', '十八', '十九', '二十',
    '廿一', '廿二', '廿三', '廿四', '廿五',
    '廿六', '廿七', '廿八', '廿九', '三十'
  ]
  
  return lunarDays[day - 1]
}

/**
 * 获取农历日期简短显示（用于日历格子）
 * @param {number} year 公历年份
 * @param {number} month 公历月份 (1-12)
 * @param {number} day 公历日
 * @returns {string} 农历日期简短显示
 */
function getLunarDayShort(year, month, day) {
  const lunar = getLunarDate(year, month, day)
  const lunarDay = lunar.getDay()
  
  // 初一显示月份
  if (lunarDay === 1) {
    const lunarMonth = lunar.getMonth()
    // lunar-javascript 用负数表示闰月，-2表示闰二月
    const isLeap = lunarMonth < 0
    return isLeap ? `闰${Math.abs(lunarMonth)}月` : `${lunarMonth}月`
  }
  
  // 节气优先显示
  const jieQi = lunar.getJieQi()
  if (jieQi) {
    return jieQi
  }
  
  // 其他日期显示农历日
  return formatLunarDay(lunarDay)
}

module.exports = {
  getLunarDate,
  formatLunarDay,
  getLunarDayShort
}