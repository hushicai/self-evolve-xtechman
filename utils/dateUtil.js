// utils/dateUtil.js - 日期工具函数

const lunarUtil = require('./lunarUtil')

/**
 * 获取某月的天数
 * @param {number} year 年份
 * @param {number} month 月份 (1-12)
 * @returns {number} 天数
 */
function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate()
}

/**
 * 获取某月第一天是周几 (0-6, 0=周日)
 * @param {number} year 年份
 * @param {number} month 月份 (1-12)
 * @returns {number} 周几
 */
function getFirstDayOfMonth(year, month) {
  return new Date(year, month - 1, 1).getDay()
}

/**
 * 生成日历网格数据
 * @param {number} year 年份
 * @param {number} month 月份 (1-12)
 * @returns {Array} 日历网格数组
 */
function generateCalendarGrid(year, month) {
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)
  const grid = []

  // 前置空格子
  for (let i = 0; i < firstDay; i++) {
    grid.push({ day: '', isCurrentMonth: false })
  }

  // 当月日期
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = formatDateStr(year, month, day)
    const lunarDay = lunarUtil.getLunarDayShort(year, month, day)
    grid.push({
      day: day,
      date: dateStr,
      isCurrentMonth: true,
      isToday: isToday(year, month, day),
      lunarDay: lunarDay
    })
  }

  // 后置空格子（补齐 6 行）
  const remaining = 42 - grid.length
  for (let i = 0; i < remaining; i++) {
    grid.push({ day: '', isCurrentMonth: false })
  }

  return grid
}

/**
 * 格式化日期字符串 YYYY-MM-DD
 * @param {number} year 
 * @param {number} month 
 * @param {number} day 
 * @returns {string}
 */
function formatDateStr(year, month, day) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

/**
 * 判断是否是今天
 * @param {number} year 
 * @param {number} month 
 * @param {number} day 
 * @returns {boolean}
 */
function isToday(year, month, day) {
  const today = new Date()
  return today.getFullYear() === year &&
         today.getMonth() + 1 === month &&
         today.getDate() === day
}

/**
 * 获取上月年月
 * @param {number} year 
 * @param {number} month 
 * @returns {Object} {year, month}
 */
function getPrevMonth(year, month) {
  if (month === 1) {
    return { year: year - 1, month: 12 }
  }
  return { year, month: month - 1 }
}

/**
 * 获取下月年月
 * @param {number} year 
 * @param {number} month 
 * @returns {Object} {year, month}
 */
function getNextMonth(year, month) {
  if (month === 12) {
    return { year: year + 1, month: 1 }
  }
  return { year, month: month + 1 }
}

module.exports = {
  getDaysInMonth,
  getFirstDayOfMonth,
  generateCalendarGrid,
  formatDateStr,
  isToday,
  getPrevMonth,
  getNextMonth
}