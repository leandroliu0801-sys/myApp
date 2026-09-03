// ===== 应用主逻辑 =====

// Toast 提示
function showToast(msg) {
  const toast = document.getElementById('toast')
  toast.textContent = msg
  toast.classList.add('show')
  clearTimeout(toast._timer)
  toast._timer = setTimeout(() => {
    toast.classList.remove('show')
  }, 2000)
}

// Tab 切换
function switchTab(tab) {
  // 更新 Tab 栏
  document.querySelectorAll('.tab-item').forEach(el => {
    el.classList.toggle('active', el.dataset.tab === tab)
  })
  
  // 切换页面
  document.querySelectorAll('.page').forEach(el => {
    el.classList.remove('active')
  })
  document.getElementById(`page-${tab}`).classList.add('active')
  
  // 控制悬浮按钮显示
  const fabs = document.querySelectorAll('.fab-btn')
  if (fabs.length >= 2) {
    fabs[0].style.display = tab === 'tasks' ? 'flex' : 'none'
    fabs[1].style.display = tab === 'shop' ? 'flex' : 'none'
  }
  
  // 渲染对应页面
  if (tab === 'tasks') renderTasks()
  if (tab === 'shop') renderProducts()
}

// 初始化
function init() {
  // 计算恋爱天数
  const days = getLoveDays()
  document.getElementById('loveDays').textContent = days
  document.getElementById('loveDaysText').textContent = days
  
  // 渲染首页
  renderDog()
  
  // 渲染任务
  renderTasks()
  
  // 渲染商城
  renderProducts()
  
  // 默认隐藏悬浮按钮
  document.querySelectorAll('.fab-btn').forEach(el => el.style.display = 'none')
  
  // 模拟属性随时间衰减（每30秒衰减一次）
  setInterval(() => {
    AppData.dog.hunger = Math.max(0, AppData.dog.hunger - 1)
    AppData.dog.cleanliness = Math.max(0, AppData.dog.cleanliness - 0.5)
    AppData.dog.mood = Math.max(0, AppData.dog.mood - 0.5)
    renderDog()
  }, 30000)
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init)