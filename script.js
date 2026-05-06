// Product Data
const products = [
    {
        id: 1,
        name: 'GeForce RTX 4090',
        category: 'GPU',
        price: 12999.99,
        oldPrice: 14999.99,
        description: 'A placa de vídeo mais poderosa do mercado. 24GB GDDR6X, Ray Tracing, DLSS 3.',
        icon: '🎮',
        badge: 'sale',
        badgeText: 'OFERTA'
    },
    {
        id: 2,
        name: 'AMD Ryzen 9 7950X',
        category: 'CPU',
        price: 4599.99,
        oldPrice: null,
        description: '16 núcleos, 32 threads, clock até 5.7GHz. Performance extrema para criadores.',
        icon: '💻',
        badge: 'new',
        badgeText: 'NOVO'
    },
    {
        id: 3,
        name: 'Corsair Vengeance 32GB',
        category: 'RAM',
        price: 899.99,
        oldPrice: 1199.99,
        description: 'DDR5 6000MHz, RGB, otimizado para AMD e Intel. Latência ultra baixa.',
        icon: '⚡',
        badge: 'sale',
        badgeText: 'OFERTA'
    },
    {
        id: 4,
        name: 'Samsung 990 Pro 2TB',
        category: 'Storage',
        price: 1499.99,
        oldPrice: null,
        description: 'NVMe M.2, leitura 7450MB/s, escrita 6900MB/s. O SSD mais rápido.',
        icon: '💾',
        badge: 'new',
        badgeText: 'NOVO'
    },
    {
        id: 5,
        name: 'RTX 4070 Ti Super',
        category: 'GPU',
        price: 5999.99,
        oldPrice: 6999.99,
        description: '16GB GDDR6X, perfeita para QHD e 4K. Ray Tracing de última geração.',
        icon: '🎯',
        badge: 'sale',
        badgeText: 'OFERTA'
    },
    {
        id: 6,
        name: 'Intel Core i9-14900K',
        category: 'CPU',
        price: 4999.99,
        oldPrice: null,
        description: '24 núcleos (8P+16E), 32 threads, clock boost 6.0GHz. Gaming e produtividade.',
        icon: '🔥',
        badge: 'new',
        badgeText: 'NOVO'
    },
    {
        id: 7,
        name: 'G.Skill Trident Z5 64GB',
        category: 'RAM',
        price: 1999.99,
        oldPrice: 2499.99,
        description: 'Kit 2x32GB DDR5 6400MHz, RGB, CL32. Overclocking extremo.',
        icon: '🌈',
        badge: 'sale',
        badgeText: 'OFERTA'
    },
    {
        id: 8,
        name: 'WD Black SN850X 4TB',
        category: 'Storage',
        price: 2799.99,
        oldPrice: null,
        description: 'NVMe Gen4, leitura 7300MB/s, com dissipador. Ideal para games pesados.',
        icon: '🚀',
        badge: null,
        badgeText: ''
    }
];

// Cart State
let cart = [];
let currentCategory = 'all';

// AI Responses Database
const aiResponses = {
    default: "Interessante! Posso te ajudar escolhendo o melhor hardware para seu perfil. Me conte mais sobre o que você precisa!",
    gpu: "Temos excelentes GPUs! A RTX 4090 é nossa campeã de performance, mas a RTX 4070 Ti Super oferece ótimo custo-benefício para QHD.",
    cpu: "Processadores de última geração! O AMD Ryzen 9 7950X é incrível para produtividade, enquanto o Intel i9-14900K domina em jogos.",
    ram: "Memória RAM DDR5 de alta velocidade! Recomendo no mínimo 32GB para games atuais. A Corsair Vengeance é nossa mais vendida!",
    storage: "Armazenamento ultrarrápido! Os SSDs NVMe Gen4 como Samsung 990 Pro atingem velocidades impressionantes de 7450MB/s.",
    preco: "Temos opções para todos os orçamentos! Desde upgrades acessíveis até componentes premium. Posso filtrar por faixa de preço!",
    desconto: "Vários produtos estão em oferta! A RTX 4090 está com 13% OFF, e a Corsair Vengeance com 25% de desconto. Aproveite!",
    frete: "Frete grátis para compras acima de R$ 500,00! Entrega rápida para todo Brasil, com seguro incluso em produtos acima de R$ 2.000.",
    garantia: "Todos nossos produtos têm garantia oficial do fabricante! Mínimo de 1 ano, com extensão disponível para até 3 anos."
};

// Initialize App
function init() {
    renderProducts(products);
    updateCartUI();
    console.log('🚀 BESTFORGE inicializado com sucesso!');
    console.log('📦 Produtos carregados:', products.length);
    console.log('🛒 Carrinho pronto para compras!');
}

// Render Products
function renderProducts(productsToRender) {
    const grid = document.getElementById('productsGrid');
    
    if (!grid) {
        console.error('Grid de produtos não encontrada!');
        return;
    }
    
    if (productsToRender.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: white;">
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
                <div class="product-name">${product.name}</div>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <div class="product-price">
                        R$ ${product.price.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                        ${product.oldPrice ? `<span class="old-price">R$ ${product.oldPrice.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>` : ''}
                    </div>
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id}, this)">
                        🛒 Adicionar
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Add to Cart
function addToCart(productId, buttonElement) {
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        console.error('Produto não encontrado:', productId);
        return;
    }
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({...product, quantity: 1});
    }
    
    // Button animation
    if (buttonElement) {
        buttonElement.classList.add('added');
        buttonElement.innerHTML = '✓ Adicionado';
        setTimeout(() => {
            buttonElement.classList.remove('added');
            buttonElement.innerHTML = '🛒 Adicionar';
        }, 1500);
    }
    
    updateCartUI();
    showNotification(`${product.name} adicionado ao carrinho!`);
    
    // Save to localStorage
    saveCartToStorage();
}

// Remove from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    renderCartItems();
    saveCartToStorage();
    
    if (cart.length === 0) {
        showNotification('Carrinho esvaziado');
    }
}

// Update Cart UI
function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartCount || !cartTotal) return;
    
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = count;
    
    // Animate count change
    cartCount.style.animation = 'none';
    cartCount.offsetHeight; // Trigger reflow
    cartCount.style.animation = 'bounceIn 0.5s ease';
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `R$ ${total.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
}

// Render Cart Items
function renderCartItems() {
    const container = document.getElementById('cartItems');
    
    if (!container) return;

    /* Admin Panel Styles */
.admin-toggle {
    position: fixed;
    bottom: 2rem;
    left: 2rem;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: var(--dark);
    color: white;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    z-index: 5000;
    box-shadow: 0 10px 25px rgba(0,0,0,0.3);
    transition: all 0.3s ease;
    animation: float 3s ease-in-out infinite;
}

.admin-toggle:hover {
    transform: scale(1.1);
    box-shadow: 0 15px 35px rgba(0,0,0,0.4);
}

.admin-panel {
    position: fixed;
    top: 0;
    left: -600px;
    width: 600px;
    max-width: 90vw;
    height: 100vh;
    background: white;
    z-index: 6000;
    transition: left 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 5px 0 30px rgba(0,0,0,0.3);
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.admin-panel.open {
    left: 0;
}

.admin-header {
    background: var(--dark);
    color: white;
    padding: 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.admin-header button {
    background: none;
    border: none;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
    transition: transform 0.3s ease;
}

.admin-header button:hover {
    transform: rotate(90deg);
}

.admin-content {
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem;
}

.admin-form {
    background: #f8f9fa;
    padding: 1.5rem;
    border-radius: 15px;
    margin-bottom: 2rem;
}

.admin-form h3 {
    margin-bottom: 1.5rem;
    color: var(--primary);
}

.form-group {
    margin-bottom: 1.2rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: var(--dark);
    font-size: 0.9rem;
}

.form-group input,
.form-group select,
.form-group textarea {
    width: 100%;
    padding: 0.8rem;
    border: 2px solid #e0e0e0;
    border-radius: 10px;
    font-size: 0.95rem;
    transition: all 0.3s ease;
    font-family: inherit;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.1);
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
}

.form-actions {
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;
}

.btn-save {
    flex: 1;
    background: var(--success);
    color: white;
    border: none;
    padding: 0.8rem;
    border-radius: 10px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
}

.btn-save:hover {
    background: #27ae60;
    transform: translateY(-2px);
}

.btn-cancel {
    background: #95a5a6;
    color: white;
    border: none;
    padding: 0.8rem 1.5rem;
    border-radius: 10px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
}

.btn-cancel:hover {
    background: #7f8c8d;
}

.admin-products-list {
    margin-top: 1rem;
}

.admin-products-list h3 {
    margin-bottom: 1rem;
    color: var(--dark);
}

.admin-search input {
    width: 100%;
    padding: 0.8rem;
    border: 2px solid #e0e0e0;
    border-radius: 10px;
    margin-bottom: 1rem;
}

.admin-product-item {
    display: flex;
    align-items: center;
    padding: 1rem;
    background: white;
    border-radius: 10px;
    margin-bottom: 0.5rem;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    transition: all 0.3s ease;
    gap: 1rem;
}

.admin-product-item:hover {
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.admin-product-icon {
    font-size: 2rem;
    min-width: 50px;
    text-align: center;
}

.admin-product-info {
    flex: 1;
}

.admin-product-name {
    font-weight: 600;
    margin-bottom: 0.3rem;
}

.admin-product-price {
    color: var(--primary);
    font-weight: 600;
}

.admin-product-stock {
    font-size: 0.8rem;
    color: #666;
}

.admin-product-actions {
    display: flex;
    gap: 0.5rem;
}

.btn-edit, .btn-delete {
    padding: 0.5rem 0.8rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.3s ease;
}

.btn-edit {
    background: var(--primary);
    color: white;
}

.btn-edit:hover {
    background: #5a4bd1;
}

.btn-delete {
    background: var(--danger);
    color: white;
}

.btn-delete:hover {
    background: #c0392b;
}

/* Toast */
.toast {
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%) translateY(100px);
    background: var(--dark);
    color: white;
    padding: 1rem 2rem;
    border-radius: 10px;
    z-index: 7000;
    transition: transform 0.3s ease;
    font-weight: 500;
}

.toast.show {
    transform: translateX(-50%) translateY(0);
}

.toast.success {
    background: var(--success);
}

.toast.error {
    background: var(--danger);
}

/* Responsivo Admin */
@media (max-width: 768px) {
    .admin-panel {
        width: 100%;
        left: -100%;
    }
    
    .form-row {
        grid-template-columns: 1fr;
    }
}
