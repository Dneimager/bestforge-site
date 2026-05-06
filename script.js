// ============================================
// BESTFORGE - JAVASCRIPT COMPLETO COM ADMIN
// ============================================

// Dados dos produtos
let products = [
    {
        id: 1,
        name: 'GeForce RTX 4090',
        category: 'GPU',
        price: 12999.99,
        oldPrice: 14999.99,
        description: 'A placa de vídeo mais poderosa do mercado.',
        icon: '🎮',
        badge: 'sale',
        badgeText: 'OFERTA',
        stock: 15,
        rating: 4.9
    },
    {
        id: 2,
        name: 'AMD Ryzen 9 7950X',
        category: 'CPU',
        price: 4599.99,
        oldPrice: null,
        description: '16 núcleos, 32 threads.',
        icon: '💻',
        badge: 'new',
        badgeText: 'NOVO',
        stock: 25,
        rating: 4.8
    },
    {
        id: 3,
        name: 'Corsair Vengeance 32GB',
        category: 'RAM',
        price: 899.99,
        oldPrice: 1199.99,
        description: 'DDR5 6000MHz, RGB.',
        icon: '⚡',
        badge: 'sale',
        badgeText: 'OFERTA',
        stock: 50,
        rating: 4.7
    },
    {
        id: 4,
        name: 'Samsung 990 Pro 2TB',
        category: 'Storage',
        price: 1499.99,
        oldPrice: null,
        description: 'NVMe M.2, leitura 7450MB/s.',
        icon: '💾',
        badge: 'new',
        badgeText: 'NOVO',
        stock: 30,
        rating: 4.9
    },
    {
        id: 5,
        name: 'RTX 4070 Ti Super',
        category: 'GPU',
        price: 5999.99,
        oldPrice: 6999.99,
        description: '16GB GDDR6X, perfeita para QHD.',
        icon: '🎯',
        badge: 'sale',
        badgeText: 'OFERTA',
        stock: 20,
        rating: 4.6
    },
    {
        id: 6,
        name: 'Intel Core i9-14900K',
        category: 'CPU',
        price: 4999.99,
        oldPrice: null,
        description: '24 núcleos, clock 6.0GHz.',
        icon: '🔥',
        badge: 'new',
        badgeText: 'NOVO',
        stock: 18,
        rating: 4.8
    },
    {
        id: 7,
        name: 'G.Skill Trident Z5 64GB',
        category: 'RAM',
        price: 1999.99,
        oldPrice: 2499.99,
        description: 'DDR5 6400MHz, CL32.',
        icon: '🌈',
        badge: 'sale',
        badgeText: 'OFERTA',
        stock: 12,
        rating: 4.7
    },
    {
        id: 8,
        name: 'WD Black SN850X 4TB',
        category: 'Storage',
        price: 2799.99,
        oldPrice: null,
        description: 'NVMe Gen4, 7300MB/s.',
        icon: '🚀',
        badge: 'new',
        badgeText: 'NOVO',
        stock: 8,
        rating: 4.5
    }
];

// Estado do carrinho
let cart = [];
let currentCategory = 'all';

// ============================================
// INICIALIZAÇÃO DO SITE
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 BESTFORGE iniciando...');
    
    // Carregar dados salvos
    loadFromStorage();
    loadAdminData();
    
    // Renderizar produtos
    renderProducts(products);
    renderCategoriesButtons();
    
    // Atualizar UI do carrinho
    updateCartUI();
    
    // Configurar event listeners
    setupSiteEvents();
    
    // Inicializar Admin
    initAdmin();
    
    console.log('✅ BESTFORGE pronto!');
});

// ============================================
// EVENT LISTENERS DO SITE
// ============================================

function setupSiteEvents() {
    // Botão do carrinho
    document.getElementById('cartBtn').addEventListener('click', toggleCart);
    document.getElementById('closeCart').addEventListener('click', toggleCart);
    document.getElementById('cartOverlay').addEventListener('click', toggleCart);
    
    // Botão do chat AI
    document.getElementById('aiChatBtn').addEventListener('click', toggleAIChat);
    document.getElementById('closeAI').addEventListener('click', toggleAIChat);
    document.getElementById('aiSendBtn').addEventListener('click', sendAIMessage);
    
    // Finalizar compra
    document.getElementById('checkoutBtn').addEventListener('click', checkout);
    
    // Busca
    document.getElementById('searchBtn').addEventListener('click', filterProducts);
    document.getElementById('searchInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') filterProducts();
    });
    
    // Input AI - Enter para enviar
    document.getElementById('aiInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') sendAIMessage();
    });
}

// ============================================
// RENDERIZAÇÃO DE PRODUTOS
// ============================================

function renderProducts(productsToRender) {
    const grid = document.getElementById('productsGrid');
    
    if (!grid) {
        console.error('❌ Grid de produtos não encontrada!');
        return;
    }
    
    if (!productsToRender || productsToRender.length === 0) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <div class="empty-state-icon">📦</div>
                <h3 style="color: white;">Nenhum produto encontrado</h3>
                <p style="color: rgba(255,255,255,0.8);">Tente outros termos de busca ou categorias</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = productsToRender.map(product => `
        <div class="product-card">
            ${product.badge ? `<div class="product-badge ${product.badge}">${product.badgeText}</div>` : ''}
            <div class="product-image">
                ${product.icon}
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <div class="product-price">
                        R$ ${product.price.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                        ${product.oldPrice ? `<span class="old-price">R$ ${product.oldPrice.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>` : ''}
                    </div>
                    <button class="add-to-cart-btn" data-product-id="${product.id}">
                        🛒 Adicionar
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Adicionar event listeners aos botões de adicionar
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.dataset.productId);
            addToCart(productId, this);
        });
    });
}

function renderCategoriesButtons() {
    const container = document.getElementById('categoriesContainer');
    const categories = [...new Set(products.map(p => p.category))];
    
    let html = '<button class="category-btn active" data-category="all">Todos</button>';
    categories.forEach(cat => {
        html += `<button class="category-btn" data-category="${cat}">${cat}</button>`;
    });
    
    container.innerHTML = html;
    
    // Adicionar event listeners
    container.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            filterByCategory(this.dataset.category);
        });
    });
}

// ============================================
// CARRINHO
// ============================================

function addToCart(productId, buttonElement) {
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        console.error('❌ Produto não encontrado:', productId);
        return;
    }
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({...product, quantity: 1});
    }
    
    // Animação do botão
    if (buttonElement) {
        buttonElement.classList.add('added');
        buttonElement.textContent = '✓ Adicionado';
        setTimeout(() => {
            buttonElement.classList.remove('added');
            buttonElement.textContent = '🛒 Adicionar';
        }, 1500);
    }
    
    updateCartUI();
    saveToStorage();
    showNotification(`${product.name} adicionado ao carrinho!`);
}

function removeFromCart(productId) {
    const product = cart.find(item => item.id === productId);
    cart = cart.filter(item => item.id !== productId);
    
    updateCartUI();
    renderCartItems();
    saveToStorage();
    
    if (product) {
        showNotification(`${product.name} removido do carrinho`);
    }
}

function updateCartUI() {
    const countElement = document.getElementById('cartCount');
    const totalElement = document.getElementById('cartTotal');
    
    if (!countElement || !totalElement) return;
    
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    countElement.textContent = count;
    totalElement.textContent = `R$ ${total.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
}

function renderCartItems() {
    const container = document.getElementById('cartItems');
    
    if (!container) return;
    
    if (cart.length === 0) {
        container.innerHTML = '<p class="empty-cart">Carrinho vazio</p>';
        return;
    }
    
    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">${item.icon}</div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">
                    R$ ${item.price.toLocaleString('pt-BR', {minimumFractionDigits: 2})} x ${item.quantity}
                </div>
            </div>
            <button class="remove-item" data-product-id="${item.id}">🗑️</button>
        </div>
    `).join('');
    
    // Adicionar event listeners aos botões de remover
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.dataset.productId);
            removeFromCart(productId);
        });
    });
}

function toggleCart() {
    const cartModal = document.getElementById('cartModal');
    const overlay = document.getElementById('cartOverlay');
    
    if (!cartModal || !overlay) return;
    
    const isOpen = cartModal.classList.contains('open');
    
    if (isOpen) {
        cartModal.classList.remove('open');
        overlay.classList.remove('open');
    } else {
        renderCartItems();
        cartModal.classList.add('open');
        overlay.classList.add('open');
    }
}

function checkout() {
    if (cart.length === 0) {
        showNotification('Seu carrinho está vazio!', 'error');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    alert(`🎉 Pedido realizado com sucesso!\n\nTotal: R$ ${total.toLocaleString('pt-BR', {minimumFractionDigits: 2})}\n\nObrigado por comprar na BESTFORGE!`);
    
    cart = [];
    updateCartUI();
    saveToStorage();
    toggleCart();
    showNotification('Compra realizada com sucesso! 🎉');
}

// ============================================
// FILTROS E BUSCA
// ============================================

function filterByCategory(category) {
    currentCategory = category;
    
    // Atualizar botões ativos
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === category) {
            btn.classList.add('active');
        }
    });
    
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    let filtered = category === 'all' 
        ? products 
        : products.filter(p => p.category === category);
    
    if (searchTerm) {
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(searchTerm) || 
            p.description.toLowerCase().includes(searchTerm)
        );
    }
    
    renderProducts(filtered);
}

function filterProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    let filtered = currentCategory === 'all' 
        ? products 
        : products.filter(p => p.category === currentCategory);
    
    if (searchTerm) {
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(searchTerm) || 
            p.description.toLowerCase().includes(searchTerm)
        );
    }
    
    renderProducts(filtered);
}

// ============================================
// CHAT AI
// ============================================

function toggleAIChat() {
    const chatModal = document.getElementById('aiChatModal');
    if (chatModal) {
        chatModal.classList.toggle('open');
    }
}

function sendAIMessage() {
    const input = document.getElementById('aiInput');
    const messagesContainer = document.getElementById('aiChatMessages');
    
    if (!input || !messagesContainer) return;
    
    const message = input.value.trim();
    if (!message) return;
    
    // Adicionar mensagem do usuário
    messagesContainer.innerHTML += `
        <div class="user-message">
            <strong>Você:</strong> ${message}
        </div>
    `;
    
    // Simular resposta da AI
    setTimeout(() => {
        const response = generateAIResponse(message.toLowerCase());
        messagesContainer.innerHTML += `
            <div class="ai-message">
                <strong>🤖 AI:</strong> ${response}
            </div>
        `;
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 1000);
    
    input.value = '';
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function generateAIResponse(message) {
    if (message.includes('gpu') || message.includes('placa') || message.includes('vídeo')) {
        return 'Temos excelentes GPUs! A RTX 4090 é nossa campeã de performance, mas a RTX 4070 Ti Super oferece ótimo custo-benefício.';
    }
    if (message.includes('cpu') || message.includes('processador')) {
        return 'O AMD Ryzen 9 7950X é incrível para produtividade, enquanto o Intel i9-14900K domina em jogos.';
    }
    if (message.includes('ram') || message.includes('memória')) {
        return 'Recomendo no mínimo 32GB DDR5 para games atuais. A Corsair Vengeance é nossa mais vendida!';
    }
    if (message.includes('ssd') || message.includes('armazenamento') || message.includes('nvme')) {
        return 'Os SSDs NVMe Gen4 como Samsung 990 Pro atingem velocidades de 7450MB/s!';
    }
    if (message.includes('preço') || message.includes('valor') || message.includes('custo')) {
        return 'Temos opções para todos os orçamentos! A RTX 4090 está com 13% OFF e a Corsair Vengeance com 25% de desconto.';
    }
    if (message.includes('frete') || message.includes('entrega')) {
        return 'Frete grátis para compras acima de R$ 500! Entrega rápida para todo Brasil.';
    }
    
    return 'Interessante! Posso te ajudar com recomendações de hardware. Me diga qual tipo de componente você procura!';
}

// ============================================
// NOTIFICAÇÕES
// ============================================

function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    
    if (!notification) return;
    
    notification.textContent = message;
    notification.style.background = type === 'error' ? '#e74c3c' : '#2ecc71';
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// ============================================
// PERSISTÊNCIA DE DADOS
// ============================================

function saveToStorage() {
    try {
        localStorage.setItem('bestforge_cart', JSON.stringify(cart));
        localStorage.setItem('bestforge_products', JSON.stringify(products));
    } catch (e) {
        console.error('Erro ao salvar dados:', e);
    }
}

function loadFromStorage() {
    try {
        const savedCart = localStorage.getItem('bestforge_cart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
        }
        
        const savedProducts = localStorage.getItem('bestforge_products');
        if (savedProducts) {
            products = JSON.parse(savedProducts);
        }
    } catch (e) {
        console.error('Erro ao carregar dados:', e);
        cart = [];
    }
}

// ============================================
// PAINEL ADMINISTRATIVO - LÓGICA
// ============================================

// Estado do Admin
const adminState = {
    isOpen: false,
    currentTab: 'dashboard',
    editingProduct: null,
    editingCategory: null,
    editingPage: null,
    categories: [
        { name: 'GPU', slug: 'gpu', icon: '🎮', active: true },
        { name: 'CPU', slug: 'cpu', icon: '💻', active: true },
        { name: 'RAM', slug: 'ram', icon: '⚡', active: true },
        { name: 'Storage', slug: 'storage', icon: '💾', active: true }
    ],
    pages: [
        { title: 'Home', slug: 'home', icon: '🏠', active: true, content: '' },
        { title: 'Produtos', slug: 'produtos', icon: '📦', active: true, content: '' },
        { title: 'Sobre', slug: 'sobre', icon: 'ℹ️', active: false, content: '' }
    ],
    settings: {
        storeName: 'BESTFORGE',
        slogan: 'Hardware de Alta Performance',
        heroDescription: 'Os melhores componentes para seu setup gamer e workstation profissional',
        primaryColor: '#6c5ce7',
        secondaryColor: '#a8e6cf',
        bgColor1: '#667eea',
        bgColor2: '#764ba2'
    }
};

// Inicializar Admin
function initAdmin() {
    console.log('⚙️ Painel Admin inicializado');
    loadAdminData();
    setupAdminEvents();
    updateDashboardStats();
    applyAllSettings();
}

// Carregar dados salvos
function loadAdminData() {
    const saved = localStorage.getItem('bestforge_admin');
    if (saved) {
        const data = JSON.parse(saved);
        if (data.categories) adminState.categories = data.categories;
        if (data.pages) adminState.pages = data.pages;
        if (data.settings) adminState.settings = data.settings;
    }
}

// Salvar dados do admin
function saveAdminData() {
    localStorage.setItem('bestforge_admin', JSON.stringify({
        categories: adminState.categories,
        pages: adminState.pages,
        settings: adminState.settings
    }));
}

// Setup de eventos do admin
function setupAdminEvents() {
    // Abrir/Fechar painel
    document.getElementById('adminFab').addEventListener('click', toggleAdmin);
    document.getElementById('adminOverlay').addEventListener('click', toggleAdmin);
    document.getElementById('btnExitAdmin').addEventListener('click', toggleAdmin);
    
    // Navegação das tabs
    document.querySelectorAll('.admin-nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            switchTab(this.dataset.tab);
        });
    });
    
    // Botões de ação rápida
    document.querySelectorAll('.quick-action-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.dataset.action;
            if (action === 'add-product') {
                switchTab('products');
                setTimeout(() => openProductModal(), 300);
            } else if (action === 'add-category') {
                switchTab('categories');
                setTimeout(() => openCategoryModal(), 300);
            } else if (action === 'add-page') {
                switchTab('pages');
                setTimeout(() => openPageModal(), 300);
            } else if (action === 'export') {
                exportData();
            }
        });
    });
    
    // Botões de adicionar
    document.getElementById('btnAddProduct').addEventListener('click', () => openProductModal());
    document.getElementById('btnAddCategory').addEventListener('click', openCategoryModal);
    document.getElementById('btnAddPage').addEventListener('click', openPageModal);
    
    // Salvar
    document.getElementById('btnSaveAll').addEventListener('click', saveAllData);
    document.getElementById('btnSaveProduct').addEventListener('click', saveProduct);
    document.getElementById('btnSaveCategory').addEventListener('click', saveCategory);
    document.getElementById('btnSavePage').addEventListener('click', savePage);
    
    // Preview
    document.getElementById('btnPreview').addEventListener('click', () => {
        toggleAdmin();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // Fechar modais
    document.querySelectorAll('.modal-close, .btn-cancel').forEach(btn => {
        btn.addEventListener('click', function() {
            const modalId = this.dataset.close;
            if (modalId) {
                closeModal(modalId);
            } else {
                this.closest('.modal').classList.remove('active');
            }
        });
    });
    
    // Fechar modal ao clicar fora
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
            }
        });
    });
    
    // Auto slug para categoria
    document.getElementById('editCategoryName').addEventListener('input', function() {
        document.getElementById('editCategorySlug').value = 
            this.value.toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');
    });
    
    // Auto slug para página
    document.getElementById('editPageTitle').addEventListener('input', function() {
        document.getElementById('editPageSlug').value = 
            this.value.toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');
    });
    
    // Busca de produtos no admin
    document.getElementById('adminProductSearch').addEventListener('input', function() {
        renderAdminProducts(this.value);
    });
}

// Toggle Admin
function toggleAdmin() {
    adminState.isOpen = !adminState.isOpen;
    
    document.getElementById('adminPanel').classList.toggle('active', adminState.isOpen);
    document.getElementById('adminOverlay').classList.toggle('active', adminState.isOpen);
    
    if (adminState.isOpen) {
        updateDashboardStats();
        renderAdminProducts();
        renderAdminCategories();
        renderAdminPages();
        loadSettingsToForm();
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
        applyAllSettings();
        renderCategoriesButtons();
        renderProducts(products);
    }
}

// Switch Tab
function switchTab(tabName) {
    adminState.currentTab = tabName;
    
    // Atualizar navegação
    document.querySelectorAll('.admin-nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.tab === tabName);
    });
    
    // Atualizar tabs
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    const tabElement = document.getElementById(`tab-${tabName}`);
    if (tabElement) tabElement.classList.add('active');
    
    // Atualizar título
    const titles = {
        dashboard: '📊 Dashboard',
        products: '📦 Gerenciar Produtos',
        categories: '📁 Gerenciar Categorias',
        pages: '📄 Gerenciar Páginas',
        settings: '🎨 Aparência do Site'
    };
    document.getElementById('adminTabTitle').textContent = titles[tabName] || tabName;
    
    // Renderizar conteúdo
    if (tabName === 'products') renderAdminProducts();
    if (tabName === 'categories') renderAdminCategories();
    if (tabName === 'pages') renderAdminPages();
    if (tabName === 'settings') loadSettingsToForm();
    if (tabName === 'dashboard') updateDashboardStats();
}

// Dashboard Stats
function updateDashboardStats() {
    document.getElementById('statProducts').textContent = products.length;
    document.getElementById('statCategories').textContent = 
        [...new Set(products.map(p => p.category))].length;
    document.getElementById('statSales').textContent = 
        Math.floor(Math.random() * 50) + 10;
    document.getElementById('statVisitors').textContent = 
        Math.floor(Math.random() * 1000) + 200;
    
    // Produtos recentes
    const recentList = document.getElementById('recentProductsList');
    if (recentList) {
        const recent = products.slice(-5).reverse();
        recentList.innerHTML = recent.map(p => `
            <div style="display: flex; align-items: center; gap: 1rem; padding: 0.8rem 0; border-bottom: 1px solid #eee;">
                <span style="font-size: 2rem;">${p.icon}</span>
                <div style="flex: 1;">
                    <strong>${p.name}</strong>
                    <div style="color: #666; font-size: 0.9rem;">${p.category} - R$ ${p.price.toLocaleString('pt-BR')}</div>
                </div>
                <span style="color: #27ae60; font-weight: 600;">Em estoque</span>
            </div>
        `).join('');
    }
}

// ============================================
// PRODUTOS (ADMIN)
// ============================================

function openProductModal(productId = null) {
    const modal = document.getElementById('productModal');
    const title = document.getElementById('modalTitle');
    
    // Popular categorias
    const categorySelect = document.getElementById('editProductCategory');
    categorySelect.innerHTML = '<option value="">Selecionar...</option>' + 
        adminState.categories.map(cat => `<option value="${cat.name}">${cat.icon} ${cat.name}</option>`).join('');
    
    if (productId) {
        // Editar
        const product = products.find(p => p.id === productId);
        if (!product) return;
        
        adminState.editingProduct = product;
        title.textContent = '✏️ Editar Produto';
        document.getElementById('editProductName').value = product.name;
        document.getElementById('editProductCategory').value = product.category;
        document.getElementById('editProductIcon').value = product.icon;
        document.getElementById('editProductBadge').value = product.badge || '';
        document.getElementById('editProductPrice').value = product.price;
        document.getElementById('editProductOldPrice').value = product.oldPrice || '';
        document.getElementById('editProductDescription').value = product.description;
        document.getElementById('editProductStock').value = product.stock || 0;
        document.getElementById('editProductRating').value = product.rating || 5.0;
    } else {
        // Novo
        adminState.editingProduct = null;
        title.textContent = '➕ Novo Produto';
        // Limpar formulário
        ['editProductName', 'editProductIcon', 'editProductDescription'].forEach(id => {
            document.getElementById(id).value = '';
        });
        document.getElementById('editProductCategory').value = '';
        document.getElementById('editProductBadge').value = '';
        document.getElementById('editProductPrice').value = '';
        document.getElementById('editProductOldPrice').value = '';
        document.getElementById('editProductStock').value = '10';
        document.getElementById('editProductRating').value = '5.0';
    }
    
    modal.classList.add('active');
}

function saveProduct() {
    const name = document.getElementById('editProductName').value.trim();
    const category = document.getElementById('editProductCategory').value;
    const price = parseFloat(document.getElementById('editProductPrice').value);
    
    if (!name || !category || !price) {
        showAdminToast('❌ Preencha nome, categoria e preço!', 'error');
        return;
    }
    
    const badgeValue = document.getElementById('editProductBadge').value;
    const badgeTexts = { sale: 'OFERTA', new: 'NOVO', hot: 'DESTAQUE' };
    
    const productData = {
        name,
        category,
        price,
        oldPrice: parseFloat(document.getElementById('editProductOldPrice').value) || null,
        description: document.getElementById('editProductDescription').value.trim() || 'Sem descrição',
        icon: document.getElementById('editProductIcon').value || '📦',
        badge: badgeValue || null,
        badgeText: badgeTexts[badgeValue] || '',
        stock: parseInt(document.getElementById('editProductStock').value) || 0,
        rating: parseFloat(document.getElementById('editProductRating').value) || 5.0
    };
    
    if (adminState.editingProduct) {
        // Editar
        const index = products.findIndex(p => p.id === adminState.editingProduct.id);
        if (index !== -1) {
            products[index] = { ...products[index], ...productData };
            showAdminToast('✅ Produto atualizado!', 'success');
        }
    } else {
        // Novo
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        products.push({ id: newId, ...productData });
        showAdminToast('✅ Produto adicionado!', 'success');
    }
    
    closeModal('productModal');
    renderAdminProducts();
    renderProducts(products);
    renderCategoriesButtons();
    saveAllData();
}

function duplicateProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const newId = Math.max(...products.map(p => p.id)) + 1;
    products.push({ ...product, id: newId, name: product.name + ' (Cópia)' });
    
    renderAdminProducts();
    renderProducts(products);
    saveAllData();
    showAdminToast('📋 Produto duplicado!', 'success');
}

function deleteProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    if (confirm(`Excluir "${product.name}"? Esta ação não pode ser desfeita.`)) {
        products = products.filter(p => p.id !== productId);
        renderAdminProducts();
        renderProducts(products);
        renderCategoriesButtons();
        saveAllData();
        showAdminToast('🗑️ Produto excluído!', 'error');
    }
}

function renderAdminProducts(search = '') {
    const container = document.getElementById('adminProductsList');
    let filtered = products;
    
    if (search) {
        const term = search.toLowerCase();
        filtered = products.filter(p => 
            p.name.toLowerCase().includes(term) ||
            p.category.toLowerCase().includes(term)
        );
    }
    
    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📦</div>
                <p>Nenhum produto encontrado</p>
                <button class="btn-add" onclick="openProductModal()">➕ Adicionar Produto</button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filtered.map(product => `
        <div class="admin-product-item">
            <div class="admin-product-icon">${product.icon}</div>
            <div class="admin-product-info">
                <div class="admin-product-name">
                    ${product.badge ? `<span class="badge-status badge-active">${product.badgeText}</span> ` : ''}
                    ${product.name}
                </div>
                <div class="admin-product-meta">
                    <span>📁 ${product.category}</span>
                    <span>💰 R$ ${product.price.toLocaleString('pt-BR')}</span>
                    <span>📦 ${product.stock || 0} un.</span>
                    <span>⭐ ${product.rating || 5.0}</span>
                </div>
            </div>
            <div class="admin-product-actions">
                <button class="btn-icon btn-edit" onclick="openProductModal(${product.id})" title="Editar">✏️</button>
                <button class="btn-icon btn-duplicate" onclick="duplicateProduct(${product.id})" title="Duplicar">📋</button>
                <button class="btn-icon btn-delete" onclick="deleteProduct(${product.id})" title="Excluir">🗑️</button>
            </div>
        </div>
    `).join('');
}

// ============================================
// CATEGORIAS (ADMIN)
// ============================================

function openCategoryModal() {
    document.getElementById('categoryModal').classList.add('active');
    document.getElementById('editCategoryName').value = '';
    document.getElementById('editCategoryIcon').value = '';
    document.getElementById('editCategorySlug').value = '';
}

function saveCategory() {
    const name = document.getElementById('editCategoryName').value.trim();
    const icon = document.getElementById('editCategoryIcon').value || '📁';
    const slug = document.getElementById('editCategorySlug').value || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    if (!name) {
        showAdminToast('❌ Digite um nome para a categoria!', 'error');
        return;
    }
    
    // Verificar se já existe
    if (adminState.categories.find(c => c.name === name)) {
        showAdminToast('❌ Esta categoria já existe!', 'error');
        return;
    }
    
    adminState.categories.push({ name, slug, icon, active: true });
    closeModal('categoryModal');
    renderAdminCategories();
    renderCategoriesButtons();
    saveAllData();
    showAdminToast('✅ Categoria adicionada!', 'success');
}

function deleteCategory(index) {
    const cat = adminState.categories[index];
    if (confirm(`Excluir categoria "${cat.name}"?`)) {
        adminState.categories.splice(index, 1);
        renderAdminCategories();
        renderCategoriesButtons();
        saveAllData();
        showAdminToast('🗑️ Categoria excluída!', 'error');
    }
}

function renderAdminCategories() {
    const container = document.getElementById('adminCategoriesList');
    
    if (adminState.categories.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📁</div>
                <p>Nenhuma categoria cadastrada</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = adminState.categories.map((cat, index) => `
        <div class="admin-product-item">
            <div class="admin-product-icon">${cat.icon}</div>
            <div class="admin-product-info">
                <div class="admin-product-name">${cat.name}</div>
                <div class="admin-product-meta">
                    <span>🔗 /${cat.slug}</span>
                    <span class="badge-status ${cat.active ? 'badge-active' : 'badge-hidden'}">
                        ${cat.active ? 'Ativo' : 'Oculto'}
                    </span>
                </div>
            </div>
            <div class="admin-product-actions">
                <button class="btn-icon btn-delete" onclick="deleteCategory(${index})" title="Excluir">🗑️</button>
            </div>
        </div>
    `).join('');
}

// ============================================
// PÁGINAS (ADMIN)
// ============================================

function openPageModal() {
    document.getElementById('pageModal').classList.add('active');
    document.getElementById('editPageTitle').value = '';
    document.getElementById('editPageSlug').value = '';
    document.getElementById('editPageIcon').value = '';
    document.getElementById('editPageContent').value = '';
}

function savePage() {
    const title = document.getElementById('editPageTitle').value.trim();
    const slug = document.getElementById('editPageSlug').value || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const icon = document.getElementById('editPageIcon').value || '📄';
    const content = document.getElementById('editPageContent').value;
    
    if (!title) {
        showAdminToast('❌ Digite um título!', 'error');
        return;
    }
    
    adminState.pages.push({ title, slug, icon, content, active: false });
    closeModal('pageModal');
    renderAdminPages();
    saveAllData();
    showAdminToast('✅ Página adicionada!', 'success');
}

function deletePage(index) {
    if (confirm('Excluir esta página?')) {
        adminState.pages.splice(index, 1);
        renderAdminPages();
        saveAllData();
        showAdminToast('🗑️ Página excluída!', 'error');
    }
}

function renderAdminPages() {
    const container = document.getElementById('adminPagesList');
    
    if (adminState.pages.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📄</div>
                <p>Nenhuma página extra</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = adminState.pages.map((page, index) => `
        <div class="admin-product-item">
            <div class="admin-product-icon">${page.icon}</div>
            <div class="admin-product-info">
                <div class="admin-product-name">${page.title}</div>
                <div class="admin-product-meta">
                    <span>🔗 /${page.slug}</span>
                    <span class="badge-status ${page.active ? 'badge-active' : 'badge-hidden'}">
                        ${page.active ? 'Ativo' : 'Rascunho'}
                    </span>
                </div>
            </div>
            <div class="admin-product-actions">
                <button class="btn-icon btn-delete" onclick="deletePage(${index})" title="Excluir">🗑️</button>
            </div>
        </div>
    `).join('');
}

// ============================================
// CONFIGURAÇÕES (ADMIN)
// ============================================

function loadSettingsToForm() {
    document.getElementById('editStoreName').value = adminState.settings.storeName;
    document.getElementById('editSlogan').value = adminState.settings.slogan;
    document.getElementById('editHeroDescription').value = adminState.settings.heroDescription;
    document.getElementById('editPrimaryColor').value = adminState.settings.primaryColor;
    document.getElementById('editSecondaryColor').value = adminState.settings.secondaryColor;
    document.getElementById('editBgColor1').value = adminState.settings.bgColor1;
    document.getElementById('editBgColor2').value = adminState.settings.bgColor2;
}

function applyAllSettings() {
    // Atualizar estado
    adminState.settings.storeName = document.getElementById('editStoreName').value;
    adminState.settings.slogan = document.getElementById('editSlogan').value;
    adminState.settings.heroDescription = document.getElementById('editHeroDescription').value;
    adminState.settings.primaryColor = document.getElementById('editPrimaryColor').value;
    adminState.settings.secondaryColor = document.getElementById('editSecondaryColor').value;
    adminState.settings.bgColor1 = document.getElementById('editBgColor1').value;
    adminState.settings.bgColor2 = document.getElementById('editBgColor2').value;
    
    // Aplicar cores
    const root = document.documentElement;
    root.style.setProperty('--primary', adminState.settings.primaryColor);
    root.style.setProperty('--secondary', adminState.settings.secondaryColor);
    document.body.style.background = 
        `linear-gradient(135deg, ${adminState.settings.bgColor1}, ${adminState.settings.bgColor2})`;
    
    // Aplicar textos
    document.getElementById('storeNameDisplay').textContent = adminState.settings.storeName;
    document.getElementById('footerStoreName').textContent = adminState.settings.storeName;
    document.getElementById('heroTitle').textContent = '🚀 ' + adminState.settings.slogan;
    document.getElementById('heroDescription').textContent = adminState.settings.heroDescription;
    document.title = adminState.settings.storeName + ' - Hardware & Tecnologia';
    
    saveAllData();
    showAdminToast('🎨 Aparência atualizada!', 'success');
}

// ============================================
// UTILITÁRIOS DO ADMIN
// ============================================

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function showAdminToast(message, type = 'info') {
    const toast = document.getElementById('adminToast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.className = `admin-toast show ${type}`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function saveAllData() {
    localStorage.setItem('bestforge_products', JSON.stringify(products));
    localStorage.setItem('bestforge_cart', JSON.stringify(cart));
    saveAdminData();
    updateDashboardStats();
    showAdminToast('💾 Tudo salvo com sucesso!', 'success');
}

function exportData() {
    const data = {
        products,
        categories: adminState.categories,
        pages: adminState.pages,
        settings: adminState.settings,
        exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bestforge-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    showAdminToast('📥 Dados exportados com sucesso!', 'success');
}

// ============================================
// DEBUG & CONSOLE
// ============================================

console.log('📦 BESTFORGE - Sistema completo carregado!');
console.log('🛒 Site: ' + products.length + ' produtos disponíveis');
console.log('⚙️ Admin: Clique no botão ⚙️ para gerenciar');

// Expor funções úteis globalmente
window.cart = cart;
window.products = products;
window.adminState = adminState;
window.help = function() {
    console.log('🛟 Comandos disponíveis:');
    console.log('  cart - Ver carrinho');
    console.log('  products - Ver todos produtos');
    console.log('  adminState - Ver estado do admin');
    console.log('  toggleAdmin() - Abrir/fechar painel admin');
    console.log('  addToCart(id) - Adicionar produto ao carrinho');
    console.log('  filterByCategory("GPU") - Filtrar produtos');
};
