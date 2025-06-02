let books = [];
let nextId = 1;
let currentEditId = null;
let modalAction = null;
let modalBookId = null;

function saveBook(event) {
  event.preventDefault();

  const isEditing = currentEditId !== null;

  const fieldPrefix = isEditing ? "_edit" : "";
  const nosaukums = document.getElementById("nosaukums" + fieldPrefix).value.trim();
  const daudzums = parseInt(document.getElementById("daudzums" + fieldPrefix).value) || 0;
  const cena = parseFloat(document.getElementById("cena" + fieldPrefix).value) || 0;
  const datums = document.getElementById("datums" + fieldPrefix).value;

  const book = {
    id: isEditing ? currentEditId : nextId,
    Nosaukums: nosaukums,
    Daudzums: daudzums,
    Cena: cena,
    Datums: datums
  };

  if (isEditing) {
    const index = books.findIndex(b => b.id === currentEditId);
    if (index !== -1) {
      books[index] = book;
    }
  } else {
    books.push(book);
    nextId++;
  }

  renderTable();
  clearForm();
  closeModal("editFormModal");
  currentEditId = null;

}

function renderTable() {
  const tbody = document.querySelector("#gramatuApkopojums tbody");
  tbody.innerHTML = "";

  books.forEach(book => {
    const row = document.createElement("tr");
    row.innerHTML = 
      <td>${book.id}</td>
      <td>${book.Nosaukums}</td>
      <td>${book.Daudzums}</td>
      <td>€${book.Cena.toFixed(2)}</td>
      <td>${book.Datums}</td>
      <td>
        <button onclick="editBook(${book.id})">Labot</button>
        <button onclick="dzest(${book.id})">Dzēst</button>
      </td>
    ;
    tbody.appendChild(row);
  });
}

function dzest(id) {
  modalAction = "delete";
  modalBookId = id;
  document.getElementById("modalText").textContent = "Vai tiešām vēlies dzēst šo ierakstu?";
  showModal("confirmationModal");
}

function dzestApstiprinajums(id) {
  books = books.filter(b => b.id !== id);
  renderTable();
}

function editBook(id) {
  modalAction = "edit";
  modalBookId = id;
  document.getElementById("modalText").textContent = "Vai tiešām vēlies labot šo ierakstu?";
  showModal("confirmationModal");
}

function Turpinat(id) {
  const book = books.find(b => b.id === id);
  if (!book) return;

  currentEditId = book.id;

  document.getElementById("nosaukums_edit").value = book.Nosaukums;
  document.getElementById("daudzums_edit").value = book.Daudzums;
  document.getElementById("cena_edit").value = book.Cena;
  document.getElementById("datums_edit").value = book.Datums;

  closeModal("confirmationModal")
  showModal("confirmEditModal");
}

function clearForm() {
  const ids = ["nosaukums", "daudzums", "cena", "datums", "nosaukums_edit", "daudzums_edit", "cena_edit", "datums_edit"];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
}

function showModal(id) {
  document.getElementById(id).style.display = "block";
}

function closeModal(id) {
  document.getElementById(id).style.display = "none";
  modalAction = null;
  modalBookId = null;
}

document.getElementById("confirmBtn").onclick = function () {
  if (modalAction === "delete") {
    dzestApstiprinajums(modalBookId);
    closeModal("confirmationModal");
  } else if (modalAction === "edit") {
    Turpinat(modalBookId); 
  }
};