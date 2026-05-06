// ============================================
// BESTFORGE - JAVASCRIPT PRINCIPAL
// ============================================

// Dados dos produtos
const products = [
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
        stock: 15
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
        stock: 25
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
        stock: 50
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
        stock: 30
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
        stock: 20
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
        stock: 18
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
        stock: 12
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
        stock: 8
    }
];

// Estado do carrinho
let cart = [];
let currentCategory = 'all';

// ============================================
// INICIALIZAÇÃO
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 BESTFORGE iniciando...');
    
    // Carregar dados salvos
    loadFromStorage();
    
    // Renderizar produtos
    renderProducts(products);
    
    // Atualizar UI do carrinho
    updateCartUI();
    
    // Configurar event listeners
    setupEventListeners();
    
    console.log('✅ BESTFORGE pronto!');
});

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
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
    
    // Categorias
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            filterByCategory(this.dataset.category);
        });
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
            <div class="no-products">
                <h3>😕 Nenhum produto encontrado</h3>
                <p>Tente outros termos de busca ou categorias</p>
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
        if (
