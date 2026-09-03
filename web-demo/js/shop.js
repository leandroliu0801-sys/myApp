// ===== 商城逻辑 =====

let productIdCounter = 200

function renderProducts() {
  if (AppData.currentShopTab === 'shop') {
    renderShop()
  } else {
    renderWarehouse()
  }
}

function renderShop() {
  const list = document.getElementById('productList')
  const products = AppData.products
  
  if (products.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🛒</div>
        <div class="empty-text">商城暂无商品</div>
        <div class="empty-hint">点击右下角 + 上架商品吧</div>
      </div>
    `
    return
  }
  
  list.innerHTML = products.map(p => `
    <div class="product-card fade-in">
      <div class="product-icon">${p.icon}</div>
      <div class="product-info">
        <span class="product-name">${p.name}</span>
        <span class="product-desc">${p.description}</span>
        <div class="product-meta">
          <span class="product-seller">上架者：${p.seller}</span>
          <span class="product-price">${p.price} 积分</span>
        </div>
      </div>
      <button class="buy-btn" onclick="buyProduct(${p.id})">购买</button>
    </div>
  `).join('')
}

function renderWarehouse() {
  const list = document.getElementById('productList')
  const items = AppData.warehouse
  
  if (items.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📦</div>
        <div class="empty-text">仓库空空如也</div>
        <div class="empty-hint">去商城买点好东西吧~</div>
      </div>
    `
    return
  }
  
  list.innerHTML = items.map(item => `
    <div class="product-card warehouse fade-in">
      <div class="product-icon">${item.icon}</div>
      <div class="product-info">
        <span class="product-name">${item.name}</span>
        <span class="product-desc">${item.description}</span>
        <div class="product-meta">
          <span class="product-seller">来自：${item.from}</span>
          <span class="product-price">已花费 ${item.price} 积分</span>
        </div>
      </div>
      <button class="use-btn" onclick="useProduct(${item.id})">使用</button>
    </div>
  `).join('')
}

function switchShopTab(tab, el) {
  AppData.currentShopTab = tab
  document.querySelectorAll('#page-shop .tabs .tab-item').forEach(t => t.classList.remove('active'))
  el.classList.add('active')
  
  // 控制悬浮按钮显示
  document.querySelectorAll('.fab-btn')[1].style.display = tab === 'shop' ? 'flex' : 'none'
  
  renderProducts()
}

function buyProduct(id) {
  const product = AppData.products.find(p => p.id === id)
  if (!product) return
  
  if (AppData.myScore < product.price) {
    showToast('积分不够哦，多做任务赚积分吧~')
    return
  }
  
  if (confirm(`确定花费 ${product.price} 积分购买「${product.name}」吗？`)) {
    AppData.myScore -= product.price
    AppData.products = AppData.products.filter(p => p.id !== id)
    
    const newItem = {
      ...product,
      id: ++productIdCounter,
      from: product.seller,
      boughtAt: new Date().toLocaleString()
    }
    delete newItem.seller
    AppData.warehouse.push(newItem)
    
    renderProducts()
    renderDog()
    showToast('🎉 购买成功！已存入仓库~')
  }
}

function useProduct(id) {
  if (confirm('确定要使用该商品吗？使用后需要对方核销确认。')) {
    AppData.warehouse = AppData.warehouse.filter(item => item.id !== id)
    renderProducts()
    showToast('✅ 已使用，等待对方核销~')
  }
}

// 上架商品弹窗
function openShopPublishModal() {
  document.getElementById('shopModalMask').classList.add('show')
  document.getElementById('shopModal').classList.add('show')
  document.getElementById('productNameInput').value = ''
  document.getElementById('productDescInput').value = ''
  document.getElementById('productPriceLabel').textContent = '50'
  document.getElementById('productPriceSlider').value = '50'
  // 重置图标选择
  document.querySelectorAll('#shopModal .icon-option').forEach((el, i) => {
    el.classList.toggle('selected', i === 0)
  })
}

function closeShopPublishModal() {
  document.getElementById('shopModalMask').classList.remove('show')
  document.getElementById('shopModal').classList.remove('show')
}

function selectIcon(el) {
  document.querySelectorAll('#shopModal .icon-option').forEach(e => e.classList.remove('selected'))
  el.classList.add('selected')
}

function updateProductPrice(val) {
  document.getElementById('productPriceLabel').textContent = val
}

function publishProduct() {
  const name = document.getElementById('productNameInput').value.trim()
  if (!name) {
    showToast('请输入商品名称')
    return
  }
  
  const desc = document.getElementById('productDescInput').value.trim()
  const price = parseInt(document.getElementById('productPriceSlider').value)
  const iconEl = document.querySelector('#shopModal .icon-option.selected')
  const icon = iconEl ? iconEl.textContent : '🎁'
  
  const newProduct = {
    id: ++productIdCounter,
    name,
    description: desc || '无描述',
    price,
    seller: '我',
    icon
  }
  
  AppData.products.unshift(newProduct)
  closeShopPublishModal()
  renderProducts()
  showToast('🛒 商品上架成功！')
}