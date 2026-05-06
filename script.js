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
    
