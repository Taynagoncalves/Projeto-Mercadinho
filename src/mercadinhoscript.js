let products = JSON.parse(localStorage.getItem('products')) || [];

const productTable = document.getElementById("productTable");
const tbody = productTable.querySelector("tbody");
const modal = document.getElementById("modal");
const productForm = document.getElementById("productForm");
const productId = document.getElementById("productId");
const name = document.getElementById("name");
const price = document.getElementById("price");
const quantity = document.getElementById("quantity");
const noProducts = document.getElementById("noProducts");


function renderProducts() {
  tbody.innerHTML = "";
  if (products.length === 0) {
    noProducts.style.display = "block";
  } else {
    noProducts.style.display = "none";
    products.forEach(p => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${p.name}</td>
        <td>R$ ${p.price.toFixed(2)}</td>
        <td>${p.quantity}</td>
        <td>
          <button onclick="editProduct(${p.id})" class="btn-edit">Editar</button>
          <button onclick="deleteProduct(${p.id})" class="btn-delete">Excluir</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }
}

function openModal(title, product = null) {
  document.getElementById("modalTitle").textContent = title;
  if (product) {
    productId.value = product.id;
    name.value = product.name;
    price.value = product.price;
    quantity.value = product.quantity;
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
    quantity: parseInt(quantity.value)
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
    cancelButtonColor: "#10b981",
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
document.getElementById("closeModal").onclick = () => modal.classList.add("hidden");

productForm.onsubmit = saveProduct;

renderProducts();
