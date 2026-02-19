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
const itemsPerPage = 20;

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
  "e49a2308-41e6-4a75-8a69-ad4af33b27de": "Dra. Mariah Ulfah",
  "ffa7ce13-5968-4b85-b534-b5e17c1304bd": "Miftahul Jannah, S.Sn",
  "711fd628-c4a9-48d1-aebd-257c239f0901": "Dhurotul Khoiriyah, M.Pd",
  "76ade2a1-f02f-4bd0-891d-114041a56398": "Nesa Ayu Dina, M.Pd",
  "2ac6cf00-051c-4f06-92d5-91f51d441c7a": "Laura Widya Putri, S.Pd",
  "04865c18-5ee8-4c46-b9e0-afe0c9f6c468": "Nanda Try Hastuti, S.Pd",
  "a02f8a7e-1abb-4400-9e52-49b14f555305": "Idahliya Mugirahayu, S.Pd",
  "a91287a9-184d-41bb-8ac8-03e215d93677": "Yuswanto Purnomo, S.Pd.I",
  "30dd3129-add9-4246-9231-cb29d25210d4": "Dhela Rochmatul Maghfiroh, S.Pd",
  "0479906f-a462-4598-85f9-a7971e9af7e5": "Siti Kotijah, S.Pd",
  "f3aa81cf-cdd4-4f58-af48-8dcf3b267f71": "Rois Nuril Alam Zein, S.Pd",
  "b162cba0-d618-4894-93f2-294203535af2": "Dhurotul Khoiriyah, M.Pd",
  "b34a6d88-64cd-44e2-a6ed-edbc05ebc2b1": "Intan Akmalia, S.Pd",
  "e065b892-1656-4e37-a135-1c683fadeb90": "Rosita Dwi Diahwari, S.Pd",
  "56a2a0db-73f8-4a95-a84e-2fe3fefc4958": "Siti Khumairoh Saragih, S.S",
  "76e2cbd8-0ef5-4e06-a279-e4bf27605314": "Yulianti, S.Pd",
  "dff08d04-5103-4b54-a823-e178a9680095": "Enggar Sustiadi Pradana, S.Pd",
  "3b30109c-5781-4a64-b366-51909b8c79fb": "Retno Dwi Kartika L, S.Pd",
  "bb5033f5-f62c-4d70-ab1c-673584a1ca3e": "Rosa Ramadhan, S.Pd",
  "b0b74c95-1c08-4413-ac94-0f9cf6bdeeee": "Angelica Maylani Putri, S.Pd",
  "fc5ae12d-8862-4037-954e-d528c4550b13": "Kristin Kurnia Wati, S.Pd",
  "0e897b36-7bab-493e-a0b8-440c40bdadf4": "Dra. Nurcahyati",
  "52bd77a1-23f1-479e-8d95-b965754a25c9": "Nur Lailil Aprilia, S.Pd",
  "edb12cfd-6563-46a6-9e55-d06f5d67770a": "Ellsa Natassa Bachriani, M.Pd",
  "759c484d-acb2-4c09-8b50-ec9bebda6415": "Guntur Ajie Pangestu, S.Pd",
  "9804c3ad-2c22-4be1-a958-4e082fa0be7c": "Ika Aprilia N. A., S.Pd",
  "9b23d8b6-5f00-4834-96bf-0d91b759fdc4": "M. Yusuf Faizal Aufa, S.Sos"
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

  paginatedData.forEach((classed, index) => {
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
