const products = [
  {
    id: 1,
    name: "Suporte 3D",
    price: 49.90,
    category: "3D",
    image: "https://via.placeholder.com/200",
    desc: "Suporte feito em impressão 3D",
    whatsapp: "5511999999999"
  },
  {
    id: 2,
    name: "Miniatura Carro",
    price: 89.90,
    category: "3D",
    image: "https://via.placeholder.com/200",
    desc: "Miniatura detalhada",
    whatsapp: "5511999999999"
  },
  {
    id: 3,
    name: "Ferramenta X",
    price: 29.90,
    category: "Ferramentas",
    image: "https://via.placeholder.com/200",
    desc: "Ferramenta útil",
    whatsapp: "5511999999999"
  }
];

const productContainer = document.getElementById("products");
const searchInput = document.getElementById("search");
const categoriesContainer = document.getElementById("categories");

let currentCategory = "all";

// Render produtos
function renderProducts() {
  productContainer.innerHTML = "";
  
  const filtered = products.filter(p => {
    return (currentCategory === "all" || p.category === currentCategory) &&
           p.name.toLowerCase().includes(searchInput.value.toLowerCase());
  });

  filtered.forEach(p => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <img src="${p.image}">
      <h3>${p.name}</h3>
      <p class="price">R$ ${p.price}</p>
    `;
    div.onclick = () => openModal(p);
    productContainer.appendChild(div);
  });
}

// Categorias
function renderCategories() {
  const cats = ["all", ...new Set(products.map(p => p.category))];
  
  cats.forEach(c => {
    const btn = document.createElement("button");
    btn.innerText = c;
    btn.onclick = () => {
      currentCategory = c;
      renderProducts();
    };
    categoriesContainer.appendChild(btn);
  });
}

// Modal
function openModal(p) {
  document.getElementById("modal").classList.remove("hidden");
  document.getElementById("modal-img").src = p.image;
  document.getElementById("modal-title").innerText = p.name;
  document.getElementById("modal-price").innerText = "R$ " + p.price;
  document.getElementById("modal-desc").innerText = p.desc;
  
  document.getElementById("whatsapp").href =
    `https://wa.me/${p.whatsapp}?text=Tenho interesse em ${p.name}`;
}

// Fechar modal
document.getElementById("close").onclick = () => {
  document.getElementById("modal").classList.add("hidden");
};

// Busca
searchInput.addEventListener("input", renderProducts);

// Init
renderCategories();
renderProducts();
