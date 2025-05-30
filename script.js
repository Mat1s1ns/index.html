let books = [];
let nextId = 1;
let modalAction = null;
let modalBookId = null;
let currentEditId = null;
document.addEventListener("DOMContentLoaded", () => {
  const poga = document.getElementById("apstiprinasanasPoga");
  if (poga) {
    poga.addEventListener("click", function () {
      if (modalAction === "edit") {
        Turpinat(modalBookId);
      } else if (modalAction === "delete") {
        dzestApstiprinajums(modalBookId);
        closeModal("confirmationModal");
      }
    });
  } else {
    console.warn("Poga 'apstiprinasanasPoga' netika atrasta");
  }
});

function performSave() {
  closeModal("confirmationModal");

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

  currentEditId = null;
  clearForm();
  filterBooks();
  closeModal("confirmEditModal");
}

function filterBooks() {
  const searchNosaukums = document.getElementById("searchNosaukums").value.toLowerCase();
  const searchDaudzums = document.getElementById("searchDaudzums").value;
  const searchCena = document.getElementById("searchCena").value;
  const searchDatums = document.getElementById("searchDatums").value;

  const tbody = document.querySelector("#gramatuApkopojums tbody");
  tbody.innerHTML = "";

  books
    .filter(book => {
      const matchesNosaukums = book.Nosaukums.toLowerCase().includes(searchNosaukums);
      const matchesDaudzums = searchDaudzums === "" || book.Daudzums.toString().startsWith(searchDaudzums);
      const matchesCena = searchCena === "" || book.Cena.toString().startsWith(searchCena);
      const matchesDatums = searchDatums === "" || book.Datums === searchDatums;
      return matchesNosaukums && matchesDaudzums && matchesCena && matchesDatums;
    })
    .forEach(book => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${book.id}</td>
        <td>${book.Nosaukums}</td>
        <td>${book.Daudzums}</td>
        <td>€${book.Cena.toFixed(2)}</td>
        <td>${book.Datums}</td>
        <td>
          <button onclick="editBook(${book.id})">Labot</button>
          <button onclick="dzest(${book.id})">Dzēst</button>
        </td>
      `;
      tbody.appendChild(row);
    });
}
function clearForm() {
  [
    "nosaukums", "daudzums", "cena", "datums",
    "nosaukums_edit", "daudzums_edit", "cena_edit", "datums_edit"
  ].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
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
  filterBooks();
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

  closeModal("confirmationModal");
  showModal("confirmEditModal");
  
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.style.display = "none";
  }
}

function showModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.style.display = "block";
  }
}

function saveBook(e) {
  e.preventDefault();
  performSave();
}