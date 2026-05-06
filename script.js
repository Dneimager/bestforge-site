// ============================================
// BESTFORGE - JAVASCRIPT COMPLETO CORRIGIDO
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
    
    loadFromStorage();
    renderProducts(products);
    updateCartUI();
    setupSiteEvents();
    initAdmin();
    
    console.log('✅ BESTFORGE pronto!');
});

// ============================================
// SITE EVENTOS
// ============================================

function setupSiteEvents() {
    const cartBtn = document.getElementById('cartBtn');
    const closeCart = document.getElementById('closeCart');
    const cartOverlay = document.getElementById('cartOverlay');
    const aiChatBtn = document.getElementById('aiChatBtn');
    const closeAI = document.getElementById('closeAI');
    const aiSendBtn = document.getElementById('aiSendBtn');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    const aiInput = document.getElementById('aiInput');
    
    if (cartBtn) cartBtn.addEventListener('click', toggleCart);
    if (closeCart) closeCart.addEventListener('click', toggleCart);
    if (cartOverlay) cartOverlay.addEventListener('click', toggleCart);
    if (aiChatBtn) aiChatBtn.addEventListener('click', toggleAIChat);
    if (closeAI) closeAI.addEventListener('click', toggleAIChat);
    if (aiSendBtn) aiSendBtn.addEventListener('click', sendAIMessage);
    if (checkoutBtn) checkoutBtn.addEventListener('click', checkout);
    if (searchBtn) searchBtn.addEventListener('click', filterProducts);
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') filterProducts();
        });
    }
    
    if (aiInput) {
        aiInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') sendAIMessage();
        });
    }
    
    // Categorias
    document.querySelectorAll('.category-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            filterByCategory(this.dataset.category);
        });
    });
}

// ============================================
// RENDERIZAR PRODUTOS
// ============================================

function renderProducts(productsToRender) {
    var grid = document.getElementById('productsGrid');
    
    if (!grid) {
        console.error('Grid nao encontrada');
        return;
    }
    
    if (!productsToRender || productsToRender.length === 0) {
        grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:3rem;color:white;"><h3>Nenhum produto encontrado</h3></div>';
        return;
    }
    
    grid.innerHTML = productsToRender.map(function(product) {
        return '<div class="product-card">' +
            (product.badge ? '<div class="product-badge ' + product.badge + '">' + product.badgeText + '</div>' : '') +
            '<div class="product-image">' + product.icon + '</div>' +
            '<div class="product-info">' +
            '<div class="product-category">' + product.category + '</div>' +
            '<h3 class="product-name">' + product.name + '</h3>' +
            '<p class="product-description">' + product.description + '</p>' +
            '<div class="product-footer">' +
            '<div class="product-price">R$ ' + product.price.toLocaleString('pt-BR', {minimumFractionDigits: 2}) +
            (product.oldPrice ? '<span class="old-price">R$ ' + product.oldPrice.toLocaleString('pt-BR', {minimumFractionDigits: 2}) + '</span>' : '') +
            '</div>' +
            '<button class="add-to-cart-btn" data-product-id="' + product.id + '">🛒 Adicionar</button>' +
            '</div></div></div>';
    }).join('');
    
    document.querySelectorAll('.add-to-cart-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var productId = parseInt(this.dataset.productId);
            addToCart(productId, this);
        });
    });
}

// ============================================
// CARRINHO
// ============================================

function addToCart(productId, buttonElement) {
    var product = products.find(function(p) { return p.id === productId; });
    
    if (!product) {
        console.error('Produto nao encontrado:', productId);
        return;
    }
    
    var existingItem = cart.find(function(item) { return item.id === productId; });
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({id: product.id, name: product.name, price: product.price, icon: product.icon, category: product.category, quantity: 1});
    }
    
    if (buttonElement) {
        buttonElement.classList.add('added');
        buttonElement.textContent = '✓ Adicionado';
        setTimeout(function() {
            buttonElement.classList.remove('added');
            buttonElement.textContent = '🛒 Adicionar';
        }, 1500);
    }
    
    updateCartUI();
    saveToStorage();
    showNotification(product.name + ' adicionado ao carrinho!');
}

function removeFromCart(productId) {
    cart = cart.filter(function(item) { return item.id !== productId; });
    updateCartUI();
    renderCartItems();
    saveToStorage();
}

function updateCartUI() {
    var countElement = document.getElementById('cartCount');
    var totalElement = document.getElementById('cartTotal');
    
    if (!countElement || !totalElement) return;
    
    var count = cart.reduce(function(total, item) { return total + item.quantity; }, 0);
    var total = cart.reduce(function(sum, item) { return sum + (item.price * item.quantity); }, 0);
    
    countElement.textContent = count;
    totalElement.textContent = 'R$ ' + total.toLocaleString('pt-BR', {minimumFractionDigits: 2});
}

function renderCartItems() {
    var container = document.getElementById('cartItems');
    
    if (!container) return;
    
    if (cart.length === 0) {
        container.innerHTML = '<p class="empty-cart">Carrinho vazio</p>';
        return;
    }
    
    container.innerHTML = cart.map(function(item) {
        return '<div class="cart-item">' +
            '<div class="cart-item-image">' + item.icon + '</div>' +
            '<div class="cart-item-info">' +
            '<div class="cart-item-name">' + item.name + '</div>' +
            '<div class="cart-item-price">R$ ' + item.price.toLocaleString('pt-BR', {minimumFractionDigits: 2}) + ' x ' + item.quantity + '</div>' +
            '</div>' +
            '<button class="remove-item" data-product-id="' + item.id + '">🗑️</button>' +
            '</div>';
    }).join('');
    
    document.querySelectorAll('.remove-item').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var productId = parseInt(this.dataset.productId);
            removeFromCart(productId);
        });
    });
}

function toggleCart() {
    var cartModal = document.getElementById('cartModal');
    var overlay = document.getElementById('cartOverlay');
    
    if (!cartModal || !overlay) return;
    
    var isOpen = cartModal.classList.contains('open');
    
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
    
    var total = cart.reduce(function(sum, item) { return sum + (item.price * item.quantity); }, 0);
    
    alert('🎉 Pedido realizado!\n\nTotal: R$ ' + total.toLocaleString('pt-BR', {minimumFractionDigits: 2}) + '\n\nObrigado!');
    
    cart = [];
    updateCartUI();
    saveToStorage();
    toggleCart();
}

// ============================================
// FILTROS
// ============================================

function filterByCategory(category) {
    currentCategory = category;
    
    document.querySelectorAll('.category-btn').forEach(function(btn) {
        btn.classList.remove('active');
        if (btn.dataset.category === category) {
            btn.classList.add('active');
        }
    });
    
    var searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    var filtered = category === 'all' ? products : products.filter(function(p) { return p.category === category; });
    
    if (searchTerm) {
        filtered = filtered.filter(function(p) {
            return p.name.toLowerCase().includes(searchTerm) || p.description.toLowerCase().includes(searchTerm);
        });
    }
    
    renderProducts(filtered);
}

function filterProducts() {
    var searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    var filtered = currentCategory === 'all' ? products : products.filter(function(p) { return p.category === currentCategory; });
    
    if (searchTerm) {
        filtered = filtered.filter(function(p) {
            return p.name.toLowerCase().includes(searchTerm) || p.description.toLowerCase().includes(searchTerm);
        });
    }
    
    renderProducts(filtered);
}

// ============================================
// CHAT AI
// ============================================

function toggleAIChat() {
    var chatModal = document.getElementById('aiChatModal');
    if (chatModal) {
        chatModal.classList.toggle('open');
    }
}

function sendAIMessage() {
    var input = document.getElementById('aiInput');
    var messagesContainer = document.getElementById('aiChatMessages');
    
    if (!input || !messagesContainer) return;
    
    var message = input.value.trim();
    if (!message) return;
    
    messagesContainer.innerHTML += '<div class="user-message"><strong>Você:</strong> ' + message + '</div>';
    
    setTimeout(function() {
        var response = generateAIResponse(message.toLowerCase());
        messagesContainer.innerHTML += '<div class="ai-message"><strong>🤖 AI:</strong> ' + response + '</div>';
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 1000);
    
    input.value = '';
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function generateAIResponse(message) {
    if (message.includes('gpu') || message.includes('placa')) return 'Temos excelentes GPUs! A RTX 4090 é nossa campeã.';
    if (message.includes('cpu') || message.includes('processador')) return 'O AMD Ryzen 9 7950X é incrível para produtividade.';
    if (message.includes('ram') || message.includes('memória')) return 'Recomendo no mínimo 32GB DDR5 para games.';
    if (message.includes('preço') || message.includes('valor')) return 'Temos opções para todos os orçamentos!';
    return 'Posso te ajudar com recomendações de hardware. Me diga o que procura!';
}

// ============================================
// NOTIFICAÇÕES
// ============================================

function showNotification(message, type) {
    type = type || 'success';
    var notification = document.getElementById('notification');
    
    if (!notification) return;
    
    notification.textContent = message;
    notification.style.background = type === 'error' ? '#e74c3c' : '#2ecc71';
    notification.classList.add('show');
    
    setTimeout(function() {
        notification.classList.remove('show');
    }, 3000);
}

// ============================================
// PERSISTÊNCIA
// ============================================

function saveToStorage() {
    try {
        localStorage.setItem('bestforge_cart', JSON.stringify(cart));
        localStorage.setItem('bestforge_products', JSON.stringify(products));
    } catch (e) {
        console.error('Erro ao salvar:', e);
    }
}

function loadFromStorage() {
    try {
        var savedCart = localStorage.getItem('bestforge_cart');
        if (savedCart) cart = JSON.parse(savedCart);
        
        var savedProducts = localStorage.getItem('bestforge_products');
        if (savedProducts) products = JSON.parse(savedProducts);
    } catch (e) {
        console.error('Erro ao carregar:', e);
    }
}

// ============================================
// PAINEL ADMIN
// ============================================

function initAdmin() {
    console.log('⚙️ Inicializando admin...');
    
    var adminFab = document.getElementById('adminFab');
    var adminOverlay = document.getElementById('adminOverlay');
    var btnExitAdmin = document.getElementById('btnExitAdmin');
    var btnSaveAll = document.getElementById('btnSaveAll');
    var btnPreview = document.getElementById('btnPreview');
    
    if (adminFab) {
        console.log('✅ Botao admin encontrado');
        adminFab.addEventListener('click', toggleAdmin);
    } else {
        console.error('❌ Botao admin NAO encontrado! ID: adminFab');
    }
    
    if (adminOverlay) {
        adminOverlay.addEventListener('click', toggleAdmin);
    }
    
    if (btnExitAdmin) {
        btnExitAdmin.addEventListener('click', toggleAdmin);
    }
    
    if (btnSaveAll) {
        btnSaveAll.addEventListener('click', function() {
            saveToStorage();
            showAdminToast('💾 Dados salvos!', 'success');
        });
    }
    
    if (btnPreview) {
        btnPreview.addEventListener('click', function() {
            toggleAdmin();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // Navegação das tabs
    document.querySelectorAll('.admin-nav-item').forEach(function(item) {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            switchAdminTab(this.dataset.tab);
        });
    });
    
    // Botões de adicionar
    var btnAddProduct = document.getElementById('btnAddProduct');
    var btnAddCategory = document.getElementById('btnAddCategory');
    var btnAddPage = document.getElementById('btnAddPage');
    var btnSaveProduct = document.getElementById('btnSaveProduct');
    var btnSaveCategory = document.getElementById('btnSaveCategory');
    var btnSavePage = document.getElementById('btnSavePage');
    
    if (btnAddProduct) btnAddProduct.addEventListener('click', openProductModal);
    if (btnAddCategory) btnAddCategory.addEventListener('click', openCategoryModal);
    if (btnAddPage) btnAddPage.addEventListener('click', openPageModal);
    if (btnSaveProduct) btnSaveProduct.addEventListener('click', saveProduct);
    if (btnSaveCategory) btnSaveCategory.addEventListener('click', saveCategory);
    if (btnSavePage) btnSavePage.addEventListener('click', savePage);
    
    // Fechar modais
    document.querySelectorAll('.modal-close, .btn-cancel').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var modalId = this.dataset.close;
            if (modalId) {
                closeModal(modalId);
            } else {
                var modal = this.closest('.modal');
                if (modal) modal.classList.remove('active');
            }
        });
    });
    
    // Fechar modal ao clicar fora
    document.querySelectorAll('.modal').forEach(function(modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
            }
        });
    });
    
    // Busca admin
    var adminSearch = document.getElementById('adminProductSearch');
    if (adminSearch) {
        adminSearch.addEventListener('input', function() {
            renderAdminProducts(this.value);
        });
    }
    
    console.log('✅ Admin inicializado!');
}

function toggleAdmin() {
    console.log('🔄 toggleAdmin chamado');
    
    var panel = document.getElementById('adminPanel');
    var overlay = document.getElementById('adminOverlay');
    
    if (!panel || !overlay) {
        console.error('❌ Panel ou overlay nao encontrados!');
        return;
    }
    
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
    }
}

function switchAdminTab(tabName) {
    document.querySelectorAll('.admin-nav-item').forEach(function(item) {
        item.classList.toggle('active', item.dataset.tab === tabName);
    });
    
    document.querySelectorAll('.admin-tab').forEach(function(tab) {
        tab.classList.remove('active');
    });
    
    var tabElement = document.getElementById('tab-' + tabName);
    if (tabElement) tabElement.classList.add('active');
    
    var titles = {
        dashboard: '📊 Dashboard',
        products: '📦 Gerenciar Produtos',
        categories: '📁 Gerenciar Categorias',
        pages: '📄 Gerenciar Páginas',
        settings: '🎨 Aparência do Site'
    };
    
    var titleElement = document.getElementById('adminTabTitle');
    if (titleElement) titleElement.textContent = titles[tabName] || tabName;
    
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
        var cats = products.map(function(p) { return p.category; });
        var uniqueCats = cats.filter(function(item, pos) { return cats.indexOf(item) === pos; });
        statCategories.textContent = uniqueCats.length;
    }
    
    if (statSales) statSales.textContent = Math.floor(Math.random() * 50) + 10;
    if (statVisitors) statVisitors.textContent = Math.floor(Math.random() * 1000) + 200;
}

function openProductModal(productId) {
    var modal = document.getElementById('productModal');
    if (!modal) return;
    
    var title = document.getElementById('modalTitle');
    var categorySelect = document.getElementById('editProductCategory');
    
    if (categorySelect) {
        categorySelect.innerHTML = '<option value="">Selecionar...</option>' +
            '<option value="GPU">🎮 GPU</option>' +
            '<option value="CPU">💻 CPU</option>' +
            '<option value="RAM">⚡ RAM</option>' +
            '<option value="Storage">💾 Armazenamento</option>';
    }
    
    if (productId) {
        var product = products.find(function(p) { return p.id === productId; });
        if (!product) return;
        
        if (title) title.textContent = '✏️ Editar Produto';
        
        setFieldValue('editProductName', product.name);
        setFieldValue('editProductCategory', product.category);
        setFieldValue('editProductIcon', product.icon);
        setFieldValue('editProductBadge', product.badge || '');
        setFieldValue('editProductPrice', product.price);
        setFieldValue('editProductOldPrice', product.oldPrice || '');
        setFieldValue('editProductDescription', product.description);
        setFieldValue('editProductStock', product.stock || 0);
        setFieldValue('editProductRating', product.rating || 5.0);
    } else {
        if (title) title.textContent = '➕ Novo Produto';
        clearModalFields();
    }
    
    modal.classList.add('active');
}

function setFieldValue(id, value) {
    var el = document.getElementById(id);
    if (el) el.value = value;
}

function clearModalFields() {
    var fields = ['editProductName', 'editProductIcon', 'editProductDescription', 'editProductPrice', 'editProductOldPrice'];
    fields.forEach(function(id) {
        setFieldValue(id, '');
    });
    setFieldValue('editProductCategory', '');
    setFieldValue('editProductBadge', '');
    setFieldValue('editProductStock', '10');
    setFieldValue('editProductRating', '5.0');
}

function saveProduct() {
    var name = getFieldValue('editProductName').trim();
    var category = getFieldValue('editProductCategory');
    var price = parseFloat(getFieldValue('editProductPrice'));
    
    if (!name || !category || !price) {
        showAdminToast('❌ Preencha nome, categoria e preço!', 'error');
        return;
    }
    
    var badgeValue = getFieldValue('editProductBadge');
    var badgeTexts = { sale: 'OFERTA', new: 'NOVO', hot: 'DESTAQUE' };
    
    var newProduct = {
        name: name,
        category: category,
        price: price,
        oldPrice: parseFloat(getFieldValue('editProductOldPrice')) || null,
        description: getFieldValue('editProductDescription').trim() || 'Sem descrição',
        icon: getFieldValue('editProductIcon') || '📦',
        badge: badgeValue || null,
        badgeText: badgeTexts[badgeValue] || '',
        stock: parseInt(getFieldValue('editProductStock')) || 0,
        rating: parseFloat(getFieldValue('editProductRating')) || 5.0
    };
    
    var newId = products.length > 0 ? Math.max.apply(null, products.map(function(p) { return p.id; })) + 1 : 1;
    newProduct.id = newId;
    
    products.push(newProduct);
    closeModal('productModal');
    renderAdminProducts();
    renderProducts(products);
    saveToStorage();
    showAdminToast('✅ Produto adicionado!', 'success');
}

function deleteProduct(productId) {
    var product = products.find(function(p) { return p.id === productId; });
    if (!product) return;
    
    if (confirm('Excluir "' + product.name + '"?')) {
        products = products.filter(function(p) { return p.id !== productId; });
        renderAdminProducts();
        renderProducts(products);
        saveToStorage();
        showAdminToast('🗑️ Produto excluído!', 'error');
    }
}

function renderAdminProducts(search) {
    var container = document.getElementById('adminProductsList');
    if (!container) return;
    
    var filtered = products;
    
    if (search) {
        var term = search.toLowerCase();
        filtered = products.filter(function(p) {
            return p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term);
        });
    }
    
    if (filtered.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📦</div><p>Nenhum produto</p></div>';
        return;
    }
    
    container.innerHTML = filtered.map(function(product) {
        return '<div class="admin-product-item">' +
            '<div class="admin-product-icon">' + product.icon + '</div>' +
            '<div class="admin-product-info">' +
            '<div class="admin-product-name">' + product.name + '</div>' +
            '<div class="admin-product-meta">' +
            '<span>📁 ' + product.category + '</span>' +
            '<span>💰 R$ ' + product.price.toLocaleString('pt-BR') + '</span>' +
            '<span>📦 ' + (product.stock || 0) + ' un.</span>' +
            '</div></div>' +
            '<div class="admin-product-actions">' +
            '<button class="btn-icon btn-delete" onclick="deleteProduct(' + product.id + ')">🗑️</button>' +
            '</div></div>';
    }).join('');
}

// Categorias
function openCategoryModal() {
    var modal = document.getElementById('categoryModal');
    if (modal) {
        modal.classList.add('active');
        setFieldValue('editCategoryName', '');
        setFieldValue('editCategoryIcon', '');
        setFieldValue('editCategorySlug', '');
    }
}

function saveCategory() {
    var name = getFieldValue('editCategoryName').trim();
    if (!name) {
        showAdminToast('❌ Digite um nome!', 'error');
        return;
    }
    
    closeModal('categoryModal');
    renderAdminCategories();
    showAdminToast('✅ Categoria adicionada!', 'success');
}

function renderAdminCategories() {
    var container = document.getElementById('adminCategoriesList');
    if (container) {
        container.innerHTML = '<p style="padding:1rem;color:#666;">Categorias: GPU, CPU, RAM, Storage</p>';
    }
}

// Páginas
function openPageModal() {
    var modal = document.getElementById('pageModal');
    if (modal) {
        modal.classList.add('active');
        setFieldValue('editPageTitle', '');
        setFieldValue('editPageSlug', '');
        setFieldValue('editPageIcon', '');
        setFieldValue('editPageContent', '');
    }
}

function savePage() {
    var title = getFieldValue('editPageTitle').trim();
    if (!title) {
        showAdminToast('❌ Digite um título!', 'error');
        return;
    }
    
    closeModal('pageModal');
    showAdminToast('✅ Página adicionada!', 'success');
}

// Utilitários
function getFieldValue(id) {
    var el = document.getElementById(id);
    return el ? el.value : '';
}

function closeModal(modalId) {
    var modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
}

function showAdminToast(message, type) {
    type = type || 'info';
    var toast = document.getElementById('adminToast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.className = 'admin-toast show ' + type;
    
    setTimeout(function() {
        toast.classList.remove('show');
    }, 3000);
}

function renderAdminPages() {
    var container = document.getElementById('adminPagesList');
    if (container) {
        container.innerHTML = '<p style="padding:1rem;color:#666;">Nenhuma página extra ainda.</p>';
    }
}

// Inicialização
console.log('✅ Script carregado com sucesso!');
