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

function performSave(isEditing = false) {
  const prefix = isEditing ? "_edit" : "";

  const nosaukumsEl = document.getElementById("nosaukums" + prefix);
  const daudzumsEl = document.getElementById("daudzums" + prefix);
  const cenaEl = document.getElementById("cena" + prefix);
  const datumsEl = document.getElementById("datums" + prefix);

  if (!nosaukumsEl || !daudzumsEl || !cenaEl || !datumsEl) {
    alert("Nepieciešamie lauki nav atrasti!");
    return;
  }

  const nosaukums = nosaukumsEl.value.trim();
  const daudzums = parseInt(daudzumsEl.value, 10);
  const cena = parseFloat(cenaEl.value);
  const datums = datumsEl.value;

  if (!nosaukums || isNaN(daudzums) || isNaN(cena) || !datums) {
    alert("Lūdzu, aizpildi visus laukus pareizi.");
    return;
  }

  const book = {
    id: isEditing ? currentEditId : nextId,
    Nosaukums: nosaukums,
    Daudzums: daudzums,
    Cena: cena,
    Datums: datums,
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
  closeModal(isEditing ? "confirmEditModal" : "bookInputModal");
}

function filterBooks() {
  const searchNosaukums = document.getElementById("searchNosaukums").value.toLowerCase();
  const searchDaudzumsMin = parseInt(document.getElementById("searchDaudzumsMin").value) || 0;
  const searchDaudzumsMax = parseInt(document.getElementById("searchDaudzumsMax").value) || Infinity;
  const searchCenaMin = parseFloat(document.getElementById("searchCenaMin").value) || 0;
  const searchCenaMax = parseFloat(document.getElementById("searchCenaMax").value) || Infinity;
  const searchDatumsNo = document.getElementById("searchDatumsNo").value;
  const searchDatumsLidz = document.getElementById("searchDatumsLidz").value;

  const tbody = document.querySelector("#gramatuApkopojums tbody");
  tbody.innerHTML = "";

  books
    .filter(book => {
      const matchesNosaukums = book.Nosaukums.toLowerCase().includes(searchNosaukums);
      const matchesDaudzums = book.Daudzums >= searchDaudzumsMin && book.Daudzums <= searchDaudzumsMax;
      const matchesCena = book.Cena >= searchCenaMin && book.Cena <= searchCenaMax;

      const bookDate = new Date(book.Datums);
      const fromDate = searchDatumsNo ? new Date(searchDatumsNo) : null;
      const toDate = searchDatumsLidz ? new Date(searchDatumsLidz) : null;

      const matchesDatums =
        (!fromDate || bookDate >= fromDate) &&
        (!toDate || bookDate <= toDate);

      return matchesNosaukums && matchesDaudzums && matchesCena && matchesDatums;
    })
    .forEach(book => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="text-center">${book.id}</td>
        <td class="text-left">${book.Nosaukums}</td>
        <td class="text-center">${book.Daudzums}</td>
        <td class="text-center">€${book.Cena.toFixed(2)}</td>
        <td class="text-center">${book.Datums}</td>
        <td class="text-center">
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
    modal.classList.remove("show");
    setTimeout(() => {
      modal.style.display = "none";
    }, 300);
  }
}
function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove("show");
    setTimeout(() => {
      modal.style.display = "none";
    }, 300);   }
}
function showModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.style.display = "flex";          !
    setTimeout(() => {
      modal.classList.add("show");          
    }, 10);
    }
}
function saveBook(event) {
  event.preventDefault();

  const isEditing = !!document.getElementById("mainit").value;
  performSave(isEditing);

 
}
function performSave(isEditing = false) {
  // Priekš daudzuma lauka pielieto prefix, pārējiem – bez
  const prefixDaudzums = isEditing ? "_edit" : "";

  const nosaukumsEl = document.getElementById("nosaukums");
  const daudzumsEl = document.getElementById("daudzums" + prefixDaudzums);
  const cenaEl = document.getElementById("cena");
  const datumsEl = document.getElementById("datums");

  if (!nosaukumsEl || !daudzumsEl || !cenaEl || !datumsEl) {
    alert("Nepieciešamie lauki nav atrasti!");
    return;
  }

  const nosaukums = nosaukumsEl.value.trim();
  const daudzums = parseInt(daudzumsEl.value, 10);
  const cena = parseFloat(cenaEl.value);
  const datums = datumsEl.value;

  if (!nosaukums || isNaN(daudzums) || isNaN(cena) || !datums) {
    alert("Lūdzu, aizpildi visus laukus pareizi.");
    return;
  }

  const book = {
    id: isEditing ? currentEditId : nextId,
    Nosaukums: nosaukums,
    Daudzums: daudzums,
    Cena: cena,
    Datums: datums,
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
  closeModal(isEditing ? "confirmEditModal" : "bookInputModal");
}