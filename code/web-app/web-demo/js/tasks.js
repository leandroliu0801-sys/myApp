// ===== 任务逻辑 =====

let taskIdCounter = 100

function renderTasks() {
  const status = AppData.currentTaskTab
  const filtered = AppData.tasks.filter(t => t.status === status)
  const list = document.getElementById('taskList')
  
  if (filtered.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📋</div>
        <div class="empty-text">暂无任务</div>
        <div class="empty-hint">点击右下角 + 发布新任务吧</div>
      </div>
    `
    return
  }
  
  list.innerHTML = filtered.map(task => {
    const colors = AppData.typeColors[task.type] || { bg: '#FFF0F5', color: '#FF6B9D' }
    
    let actions = ''
    if (task.status === 'pending') {
      actions = `<button class="action-btn accept" onclick="acceptTask(${task.id})">✅ 领取任务</button>`
    } else if (task.status === 'ongoing') {
      actions = `<button class="action-btn complete" onclick="completeTask(${task.id})">✅ 申请完成</button>`
    } else if (task.status === 'completed') {
      actions = `
        <div class="completed-actions">
          <button class="action-btn confirm" onclick="confirmTask(${task.id})">✅ 确认完成</button>
          <button class="action-btn delete" onclick="deleteTask(${task.id})">🗑️ 删除</button>
        </div>
      `
    }
    
    return `
      <div class="task-card fade-in">
        <div class="task-header">
          <span class="task-type" style="background:${colors.bg};color:${colors.color}">${task.type}</span>
          <span class="task-score">+${task.score}分</span>
        </div>
        <div class="task-body">
          <span class="task-title">${task.title}</span>
          ${task.description ? `<span class="task-desc">${task.description}</span>` : ''}
        </div>
        <div class="task-footer">
          <span>🕐 ${task.createdAt}</span>
          <span>发布者：${task.publisher}</span>
        </div>
        <div class="task-actions">${actions}</div>
      </div>
    `
  }).join('')
}

function switchTaskTab(tab, el) {
  AppData.currentTaskTab = tab
  document.querySelectorAll('#page-tasks .tabs .tab-item').forEach(t => t.classList.remove('active'))
  el.classList.add('active')
  renderTasks()
}

function acceptTask(id) {
  const task = AppData.tasks.find(t => t.id === id)
  if (task) {
    task.status = 'ongoing'
    renderTasks()
    showToast('✅ 已领取任务，加油完成吧！')
  }
}

function completeTask(id) {
  if (confirm('确定已完成该任务吗？需要对方确认后才能获得积分哦~')) {
    const task = AppData.tasks.find(t => t.id === id)
    if (task) {
      task.status = 'completed'
      renderTasks()
      showToast('🎉 任务完成！等待对方确认中~')
    }
  }
}

function confirmTask(id) {
  if (confirm('确认对方已完成该任务？确认后对方将获得积分！')) {
    const task = AppData.tasks.find(t => t.id === id)
    if (task) {
      AppData.tasks = AppData.tasks.filter(t => t.id !== id)
      AppData.myScore += task.score
      renderTasks()
      renderDog()
      showToast('✅ 已确认！积分已发放~')
    }
  }
}

function deleteTask(id) {
  if (confirm('确定要删除这个任务吗？')) {
    AppData.tasks = AppData.tasks.filter(t => t.id !== id)
    renderTasks()
    showToast('已删除')
  }
}

// 发布任务弹窗
function openPublishModal() {
  document.getElementById('taskModalMask').classList.add('show')
  document.getElementById('taskModal').classList.add('show')
  document.getElementById('taskTitleInput').value = ''
  document.getElementById('taskDescInput').value = ''
  document.getElementById('taskScoreLabel').textContent = '20'
  document.getElementById('taskScoreSlider').value = '20'
  // 重置类型选择
  document.querySelectorAll('#taskModal .type-option').forEach((el, i) => {
    el.classList.toggle('selected', i === 0)
  })
}

function closePublishModal() {
  document.getElementById('taskModalMask').classList.remove('show')
  document.getElementById('taskModal').classList.remove('show')
}

function selectTaskType(el) {
  document.querySelectorAll('#taskModal .type-option').forEach(e => e.classList.remove('selected'))
  el.classList.add('selected')
}

function updateTaskScore(val) {
  document.getElementById('taskScoreLabel').textContent = val
}

function publishTask() {
  const title = document.getElementById('taskTitleInput').value.trim()
  if (!title) {
    showToast('请输入任务标题')
    return
  }
  
  const desc = document.getElementById('taskDescInput').value.trim()
  const score = parseInt(document.getElementById('taskScoreSlider').value)
  const typeEl = document.querySelector('#taskModal .type-option.selected')
  const type = typeEl ? typeEl.dataset.type : '暖心'
  
  const newTask = {
    id: ++taskIdCounter,
    title,
    description: desc || '无描述',
    score,
    type,
    publisher: '我',
    status: 'pending',
    createdAt: new Date().toLocaleString()
  }
  
  AppData.tasks.unshift(newTask)
  closePublishModal()
  renderTasks()
  showToast('📋 任务发布成功！')
}