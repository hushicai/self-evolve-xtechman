// utils/fortuneUtil.js - 运势数据生成工具

// 十二星座数据
const zodiacSigns = [
  { name: '白羊座', icon: '♈', date: '03-21~04-19', element: '火', color: '#f44336' },
  { name: '金牛座', icon: '♉', date: '04-20~05-20', element: '土', color: '#4caf50' },
  { name: '双子座', icon: '♊', date: '05-21~06-21', element: '风', color: '#ff9800' },
  { name: '巨蟹座', icon: '♋', date: '06-22~07-22', element: '水', color: '#9c27b0' },
  { name: '狮子座', icon: '♌', date: '07-23~08-22', element: '火', color: '#ff5722' },
  { name: '处女座', icon: '♍', date: '08-23~09-22', element: '土', color: '#795548' },
  { name: '天秤座', icon: '♎', date: '09-23~10-23', element: '风', color: '#e91e63' },
  { name: '天蝎座', icon: '♏', date: '10-24~11-22', element: '水', color: '#673ab7' },
  { name: '射手座', icon: '♐', date: '11-23~12-21', element: '火', color: '#3f51b5' },
  { name: '摩羯座', icon: '♑', date: '12-22~01-19', element: '土', color: '#607d8b' },
  { name: '水瓶座', icon: '♒', date: '01-20~02-18', element: '风', color: '#00bcd4' },
  { name: '双鱼座', icon: '♓', date: '02-19~03-20', element: '水', color: '#009688' }
]

// 根据日期获取星座
function getZodiacByDate(month, day) {
  const dateStr = `${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  for (const zodiac of zodiacSigns) {
    const [start, end] = zodiac.date.split('~')
    if (dateStr >= start && dateStr <= end) {
      return zodiac
    }
  }
  return zodiacSigns[0]
}

// 根据日期生成伪随机数
function seedRandom(dateStr) {
  let seed = 0
  for (let i = 0; i < dateStr.length; i++) {
    seed = ((seed << 5) - seed) + dateStr.charCodeAt(i)
    seed = seed & seed
  }
  return Math.abs(seed) % 100
}

// 生成运势描述
function getFortuneText(score) {
  if (score >= 85) return '运势极佳'
  if (score >= 70) return '运势不错'
  if (score >= 55) return '运势平稳'
  if (score >= 40) return '运势波动'
  return '运势较低'
}

// 生成幸运信息
function generateLuckyInfo(dateStr) {
  const seed = seedRandom(dateStr)
  const numbers = [
    ((seed * 7) % 9) + 1,
    ((seed * 13) % 9) + 1,
    ((seed * 17) % 9) + 1
  ]
  const colors = ['红色', '蓝色', '绿色', '黄色', '紫色', '白色']
  const directions = ['东方', '西方', '南方', '北方', '东南', '西南']
  const foods = ['苹果', '香蕉', '橙子', '葡萄', '草莓', '芒果']
  
  return {
    numbers: [...new Set(numbers)],
    color: colors[seed % colors.length],
    direction: directions[(seed * 3) % directions.length],
    food: foods[(seed * 5) % foods.length]
  }
}

// 生成星座运势
function generateZodiacFortune(zodiac, dateStr) {
  const seed = seedRandom(dateStr + zodiac.name)
  const aspects = ['爱情', '事业', '财运', '健康']
  const fortunes = aspects.map((aspect, i) => ({
    name: aspect,
    score: 50 + ((seed * (i + 3)) % 50),
    text: getFortuneText(50 + ((seed * (i + 3)) % 50))
  }))
  
  return {
    ...zodiac,
    overall: fortunes,
    loveTip: seed % 2 === 0 ? '适合表白' : '适合独处思考',
    workTip: seed % 3 === 0 ? '注意沟通方式' : '保持专注'
  }
}

// 生成完整运势数据
function generateFortuneData(date) {
  const dateObj = new Date(date)
  const month = dateObj.getMonth() + 1
  const day = dateObj.getDate()
  
  const fortuneScore = 50 + (seedRandom(date) % 50)
  const fortuneText = getFortuneText(fortuneScore)
  const zodiac = getZodiacByDate(month, day)
  const luckyInfo = generateLuckyInfo(date)
  const zodiacFortune = generateZodiacFortune(zodiac, date)
  
  return {
    fortuneScore,
    fortuneText,
    zodiac: zodiacFortune,
    luckyInfo
  }
}

module.exports = {
  zodiacSigns,
  getZodiacByDate,
  seedRandom,
  getFortuneText,
  generateLuckyInfo,
  generateZodiacFortune,
  generateFortuneData
}