// ===== 数据层 =====

const AppData = {
  // 恋爱信息
  loveStartDate: '2024-01-01',

  // 狗狗状态
  dog: {
    name: '小萨',
    level: 1,
    exp: 0,
    maxExp: 100,
    hunger: 80,
    cleanliness: 80,
    mood: 80,
    energy: 50,
    expression: 'happy',
    expressionMap: {
      happy: '😊',
      hungry: '🥺',
      dirty: '😅',
      bored: '😑',
      excited: '🤩',
      sleeping: '😴'
    },
    levelImages: {
      1: '🐶',
      2: '🐕',
      3: '🦮',
      4: '🐩',
      5: '✨'
    }
  },

  // 积分
  myScore: 0,
  partnerScore: 0,

  // 冷却状态
  cooldowns: {
    feed: false,
    bath: false,
    play: false,
    walk: false
  },

  // 任务列表
  tasks: [
    {
      id: 1,
      title: '说早安',
      description: '起床后第一句早安',
      score: 10,
      type: '暖心',
      publisher: '她',
      status: 'pending',
      createdAt: '2024-01-15 08:00'
    },
    {
      id: 2,
      title: '洗碗',
      description: '今天的碗归你洗啦~',
      score: 30,
      type: '家务',
      publisher: '她',
      status: 'pending',
      createdAt: '2024-01-15 10:00'
    },
    {
      id: 3,
      title: '策划一次约会',
      description: '安排这周末的约会行程',
      score: 80,
      type: '浪漫',
      publisher: '我',
      status: 'ongoing',
      createdAt: '2024-01-14 20:00'
    }
  ],

  // 商城商品
  products: [
    { id: 1, name: '免做家务券', description: '可免一次家务，对方不得拒绝！', price: 100, seller: '她', icon: '🧹' },
    { id: 2, name: '奶茶券', description: '对方请喝一杯奶茶，任选口味', price: 50, seller: '我', icon: '🧋' },
    { id: 3, name: '按摩券', description: '15分钟专属按摩服务', price: 60, seller: '她', icon: '💆' },
    { id: 4, name: '无条件哄我券', description: '无论谁对谁错，都要哄我！', price: 200, seller: '我', icon: '🤗' }
  ],

  // 仓库
  warehouse: [
    { id: 101, name: '电影券', description: '陪看电影一次', price: 80, from: '她', icon: '🎬', boughtAt: '2024-01-10' }
  ],

  // 当前任务 tab
  currentTaskTab: 'pending',
  // 当前商城 tab
  currentShopTab: 'shop',

  // 类型颜色
  typeColors: {
    '暖心': { bg: '#FFF0F5', color: '#FF6B9D' },
    '家务': { bg: '#E8F5E9', color: '#4CAF50' },
    '浪漫': { bg: '#FFF3E0', color: '#FF9800' }
  }
}

// ===== 工具函数 =====

function formatDate(date) {
  const d = new Date(date)
  return `${d.getMonth() + 1}月${d.getDate()}日`
}

function getLoveDays() {
  const start = new Date(AppData.loveStartDate)
  const now = new Date()
  return Math.floor((now - start) / (1000 * 60 * 60 * 24))
}