// Banco de dados inicial
let products = JSON.parse(localStorage.getItem('bestforge_products')) || [
    { id: 1, name: 'RTX 4090', category: 'GPU', price: 12999.99, image: '', icon: '🎮', description: 'O melhor render.' },
    { id: 2, name: 'Ryzen 9', category: 'CPU', price: 4599.99, image: '', icon: '💻', description: 'Poder puro.' }
];

let activeEditId = null;

// Ao carregar
window.onload = () => {
    renderSiteProducts(products);
    updateStats();
};

// --- FUNÇÕES DO SITE ---
function renderSiteProducts(list) {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = list.map(p => `
        <div class="product-card">
            <div class="product-image">
                ${p.image ? `<img src="${p.image}">` : `<span>${p.icon}</span>`}
            </div>
            <div class="product-info">
                <h3>${p.name}</h3>
                <p>R$ ${p.price.toFixed(2)}</p>
                <button>Comprar</button>
            </div>
        </div>
    `).join('');
}

function filterProducts(cat, btn) {
    document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filtered = cat === 'all' ? products : products.filter(p => p.category === cat);
    renderSiteProducts(filtered);
}

// --- FUNÇÕES DO ADMIN ---
function toggleAdmin() {
    document.getElementById('adminPanel').classList.toggle('active');
    document.getElementById('adminOverlay').classList.toggle('active');
    renderAdminList();
}

function switchTab(tabId) {
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
    document.getElementById('tab-' + tabId).classList.add('active');
}

function renderAdminList() {
    const list = document.getElementById('adminProductsList');
    list.innerHTML = products.map(p => `
        <div class="admin-item">
            <span>${p.icon} ${p.name}</span>
            <div>
                <button onclick="openProductModal(${p.id})">✏️</button>
                <button onclick="deleteProduct(${p.id})">🗑️</button>
            </div>
        </div>
    `).join('');
}

// --- O EDITOR (MODAL) ---
function openProductModal(id) {
    activeEditId = id;
    const modal = document.getElementById('productModal');
    modal.classList.add('active');

    if (id) {
        const p = products.find(prod => prod.id === id);
        document.getElementById('modalTitle').textContent = "✏️ Editar Produto";
        document.getElementById('editProductName').value = p.name;
        document.getElementById('editProductCategory').value = p.category;
        document.getElementById('editProductImage').value = p.image || '';
        document.getElementById('editProductIcon').value = p.icon;
        document.getElementById('editProductPrice').value = p.price;
        document.getElementById('editProductDescription').value = p.description;
    } else {
        document.getElementById('modalTitle').textContent = "➕ Novo Produto";
        document.querySelectorAll('.modal-body input, textarea').forEach(i => i.value = '');
    }
}

function saveProduct() {
    const pData = {
        id: activeEditId || Date.now(),
        name: document.getElementById('editProductName').value,
        category: document.getElementById('editProductCategory').value,
        image: document.getElementById('editProductImage').value,
        icon: document.getElementById('editProductIcon').value || '📦',
        price: parseFloat(document.getElementById('editProductPrice').value) || 0,
        description: document.getElementById('editProductDescription').value
    };

    if (activeEditId) {
        const idx = products.findIndex(p => p.id === activeEditId);
        products[idx] = pData;
    } else {
        products.push(pData);
    }

    localStorage.setItem('bestforge_products', JSON.stringify(products));
    renderSiteProducts(products);
    renderAdminList();
    closeModal();
    updateStats();
}

function deleteProduct(id) {
    if(confirm("Excluir item?")) {
        products = products.filter(p => p.id !== id);
        localStorage.setItem('bestforge_products', JSON.stringify(products));
        renderAdminList();
        renderSiteProducts(products);
        updateStats();
    }
}

function closeModal() {
    document.getElementById('productModal').classList.remove('active');
}

function applySettings() {
    const color = document.getElementById('editPrimaryColor').value;
    const name = document.getElementById('editStoreName').value;
    document.documentElement.style.setProperty('--primary-color', color);
    if(name) document.getElementById('storeNameDisplay').textContent = name;
}

function updateStats() {
    document.getElementById('statProducts').textContent = products.length;
}
