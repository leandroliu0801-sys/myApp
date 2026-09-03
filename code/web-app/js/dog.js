// ===== 萨摩耶逻辑 =====

function renderDog() {
  const dog = AppData.dog
  
  // 更新等级
  document.getElementById('dogLevel').textContent = `Lv.${dog.level}`
  document.getElementById('dogName').textContent = dog.name
  
  // 更新表情
  updateDogExpression()
  
  // 更新经验条
  const expPercent = (dog.exp / dog.maxExp) * 100
  document.getElementById('expFill').style.width = `${expPercent}%`
  document.getElementById('expText').textContent = `${dog.exp}/${dog.maxExp}`
  
  // 更新属性条
  document.getElementById('hungerFill').style.width = `${dog.hunger}%`
  document.getElementById('hungerValue').textContent = `${dog.hunger}%`
  document.getElementById('cleanFill').style.width = `${dog.cleanliness}%`
  document.getElementById('cleanValue').textContent = `${dog.cleanliness}%`
  document.getElementById('moodFill').style.width = `${dog.mood}%`
  document.getElementById('moodValue').textContent = `${dog.mood}%`
  document.getElementById('energyFill').style.width = `${dog.energy}%`
  document.getElementById('energyValue').textContent = `${dog.energy}%`
  
  // 更新狗狗图片
  document.getElementById('dogImage').textContent = dog.levelImages[dog.level] || '🐶'
  
  // 更新状态提示
  renderStatusTips()
  
  // 更新积分
  document.getElementById('myScore').textContent = AppData.myScore
  document.getElementById('partnerScore').textContent = AppData.partnerScore
  document.getElementById('shopScore').textContent = AppData.myScore
}

function updateDogExpression() {
  const dog = AppData.dog
  let expression = 'happy'
  
  if (dog.hunger < 30) expression = 'hungry'
  else if (dog.cleanliness < 30) expression = 'dirty'
  else if (dog.mood < 30) expression = 'bored'
  else if (dog.energy > 90) expression = 'excited'
  
  dog.expression = expression
  document.getElementById('dogExpression').textContent = dog.expressionMap[expression]
}

function renderStatusTips() {
  const dog = AppData.dog
  const tips = []
  
  if (dog.hunger < 30) tips.push('<span class="status-tip hungry">🍗 饿了</span>')
  if (dog.cleanliness < 30) tips.push('<span class="status-tip dirty">🧹 脏了</span>')
  if (dog.mood < 30) tips.push('<span class="status-tip bored">😑 无聊</span>')
  if (dog.energy > 90) tips.push('<span class="status-tip excited">🤩 想出去玩！</span>')
  
  document.getElementById('statusTips').innerHTML = tips.join('')
}

// 互动操作
function onFeed() {
  if (AppData.cooldowns.feed) {
    showToast('狗狗刚吃饱，等一会儿再喂吧~')
    return
  }
  
  AppData.dog.hunger = Math.min(100, AppData.dog.hunger + 15)
  AppData.dog.mood = Math.min(100, AppData.dog.mood + 5)
  AppData.dog.exp = Math.min(AppData.dog.maxExp, AppData.dog.exp + 5)
  
  checkLevelUp()
  renderDog()
  startCooldown('feed', 120) // 2小时，演示用120秒
  showToast('🍗 喂食成功！狗狗好开心~')
}

function onBath() {
  if (AppData.cooldowns.bath) {
    showToast('狗狗刚洗完澡，还干净着呢~')
    return
  }
  
  AppData.dog.cleanliness = Math.min(100, AppData.dog.cleanliness + 25)
  AppData.dog.mood = Math.min(100, AppData.dog.mood + 3)
  AppData.dog.exp = Math.min(AppData.dog.maxExp, AppData.dog.exp + 8)
  
  checkLevelUp()
  renderDog()
  startCooldown('bath', 300) // 5分钟
  showToast('🛁 洗完澡啦！香喷喷的~')
}

function onPlay() {
  if (AppData.cooldowns.play) {
    showToast('狗狗玩累了，让它休息一下吧~')
    return
  }
  
  AppData.dog.mood = Math.min(100, AppData.dog.mood + 20)
  AppData.dog.energy = Math.max(0, AppData.dog.energy - 15)
  AppData.dog.exp = Math.min(AppData.dog.maxExp, AppData.dog.exp + 10)
  
  checkLevelUp()
  renderDog()
  startCooldown('play', 60) // 1分钟
  showToast('🎾 玩得好开心！狗狗超兴奋~')
}

function onWalk() {
  if (AppData.cooldowns.walk) {
    showToast('狗狗今天已经遛过啦~')
    return
  }
  
  AppData.dog.energy = Math.max(0, AppData.dog.energy - 30)
  AppData.dog.mood = Math.min(100, AppData.dog.mood + 15)
  AppData.dog.cleanliness = Math.max(0, AppData.dog.cleanliness - 10)
  AppData.dog.exp = Math.min(AppData.dog.maxExp, AppData.dog.exp + 15)
  
  checkLevelUp()
  renderDog()
  startCooldown('walk', 600) // 10分钟
  showToast('🚶 遛狗回来啦！狗狗好满足~')
}

function checkLevelUp() {
  const dog = AppData.dog
  if (dog.exp >= dog.maxExp && dog.level < 5) {
    dog.level++
    dog.exp = 0
    dog.maxExp = dog.level * 100
    showToast(`🎉 升级啦！小萨升到 Lv.${dog.level}！`)
  }
}

function startCooldown(type, seconds) {
  AppData.cooldowns[type] = true
  const btn = document.getElementById(`btn${type.charAt(0).toUpperCase() + type.slice(1)}`)
  if (btn) btn.disabled = true
  
  setTimeout(() => {
    AppData.cooldowns[type] = false
    if (btn) btn.disabled = false
  }, seconds * 1000)
}