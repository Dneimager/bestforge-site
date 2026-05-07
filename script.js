// 1. FUNÇÃO PARA APLICAR AS CORES DO TEMA (VINCULADA AO SEU HTML)
function applyAllSettings() {
    const primary = getValue('editPrimaryColor');
    const secondary = getValue('editSecondaryColor');
    const bg1 = getValue('editBgColor1');
    const bg2 = getValue('editBgColor2');
    const storeName = getValue('editStoreName');

    // Aplica as cores como variáveis no root do CSS
    document.documentElement.style.setProperty('--primary-color', primary);
    document.documentElement.style.setProperty('--secondary-color', secondary);
    
    // Atualiza os textos do site na hora
    if(storeName) {
        document.getElementById('storeNameDisplay').textContent = storeName;
        document.getElementById('footerStoreName').textContent = storeName;
    }

    showAdminToast('🎨 Visual atualizado!', 'success');
    saveData();
}

// 2. AJUSTE NA FUNÇÃO DE SALVAR PRODUTO (PARA EDITAR OU CRIAR)
function saveProduct() {
    var name = getValue('editProductName').trim();
    var category = getValue('editProductCategory');
    var price = parseFloat(getValue('editProductPrice'));
    
    // Pegamos o título do modal para saber se é edição ou novo
    var isEdit = document.getElementById('modalTitle').textContent.includes('Editar');
    var currentId = isEdit ? parseInt(activeEditId) : (Math.max(...products.map(p => p.id), 0) + 1);

    if (!name || !category || !price) {
        showAdminToast('❌ Preencha os campos obrigatórios!', 'error');
        return;
    }

    var badge = getValue('editProductBadge');
    var badgeTexts = { 'sale': 'OFERTA', 'new': 'NOVO', 'hot': 'DESTAQUE' };

    var productData = {
        id: currentId,
        name: name,
        category: category,
        price: price,
        oldPrice: parseFloat(getValue('editProductOldPrice')) || null,
        description: getValue('editProductDescription').trim(),
        icon: getValue('editProductIcon') || '📦',
        image: getValue('editProductImage'), // Adicione esse campo no seu modal se quiser usar links de imagens/renders
        badge: badge || null,
        badgeText: badgeTexts[badge] || '',
        stock: parseInt(getValue('editProductStock')) || 0,
        rating: parseFloat(getValue('editProductRating')) || 5.0
    };

    if (isEdit) {
        // Atualiza o produto existente
        var index = products.findIndex(p => p.id === currentId);
        products[index] = productData;
    } else {
        // Adiciona novo
        products.push(productData);
    }

    closeModal('productModal');
    renderAdminProducts();
    renderProducts(products);
    saveData();
    updateDashboardStats();
    showAdminToast(isEdit ? '✏️ Produto atualizado!' : '✅ Produto cadastrado!', 'success');
}

// Variável global para controle de edição
var activeEditId = null; 

// 3. AJUSTE NA FUNÇÃO DE ABRIR O MODAL
function openProductModal(productId) {
    var modal = document.getElementById('productModal');
    if (!modal) return;
    
    activeEditId = productId; // Guarda o ID que está sendo editado
    var title = document.getElementById('modalTitle');
    
    if (productId) {
        var p = products.find(prod => prod.id === productId);
        title.textContent = '✏️ Editar Produto';
        setValue('editProductName', p.name);
        setValue('editProductCategory', p.category);
        setValue('editProductIcon', p.icon);
        setValue('editProductPrice', p.price);
        // ... preencha os outros campos da mesma forma ...
    } else {
        title.textContent = '➕ Novo Produto';
        // ... limpa os campos para novo produto ...
    }
    modal.classList.add('active');
}
