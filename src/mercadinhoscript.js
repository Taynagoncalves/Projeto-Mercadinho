const productTable = document.getElementById("productTable");
const tbody = productTable.querySelector("tbody");
const modal = document.getElementById("modal");
const productForm = document.getElementById("productForm");
const productId = document.getElementById("productId");
const name = document.getElementById("name");
const price = document.getElementById("price");
const quantity = document.getElementById("quantity");
const noProducts = document.getElementById("noProducts");


async function getProducts() {
  const res = await fetch("/api/products");
  return res.json();
}

async function addProduct(product) {
  const res = await fetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product)
  });
  return res.json();
}

async function updateProduct(id, product) {
  const res = await fetch(`/api/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product)
  });
  return res.json();
}

async function removeProduct(id) {
  const res = await fetch(`/api/products/${id}`, {
    method: "DELETE"
  });
  return res.json();
}


async function renderProducts() {
  const products = await getProducts();
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


async function saveProduct(e) {
  e.preventDefault();
  const newProduct = {
    name: name.value,
    price: parseFloat(price.value),
    quantity: parseInt(quantity.value)
  };

  if (productId.value) {
   
    await updateProduct(productId.value, newProduct);
    Swal.fire({
      icon: "success",
      title: "Produto atualizado!",
      text: `${newProduct.name} foi editado com sucesso.`,
      timer: 2000,
      showConfirmButton: false
    });
  } else {
  
    await addProduct(newProduct);
    Swal.fire({
      icon: "success",
      title: "Produto adicionado!",
      text: `${newProduct.name} foi cadastrado.`,
      timer: 2000,
      showConfirmButton: false
    });
  }

  modal.classList.add("hidden");
  renderProducts();
}


async function editProduct(id) {
  const products = await getProducts();
  const product = products.find(p => p.id === id);
  openModal("Editar Produto", product);
}


async function deleteProduct(id) {
  Swal.fire({
    title: "Você tem certeza?",
    text: "Essa ação não poderá ser desfeita!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#10b981",
    confirmButtonText: "Sim, excluir",
    cancelButtonText: "Cancelar"
  }).then(async (result) => {
    if (result.isConfirmed) {
      await removeProduct(id);
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
