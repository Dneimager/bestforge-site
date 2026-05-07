var products = [
    { id: 1, name: 'RTX 4090', category: 'GPU', price: 12999.99, image: '', icon: '🎮', description: 'Placa de video top', stock: 15 },
    { id: 2, name: 'Ryzen 9 7950X', category: 'CPU', price: 4599.99, image: '', icon: '💻', description: 'Processador 16 nucleos', stock: 25 }
];

var cart = [];
var currentCategory = 'all';
var activeEditId = null;

window.onload = function() {
    loadData();
    renderProducts(products);
    setupButtons();
    setupAdmin();
    updateCartUI();
};

function loadData() {
    var saved = localStorage.getItem('bestforge_products');
    if (saved) products = JSON.parse(saved);
}

function saveData() {
    localStorage.setItem('bestforge_products', JSON.stringify(products));
}

function setupButtons() {
    document.getElementById('cartBtn').onclick = toggleCart;
    document.getElementById('closeCart').onclick = toggleCart;
    document.getElementById('adminFab').onclick = toggleAdmin;
    document.getElementById('btnExitAdmin').onclick = toggleAdmin;
    document.getElementById('btnAddProduct').onclick = () => openProductModal(null);
    document.getElementById('btnSaveProduct').onclick = saveProduct;
    
    // Filtro de categorias
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.onclick = function() {
            currentCategory = this.getAttribute('data-category');
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filterProducts();
        };
    });
}

function renderProducts(list) {
    var grid = document.getElementById('productsGrid');
    if (!grid) return;
    grid.innerHTML = list.map(p => `
        <div class="product-card">
            <div class="product-image">
                ${p.image ? `<img src="${p.image}" style="width:100%;height:100%;object-fit:cover;">` : `<span>${p.icon}</span>`}
            </div>
            <div class="product-info">
                <small>${p.category}</small>
                <h3>${p.name}</h3>
                <p>${p.description}</p>
                <div class="product-price">R$ ${p.price.toFixed(2)}</div>
                <button onclick="addToCart(${p.id})">🛒 Adicionar</button>
            </div>
        </div>
    `).join('');
}

function openProductModal(id) {
    activeEditId = id;
    const modal = document.getElementById('productModal');
    const title = document.getElementById('modalTitle');
    
    if (id) {
        const p = products.find(prod => prod.id === id);
        title.textContent = "✏️ Editar Produto";
        setValue('editProductName', p.name);
        setValue('editProductCategory', p.category);
        setValue('editProductImage', p.image || '');
        setValue('editProductIcon', p.icon);
        setValue('editProductPrice', p.price);
        setValue('editProductDescription', p.description);
    } else {
        title.textContent = "➕ Novo Produto";
        ['editProductName','editProductImage','editProductIcon','editProductPrice','editProductDescription'].forEach(i => setValue(i, ''));
    }
    modal.classList.add('active');
}

function saveProduct() {
    const pData = {
        id: activeEditId || Date.now(),
        name: getValue('editProductName'),
        category: getValue('editProductCategory'),
        image: getValue('editProductImage'),
        icon: getValue('editProductIcon') || '📦',
        price: parseFloat(getValue('editProductPrice')) || 0,
        description: getValue('editProductDescription')
    };

    if (activeEditId) {
        const index = products.findIndex(p => p.id === activeEditId);
        products[index] = pData;
    } else {
        products.push(pData);
    }

    saveData();
    renderProducts(products);
    renderAdminProducts();
    closeModal('productModal');
    showAdminToast("Salvo com sucesso!");
}

function renderAdminProducts() {
    const list = document.getElementById('adminProductsList');
    list.innerHTML = products.map(p => `
        <div class="admin-product-item" style="display:flex; justify-content:space-between; padding:10px; border-bottom:1px solid #eee;">
            <span>${p.icon} ${p.name}</span>
            <div>
                <button onclick="openProductModal(${p.id})">✏️</button>
                <button onclick="deleteProduct(${p.id})">🗑️</button>
            </div>
        </div>
    `).join('');
}

function deleteProduct(id) {
    if(confirm("Excluir?")) {
        products = products.filter(p => p.id !== id);
        saveData();
        renderProducts(products);
        renderAdminProducts();
    }
}

function applyAllSettings() {
    const color = getValue('editPrimaryColor');
    const name = getValue('editStoreName');
    document.documentElement.style.setProperty('--primary-color', color);
    if(name) document.getElementById('storeNameDisplay').textContent = name;
    showAdminToast("Aparência atualizada!");
}

// Helpers
function toggleAdmin() { document.getElementById('adminPanel').classList.toggle('active'); renderAdminProducts(); }
function toggleCart() { document.getElementById('cartModal').classList.toggle('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }
function setValue(id, v) { document.getElementById(id).value = v; }
function getValue(id) { return document.getElementById(id).value; }
function showAdminToast(m) { alert(m); } // Simplificado para o exemplo
function updateCartUI() { /* Lógica de UI do carrinho aqui */ }
function filterProducts() {
    const filtered = currentCategory === 'all' ? products : products.filter(p => p.category === currentCategory);
    renderProducts(filtered);
}
