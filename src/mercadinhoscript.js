let products = JSON.parse(localStorage.getItem('products')) || [];

const productList = document.getElementById("productList");
const modal = document.getElementById("modal");
const productForm = document.getElementById("productForm");
const productId = document.getElementById("productId");
const name = document.getElementById("name");
const price = document.getElementById("price");
const quantity = document.getElementById("quantity");
const imageUrl = document.getElementById("imageUrl");

function renderProducts() {
  productList.innerHTML = "";
  products.forEach(p => {
    const card = document.createElement("div");
    card.className = "bg-white p-3 rounded shadow text-center w-60"; 

    card.innerHTML = `
      <img src="${p.imageUrl || "https://placehold.co/150"}" class="w-full h-32 object-cover rounded mb-2">
      <h4 class="font-bold">${p.name}</h4>
      <p class="text-green-600">R$ ${p.price.toFixed(2)}</p>
      <p class="text-sm text-gray-600">Quantidade: ${p.quantity}</p>
      <div class="flex justify-center gap-2 mt-2">
        <button onclick="editProduct(${p.id})" class="bg-green-500 text-white px-2 py-1 rounded text-sm">📝</button>
        <button onclick="deleteProduct(${p.id})" class="bg-red-500 text-white px-2 py-1 rounded text-sm">🗑️</button>
      </div>
    `;
    productList.appendChild(card);
  });
}


function openModal(title, product = null) {
  document.getElementById("modalTitle").textContent = title;
  if (product) {
    productId.value = product.id;
    name.value = product.name;
    price.value = product.price;
    quantity.value = product.quantity;
    imageUrl.value = product.imageUrl;
  } else {
    productForm.reset();
    productId.value = "";
  }
  modal.classList.remove("hidden");
}

function saveProduct(e) {
  e.preventDefault();
  const newProduct = {
    id: productId.value ? parseInt(productId.value) : Date.now(),
    name: name.value,
    price: parseFloat(price.value),
    quantity: parseInt(quantity.value),
    imageUrl: imageUrl.value
  };
  if (productId.value) {
    const index = products.findIndex(p => p.id === newProduct.id);
    products[index] = newProduct;
    Swal.fire({
      icon: "success",
      title: "Produto atualizado!",
      text: `${newProduct.name} foi editado com sucesso.`,
      timer: 2000,
      showConfirmButton: false
    });
  } else {
    products.push(newProduct);
    Swal.fire({
      icon: "success",
      title: "Produto adicionado!",
      text: `${newProduct.name} foi cadastrado.`,
      timer: 2000,
      showConfirmButton: false
    });
  }
  localStorage.setItem("products", JSON.stringify(products));
  modal.classList.add("hidden");
  renderProducts();
}

function editProduct(id) {
  const product = products.find(p => p.id === id);
  openModal("Editar Produto", product);
}

function deleteProduct(id) {
  Swal.fire({
    title: "Você tem certeza?",
    text: "Essa ação não poderá ser desfeita!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#30d63eff",
    confirmButtonText: "Sim, excluir",
    cancelButtonText: "Cancelar"
  }).then((result) => {
    if (result.isConfirmed) {
      products = products.filter(p => p.id !== id);
      localStorage.setItem("products", JSON.stringify(products));
      renderProducts();
      Swal.fire({
        icon: "success",
        title: "Excluído!",
        text: "O produto foi removido.",
        timer: 2000,
        showConfirmButton: false
      });
    }
  });
}

document.getElementById("addBtn").onclick = () => openModal("Adicionar Produto");
document.getElementById("cancelBtn").onclick = () => modal.classList.add("hidden");
productForm.onsubmit = saveProduct;

renderProducts();
