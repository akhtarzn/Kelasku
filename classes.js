const SUPABASE_URL = "https://vkcgirfabwquzumgsvgy.supabase.co";
const SUPABASE_KEY = "sb_publishable_YSnSFpK1kgADoDDDBPjoCA_33V0lMlc";

const tbody = document.getElementById("data-kelas");
const searchInput = document.getElementById("search-input");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const pageInfo = document.getElementById("page-info");

// State untuk Pagination
let allClasses = [];
let filteredClasses = [];
let currentPage = 1;
const itemsPerPage = 15; // Rata-rata jumlah siswa per kelas

const walasMap = {
  "199302e5-a658-49df-b7e0-7f78a903e4a0": "Indah Putri Maulidya S., S.Pd",
  "f71e7266-ebac-4b5f-ac87-a145a050700d": "Oty Meigan, S.Pd",
  "ccecce0c-2539-4edf-9f4f-a859cea9c194": "Fatimatuz Zahroh, M.Pd",
  "3b78243e-4f6b-42de-b0d1-bca088622555": "Sri Sulastri Yuliana, S.Pd",
  "4738de46-3770-40f9-a303-11dbd5f3878a": "Bagus Farouktiawan, S.Kom",
  "4456ee69-a22f-4910-b07f-02e429ad4911": "Agus Prijatmoko, S.Pd., M.M.",
  "35f66c22-40a4-40ed-bee3-938e3b512c1d": "Dra. Yanu Indriyati,  M.Pd.",
  "dcd9478a-0cf0-465f-bfdf-369fefcd1931": "Suprapti, S.Pd",
  "c9cf3273-c3ff-43db-98da-156f167a2f9e": "Denny Ratnasari, S.Pd",
  "7750b616-98ab-4a50-b803-fc3d81bf8489": "Idha Hariyani, S.Pd",
  "d4dee947-79ad-4583-b489-7d933de25c01": "Eka Rizky Rahmawati, S.Sos",
  "e49a2308-41e6-4a75-8a69-ad4af33b27de": "Dra. Mariah Ulfah"
};

function formatTanggal(isoString) {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit', month: 'short', year: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false
  }).format(date).replace(/\./g, ':');
}

function capitalize(text) {
  if (!text) return "";
  return text.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

// Fungsi Render Tabel dengan Pagination
function renderTable() {
  tbody.innerHTML = "";
  
  // Hitung index data yang akan ditampilkan
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredClasses.slice(startIndex, endIndex);

  if (paginatedData.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">Data tidak ditemukan 🔍</td></tr>`;
    updatePaginationControls(0);
    return;
  }

  paginatedData.forEach((classes, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>✅ ${capitalize(classed.name)}</td>
      <td>${classed.academic_year}</td>
      <td>${walasMap[classed.teacher_id] || "Tidak diketahui"}</td>
      <td>${formatTanggal(classed.created_at)}</td>
    `;
    tbody.appendChild(row);
  });

  updatePaginationControls(filteredClasses.length);
}

function updatePaginationControls(totalItems) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  pageInfo.innerText = `Halaman ${currentPage} dari ${totalPages || 1}`;
  
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages || totalPages === 0;
}

// Event Listeners untuk Pagination
prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderTable();
  }
});

nextBtn.addEventListener("click", () => {
  const totalPages = Math.ceil(filteredClasses.length / itemsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderTable();
  }
});

// Event Listener untuk Pencarian
searchInput.addEventListener("input", (e) => {
  const keyword = e.target.value.toLowerCase();
  
  filteredClasses = allClasses.filter(classed => {
    const walasName = (walasMap[classed.teacher_id] || "").toLowerCase();
    return classed.name.toLowerCase().includes(keyword) ||  
           walasName.includes(keyword);
  });

  currentPage = 1;
  renderTable();
});

// Fetch Data Awal
fetch(`${SUPABASE_URL}/rest/v1/classes?select=*`, {
  method: "GET",
  headers: {
    "apikey": SUPABASE_KEY,
    "Authorization": `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json"
  }
})
.then(response => response.json())
.then(classes => {
  allClasses = classes;
  filteredClasses = classes;
  renderTable();
})
.catch(error => {
  console.error(error);
  tbody.innerHTML = `<tr><td colspan="6">Gagal memuat data</td></tr>`;
});
