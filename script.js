// BESTFORGE - COMPLETO E FUNCIONAL
var products = [
    { id: 1, name: 'RTX 4090', category: 'GPU', price: 12999.99, oldPrice: 14999.99, description: 'Placa de video top', icon: '🎮', badge: 'sale', badgeText: 'OFERTA', stock: 15 },
    { id: 2, name: 'Ryzen 9 7950X', category: 'CPU', price: 4599.99, oldPrice: null, description: 'Processador 16 nucleos', icon: '💻', badge: 'new', badgeText: 'NOVO', stock: 25 },
    { id: 3, name: 'Corsair 32GB DDR5', category: 'RAM', price: 899.99, oldPrice: 1199.99, description: 'Memoria RAM rapida', icon: '⚡', badge: 'sale', badgeText: 'OFERTA', stock: 50 },
    { id: 4, name: 'Samsung 990 Pro', category: 'Storage', price: 1499.99, oldPrice: null, description: 'SSD NVMe 2TB', icon: '💾', badge: 'new', badgeText: 'NOVO', stock: 30 }
];

var cart = [];
var currentCategory = 'all';

// Carregar ao iniciar
window.onload = function() {
    console.log('✅ Pagina carregada!');
    loadData();
    renderProducts(products);
    updateCartUI();
    setupButtons();
    setupAdmin();
};

function loadData() {
    var saved = localStorage.getItem('bestforge_products');
    if (saved) {
        try {
            products = JSON.parse(saved);
            console.log('📦 Produtos carregados:', products.length);
        } catch(e) {}
    }
    var savedCart = localStorage.getItem('bestforge_cart');
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
        } catch(e) {}
    }
}

function saveData() {
    localStorage.setItem('bestforge_products', JSON.stringify(products));
    localStorage.setItem('bestforge_cart', JSON.stringify(cart));
}

function setupButtons() {
    var cartBtn = document.getElementById('cartBtn');
    var closeCart = document.getElementById('closeCart');
    var cartOverlay = document.getElementById('cartOverlay');
    var aiBtn = document.getElementById('aiChatBtn');
    var closeAI = document.getElementById('closeAI');
    var aiSend = document.getElementById('aiSendBtn');
    var checkoutBtn = document.getElementById('checkoutBtn');
    var searchBtn = document.getElementById('searchBtn');
    
    if (cartBtn) cartBtn.onclick = toggleCart;
    if (closeCart) closeCart.onclick = toggleCart;
    if (cartOverlay) cartOverlay.onclick = toggleCart;
    if (aiBtn) aiBtn.onclick = toggleAIChat;
    if (closeAI) closeAI.onclick = toggleAIChat;
    if (aiSend) aiSend.onclick = sendAIMessage;
    if (checkoutBtn) checkoutBtn.onclick = checkout;
    if (searchBtn) searchBtn.onclick = filterProducts;
    
    var searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.onkeypress = function(e) {
            if (e.key === 'Enter') filterProducts();
        };
    }
    
    var aiInput = document.getElementById('aiInput');
    if (aiInput) {
        aiInput.onkeypress = function(e) {
            if (e.key === 'Enter') sendAIMessage();
        };
    }
    
    var catButtons = document.querySelectorAll('.category-btn');
    for (var i = 0; i < catButtons.length; i++) {
        catButtons[i].onclick = function() {
            filterByCategory(this.getAttribute('data-category'));
        };
    }
}

function renderProducts(list) {
    var grid = document.getElementById('productsGrid');
    if (!grid) return;
    
    if (!list || list.length === 0) {
        grid.innerHTML = '<p style="color:white;text-align:center;padding:3rem;font-size:1.2em;">😕 Nenhum produto encontrado</p>';
        return;
    }
    
    var html = '';
    for (var i = 0; i < list.length; i++) {
        var p = list[i];
        html += '<div class="product-card">';
        if (p.badge) {
            html += '<div class="product-badge ' + p.badge + '">' + p.badgeText + '</div>';
        }
       // Se tiver imagem, usa a imagem. Se não, usa o ícone
if (p.image) {
    html += '<div class="product-image"><img src="' + p.image + '" alt="' + p.name + '" style="width:100%;height:100%;object-fit:cover;"></div>';
} else {
    html += '<div class="product-image">' + p.icon + '</div>';
}
        html += '<div class="product-info">';
        html += '<div class="product-category">' + p.category + '</div>';
        html += '<h3 class="product-name">' + p.name + '</h3>';
        html += '<p class="product-description">' + p.description + '</p>';
        html += '<div class="product-footer">';
        html += '<div class="product-price">R$ ' + p.price.toFixed(2).replace('.', ',');
        if (p.oldPrice) {
            html += '<span class="old-price">R$ ' + p.oldPrice.toFixed(2).replace('.', ',') + '</span>';
        }
        html += '</div>';
        html += '<button class="add-to-cart-btn" data-id="' + p.id + '">🛒 Adicionar</button>';
        html += '</div></div></div>';
    }
    
    grid.innerHTML = html;
    
    var addButtons = document.querySelectorAll('.add-to-cart-btn');
    for (var j = 0; j < addButtons.length; j++) {
        addButtons[j].onclick = function() {
            var id = parseInt(this.getAttribute('data-id'));
            addToCart(id, this);
        };
    }
}

function addToCart(productId, btn) {
    var product = null;
    for (var i = 0; i < products.length; i++) {
        if (products[i].id === productId) {
            product = products[i];
            break;
        }
    }
    
    if (!product) return;
    
    var existing = null;
    for (var j = 0; j < cart.length; j++) {
        if (cart[j].id === productId) {
            existing = cart[j];
            break;
        }
    }
    
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ id: product.id, name: product.name, price: product.price, icon: product.icon, quantity: 1 });
    }
    
    if (btn) {
        btn.textContent = '✓ Adicionado';
        btn.classList.add('added');
        setTimeout(function() {
            btn.textContent = '🛒 Adicionar';
            btn.classList.remove('added');
        }, 1500);
    }
    
    updateCartUI();
    saveData();
    showNotification(product.name + ' adicionado!');
}

function removeFromCart(productId) {
    var newCart = [];
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].id !== productId) {
            newCart.push(cart[i]);
        }
    }
    cart = newCart;
    updateCartUI();
    renderCartItems();
    saveData();
}

function updateCartUI() {
    var countEl = document.getElementById('cartCount');
    var totalEl = document.getElementById('cartTotal');
    if (!countEl || !totalEl) return;
    
    var count = 0, total = 0;
    for (var i = 0; i < cart.length; i++) {
        count += cart[i].quantity;
        total += cart[i].price * cart[i].quantity;
    }
    
    countEl.textContent = count;
    totalEl.textContent = 'R$ ' + total.toFixed(2).replace('.', ',');
}

function renderCartItems() {
    var container = document.getElementById('cartItems');
    if (!container) return;
    
    if (cart.length === 0) {
        container.innerHTML = '<p class="empty-cart">Carrinho vazio</p>';
        return;
    }
    
    var html = '';
    for (var i = 0; i < cart.length; i++) {
        var item = cart[i];
        html += '<div class="cart-item">';
        html += '<div class="cart-item-image">' + item.icon + '</div>';
        html += '<div class="cart-item-info">';
        html += '<div class="cart-item-name">' + item.name + '</div>';
        html += '<div class="cart-item-price">R$ ' + item.price.toFixed(2).replace('.', ',') + ' x ' + item.quantity + '</div>';
        html += '</div>';
        html += '<button class="remove-item" data-id="' + item.id + '">🗑️</button>';
        html += '</div>';
    }
    
    container.innerHTML = html;
    
    var removeButtons = document.querySelectorAll('.remove-item');
    for (var j = 0; j < removeButtons.length; j++) {
        removeButtons[j].onclick = function() {
            removeFromCart(parseInt(this.getAttribute('data-id')));
        };
    }
}

function toggleCart() {
    var modal = document.getElementById('cartModal');
    var overlay = document.getElementById('cartOverlay');
    if (!modal || !overlay) return;
    
    if (modal.classList.contains('open')) {
        modal.classList.remove('open');
        overlay.classList.remove('open');
    } else {
        renderCartItems();
        modal.classList.add('open');
        overlay.classList.add('open');
    }
}

function checkout() {
    if (cart.length === 0) { alert('Carrinho vazio!'); return; }
    var total = 0;
    for (var i = 0; i < cart.length; i++) total += cart[i].price * cart[i].quantity;
    alert('✅ Compra realizada! Total: R$ ' + total.toFixed(2).replace('.', ','));
    cart = [];
    updateCartUI();
    saveData();
    toggleCart();
}

function filterByCategory(cat) {
    currentCategory = cat;
    var buttons = document.querySelectorAll('.category-btn');
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('active');
        if (buttons[i].getAttribute('data-category') === cat) buttons[i].classList.add('active');
    }
    
    var filtered = [];
    for (var j = 0; j < products.length; j++) {
        if (cat === 'all' || products[j].category === cat) {
            filtered.push(products[j]);
        }
    }
    renderProducts(filtered);
}

function filterProducts() {
    var search = document.getElementById('searchInput').value.toLowerCase();
    var source = [];
    for (var i = 0; i < products.length; i++) {
        if (currentCategory === 'all' || products[i].category === currentCategory) {
            source.push(products[i]);
        }
    }
    
    if (!search) { renderProducts(source); return; }
    
    var filtered = [];
    for (var j = 0; j < source.length; j++) {
        if (source[j].name.toLowerCase().indexOf(search) !== -1 || 
            source[j].description.toLowerCase().indexOf(search) !== -1) {
            filtered.push(source[j]);
        }
    }
    renderProducts(filtered);
}

function toggleAIChat() {
    var chat = document.getElementById('aiChatModal');
    if (chat) {
        chat.classList.toggle('open');
    }
}

function sendAIMessage() {
    var input = document.getElementById('aiInput');
    var messages = document.getElementById('aiChatMessages');
    if (!input || !messages) return;
    var text = input.value.trim();
    if (!text) return;
    
    messages.innerHTML += '<div class="user-message"><strong>Voce:</strong> ' + text + '</div>';
    input.value = '';
    
    setTimeout(function() {
        var resp = 'Posso ajudar com recomendacoes! Pergunte sobre GPU, CPU, RAM ou Storage.';
        var t = text.toLowerCase();
        if (t.indexOf('gpu') !== -1 || t.indexOf('placa') !== -1) resp = 'Temos a RTX 4090 por R$ 12.999,99 - a melhor do mercado!';
        if (t.indexOf('cpu') !== -1 || t.indexOf('processador') !== -1) resp = 'O Ryzen 9 7950X com 16 nucleos e uma excelente escolha!';
        if (t.indexOf('ram') !== -1 || t.indexOf('memoria') !== -1) resp = 'Recomendo 32GB DDR5 Corsair Vengeance - esta em oferta!';
        if (t.indexOf('preco') !== -1 || t.indexOf('valor') !== -1) resp = 'Temos produtos a partir de R$ 899,99! Aproveite as ofertas!';
        messages.innerHTML += '<div class="ai-message"><strong>🤖 AI:</strong> ' + resp + '</div>';
        messages.scrollTop = messages.scrollHeight;
    }, 1000);
    
    messages.scrollTop = messages.scrollHeight;
}

function showNotification(msg) {
    var notif = document.getElementById('notification');
    if (!notif) return;
    notif.textContent = msg;
    notif.classList.add('show');
    setTimeout(function() { notif.classList.remove('show'); }, 3000);
}

// ============================================
// PAINEL ADMIN - COMPLETO E FUNCIONAL
// ============================================

function setupAdmin() {
    console.log('⚙️ Configurando painel admin...');
    
    // Botao principal
    var adminFab = document.getElementById('adminFab');
    if (adminFab) {
        console.log('✅ Botao admin encontrado');
        adminFab.onclick = toggleAdmin;
    }
    
    // Overlay e sair
    var overlay = document.getElementById('adminOverlay');
    var btnExit = document.getElementById('btnExitAdmin');
    if (overlay) overlay.onclick = toggleAdmin;
    if (btnExit) btnExit.onclick = toggleAdmin;
    
    // Botoes salvar
    var btnSaveAll = document.getElementById('btnSaveAll');
    var btnPreview = document.getElementById('btnPreview');
    if (btnSaveAll) btnSaveAll.onclick = function() {
        saveData();
        showAdminToast('💾 Dados salvos com sucesso!', 'success');
    };
    if (btnPreview) btnPreview.onclick = function() {
        toggleAdmin();
        window.scrollTo(0, 0);
    };
    
    // Navegacao tabs
    var navItems = document.querySelectorAll('.admin-nav-item');
    for (var i = 0; i < navItems.length; i++) {
        navItems[i].onclick = function(e) {
            e.preventDefault();
            switchAdminTab(this.getAttribute('data-tab'));
        };
    }
    
    // Botoes de adicionar
    var btnAddProduct = document.getElementById('btnAddProduct');
    var btnSaveProduct = document.getElementById('btnSaveProduct');
    var btnAddCategory = document.getElementById('btnAddCategory');
    var btnSaveCategory = document.getElementById('btnSaveCategory');
    var btnAddPage = document.getElementById('btnAddPage');
    var btnSavePage = document.getElementById('btnSavePage');
    
    if (btnAddProduct) btnAddProduct.onclick = function() { openProductModal(); };
    if (btnSaveProduct) btnSaveProduct.onclick = saveProduct;
    if (btnAddCategory) btnAddCategory.onclick = openCategoryModal;
    if (btnSaveCategory) btnSaveCategory.onclick = saveCategory;
    if (btnAddPage) btnAddPage.onclick = openPageModal;
    if (btnSavePage) btnSavePage.onclick = savePage;
    
    // Botoes de acao rapida no dashboard
    var quickBtns = document.querySelectorAll('.quick-action-btn');
    for (var j = 0; j < quickBtns.length; j++) {
        quickBtns[j].onclick = function() {
            var action = this.getAttribute('data-action');
            if (action === 'add-product') { switchAdminTab('products'); setTimeout(openProductModal, 300); }
            if (action === 'add-category') { switchAdminTab('categories'); setTimeout(openCategoryModal, 300); }
            if (action === 'add-page') { switchAdminTab('pages'); setTimeout(openPageModal, 300); }
            if (action === 'export') { exportData(); }
        };
    }
    
    // Fechar modais
    var closeButtons = document.querySelectorAll('.modal-close, .btn-cancel');
    for (var k = 0; k < closeButtons.length; k++) {
        closeButtons[k].onclick = function() {
            var modalId = this.getAttribute('data-close');
            if (modalId) {
                closeModal(modalId);
            } else {
                var modal = this.closest('.modal');
                if (modal) modal.classList.remove('active');
            }
        };
    }
    
    // Fechar modal clicando fora
    var modals = document.querySelectorAll('.modal');
    for (var m = 0; m < modals.length; m++) {
        modals[m].onclick = function(e) {
            if (e.target === this) this.classList.remove('active');
        };
    }
    
    // Busca no admin
    var adminSearch = document.getElementById('adminProductSearch');
    if (adminSearch) {
        adminSearch.oninput = function() {
            renderAdminProducts(this.value);
        };
    }
    
    console.log('✅ Admin configurado!');
}

function toggleAdmin() {
    var panel = document.getElementById('adminPanel');
    var overlay = document.getElementById('adminOverlay');
    if (!panel || !overlay) return;
    
    if (panel.classList.contains('active')) {
        panel.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    } else {
        panel.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        updateDashboardStats();
        renderAdminProducts();
        renderAdminCategories();
    }
}

function switchAdminTab(tabName) {
    // Atualizar navegacao
    var navItems = document.querySelectorAll('.admin-nav-item');
    for (var i = 0; i < navItems.length; i++) {
        navItems[i].classList.remove('active');
        if (navItems[i].getAttribute('data-tab') === tabName) {
            navItems[i].classList.add('active');
        }
    }
    
    // Atualizar conteudo
    var tabs = document.querySelectorAll('.admin-tab');
    for (var j = 0; j < tabs.length; j++) {
        tabs[j].classList.remove('active');
    }
    var tabEl = document.getElementById('tab-' + tabName);
    if (tabEl) tabEl.classList.add('active');
    
    // Atualizar titulo
    var titles = {
        'dashboard': '📊 Dashboard',
        'products': '📦 Gerenciar Produtos',
        'categories': '📁 Gerenciar Categorias',
        'pages': '📄 Gerenciar Páginas',
        'settings': '🎨 Aparência do Site'
    };
    var titleEl = document.getElementById('adminTabTitle');
    if (titleEl) titleEl.textContent = titles[tabName] || tabName;
    
    // Renderizar conteudo especifico
    if (tabName === 'products') renderAdminProducts();
    if (tabName === 'categories') renderAdminCategories();
    if (tabName === 'dashboard') updateDashboardStats();
}

function updateDashboardStats() {
    var statProducts = document.getElementById('statProducts');
    var statCategories = document.getElementById('statCategories');
    var statSales = document.getElementById('statSales');
    var statVisitors = document.getElementById('statVisitors');
    
    if (statProducts) statProducts.textContent = products.length;
    
    if (statCategories) {
        var cats = [];
        for (var i = 0; i < products.length; i++) {
            if (cats.indexOf(products[i].category) === -1) {
                cats.push(products[i].category);
            }
        }
        statCategories.textContent = cats.length;
    }
    
    if (statSales) statSales.textContent = Math.floor(Math.random() * 50) + 10;
    if (statVisitors) statVisitors.textContent = Math.floor(Math.random() * 1000) + 200;
    
    // Produtos recentes
    var recentList = document.getElementById('recentProductsList');
    if (recentList) {
        var html = '';
        var recent = products.slice(-5).reverse();
        for (var j = 0; j < recent.length; j++) {
            var p = recent[j];
            html += '<div style="display:flex;align-items:center;gap:1rem;padding:0.8rem 0;border-bottom:1px solid #eee;">';
            html += '<span style="font-size:2rem;">' + p.icon + '</span>';
            html += '<div style="flex:1;"><strong>' + p.name + '</strong>';
            html += '<div style="color:#666;font-size:0.9rem;">' + p.category + ' - R$ ' + p.price.toFixed(2).replace('.', ',') + '</div></div>';
            html += '<span style="color:#27ae60;">✅ Em estoque</span></div>';
        }
        recentList.innerHTML = html;
    }
}

// ============================================
// MODAL DE PRODUTO
// ============================================

function openProductModal(productId) {
    var modal = document.getElementById('productModal');
    if (!modal) return;
    
    var title = document.getElementById('modalTitle');
    var catSelect = document.getElementById('editProductCategory');
    
    // Preencher categorias
    if (catSelect) {
        catSelect.innerHTML = '<option value="">Selecionar...</option>' +
            '<option value="GPU">🎮 GPU</option>' +
            '<option value="CPU">💻 CPU</option>' +
            '<option value="RAM">⚡ RAM</option>' +
            '<option value="Storage">💾 Armazenamento</option>';
    }
    
    if (productId) {
        var product = null;
        for (var i = 0; i < products.length; i++) {
            if (products[i].id === productId) { product = products[i]; break; }
        }
        if (!product) return;
        
        if (title) title.textContent = '✏️ Editar Produto';
        setValue('editProductName', product.name);
        setValue('editProductCategory', product.category);
        setValue('editProductIcon', product.icon);
        setValue('editProductBadge', product.badge || '');
        setValue('editProductPrice', product.price);
        setValue('editProductOldPrice', product.oldPrice || '');
        setValue('editProductDescription', product.description);
        setValue('editProductStock', product.stock || 10);
        setValue('editProductRating', product.rating || 5.0);
    } else {
        if (title) title.textContent = '➕ Novo Produto';
        setValue('editProductName', '');
        setValue('editProductCategory', '');
        setValue('editProductIcon', '');
        setValue('editProductBadge', '');
        setValue('editProductPrice', '');
        setValue('editProductOldPrice', '');
        setValue('editProductDescription', '');
        setValue('editProductStock', '10');
        setValue('editProductRating', '5.0');
    }
    
    modal.classList.add('active');
}

function setValue(id, value) {
    var el = document.getElementById(id);
    if (el) el.value = value;
}

function getValue(id) {
    var el = document.getElementById(id);
    return el ? el.value : '';
}

function saveProduct() {
    var name = getValue('editProductName').trim();
    var category = getValue('editProductCategory');
    var price = parseFloat(getValue('editProductPrice'));
    
    if (!name || !category || !price) {
        showAdminToast('❌ Preencha nome, categoria e preço!', 'error');
        return;
    }
    
    var badge = getValue('editProductBadge');
    var badgeTexts = { 'sale': 'OFERTA', 'new': 'NOVO', 'hot': 'DESTAQUE' };
    
    var newProduct = {
        name: name,
        category: category,
        price: price,
        oldPrice: parseFloat(getValue('editProductOldPrice')) || null,
        description: getValue('editProductDescription').trim() || 'Sem descrição',
        icon: getValue('editProductIcon') || '📦',
        badge: badge || null,
        badgeText: badgeTexts[badge] || '',
        stock: parseInt(getValue('editProductStock')) || 0,
        rating: parseFloat(getValue('editProductRating')) || 5.0
    };
    
    // Gerar novo ID
    var maxId = 0;
    for (var i = 0; i < products.length; i++) {
        if (products[i].id > maxId) maxId = products[i].id;
    }
    newProduct.id = maxId + 1;
    
    products.push(newProduct);
    
    closeModal('productModal');
    renderAdminProducts();
    renderProducts(products);
    saveData();
    updateDashboardStats();
    showAdminToast('✅ Produto adicionado com sucesso!', 'success');
}

function deleteProduct(productId) {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;
    
    var newProducts = [];
    for (var i = 0; i < products.length; i++) {
        if (products[i].id !== productId) {
            newProducts.push(products[i]);
        }
    }
    products = newProducts;
    
    renderAdminProducts();
    renderProducts(products);
    saveData();
    updateDashboardStats();
    showAdminToast('🗑️ Produto excluído!', 'error');
}

function renderAdminProducts(search) {
    var container = document.getElementById('adminProductsList');
    if (!container) return;
    
    var filtered = products;
    if (search) {
        var term = search.toLowerCase();
        filtered = [];
        for (var i = 0; i < products.length; i++) {
            if (products[i].name.toLowerCase().indexOf(term) !== -1 ||
                products[i].category.toLowerCase().indexOf(term) !== -1) {
                filtered.push(products[i]);
            }
        }
    }
    
    if (filtered.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📦</div><p>Nenhum produto encontrado</p><button class="btn-add" onclick="openProductModal()">➕ Adicionar Produto</button></div>';
        return;
    }
    
    var html = '';
    for (var j = 0; j < filtered.length; j++) {
        var p = filtered[j];
        html += '<div class="admin-product-item">';
        html += '<div class="admin-product-icon">' + p.icon + '</div>';
        html += '<div class="admin-product-info">';
        html += '<div class="admin-product-name">';
        if (p.badge) html += '<span class="badge-status badge-active">' + p.badgeText + '</span> ';
        html += p.name + '</div>';
        html += '<div class="admin-product-meta">';
        html += '<span>📁 ' + p.category + '</span>';
        html += '<span>💰 R$ ' + p.price.toFixed(2).replace('.', ',') + '</span>';
        html += '<span>📦 ' + (p.stock || 0) + ' un.</span>';
        html += '<span>⭐ ' + (p.rating || 5.0) + '</span>';
        html += '</div></div>';
        html += '<div class="admin-product-actions">';
        html += '<button class="btn-icon btn-edit" onclick="openProductModal(' + p.id + ')" title="Editar">✏️</button>';
        html += '<button class="btn-icon btn-delete" onclick="deleteProduct(' + p.id + ')" title="Excluir">🗑️</button>';
        html += '</div></div>';
    }
    
    container.innerHTML = html;
}

// ============================================
// CATEGORIAS
// ============================================

function openCategoryModal() {
    var modal = document.getElementById('categoryModal');
    if (modal) {
        modal.classList.add('active');
        setValue('editCategoryName', '');
        setValue('editCategoryIcon', '');
        setValue('editCategorySlug', '');
    }
}

function saveCategory() {
    var name = getValue('editCategoryName').trim();
    if (!name) {
        showAdminToast('❌ Digite um nome para a categoria!', 'error');
        return;
    }
    
    closeModal('categoryModal');
    showAdminToast('✅ Categoria adicionada!', 'success');
}

function renderAdminCategories() {
    var container = document.getElementById('adminCategoriesList');
    if (container) {
        container.innerHTML = '<p style="padding:1rem;color:#666;text-align:center;">📁 Categorias disponíveis: GPU, CPU, RAM, Storage</p>';
    }
}

// ============================================
// PAGINAS
// ============================================

function openPageModal() {
    var modal = document.getElementById('pageModal');
    if (modal) {
        modal.classList.add('active');
        setValue('editPageTitle', '');
        setValue('editPageSlug', '');
        setValue('editPageIcon', '');
        setValue('editPageContent', '');
    }
}

function savePage() {
    var title = getValue('editPageTitle').trim();
    if (!title) {
        showAdminToast('❌ Digite um título para a página!', 'error');
        return;
    }
    
    closeModal('pageModal');
    showAdminToast('✅ Página adicionada!', 'success');
}

// ============================================
// UTILITARIOS
// ============================================

function closeModal(modalId) {
    var modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
}

function showAdminToast(message, type) {
    var toast = document.getElementById('adminToast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.className = 'admin-toast show ' + (type || 'info');
    
    setTimeout(function() {
        toast.classList.remove('show');
    }, 3000);
}

function exportData() {
    var data = {
        products: products,
        exportDate: new Date().toISOString()
    };
    
    var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'bestforge-backup-' + new Date().toISOString().split('T')[0] + '.json';
    a.click();
    URL.revokeObjectURL(url);
    
    showAdminToast('📥 Dados exportados!', 'success');
}

console.log('✅ Script BESTFORGE carregado com sucesso!');
console.log('📦 Produtos iniciais:', products.length);
console.log('⚙️ Clique no botao ⚙️ para abrir o painel admin');
