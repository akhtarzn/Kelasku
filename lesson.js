const SUPABASE_URL = "https://vkcgirfabwquzumgsvgy.supabase.co";
const SUPABASE_KEY = "sb_publishable_YSnSFpK1kgADoDDDBPjoCA_33V0lMlc";

const tbody = document.getElementById("data-pelajaran");
const searchInput = document.getElementById("search-input");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const pageInfo = document.getElementById("page-info");

// State untuk Pagination
let allLessons = [];
let filteredLessons = [];
let currentPage = 1;
const itemsPerPage = 38; // Rata-rata jumlah siswa per kelas

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
  const paginatedData = filteredLessons.slice(startIndex, endIndex);

  if (paginatedData.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">Data tidak ditemukan 🔍</td></tr>`;
    updatePaginationControls(0);
    return;
  }

  paginatedData.forEach((lesson, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${startIndex + index + 1}</td>
      <td>✅ ${capitalize(lesson.subject)}</td>
      <td>${formatTanggal(lesson.created_at)}</td>
    `;
    tbody.appendChild(row);
  });

  updatePaginationControls(filteredLessons.length);
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
  const totalPages = Math.ceil(filteredLessons.length / itemsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderTable();
  }
});

// Event Listener untuk Pencarian
searchInput.addEventListener("input", (e) => {
  const keyword = e.target.value.toLowerCase();
  
  filteredLessons = allLessons.filter(lesson => {
    //const className = (classMap[student.class_id] || "").toLowerCase();
    return lesson.subject.toLowerCase().includes(keyword);
  });

  currentPage = 1; // Reset ke halaman pertama saat mencari
  renderTable();
});

// Fetch Data Awal
fetch(`${SUPABASE_URL}/rest/v1/lesson?select=*`, {
  method: "GET",
  headers: {
    "apikey": SUPABASE_KEY,
    "Authorization": `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json"
  }
})
.then(response => response.json())
.then(lessons => {
  allLessons = lessons;
  filteredLessons = lessons;
  renderTable();
})
.catch(error => {
  console.error(error);
  tbody.innerHTML = `<tr><td colspan="6">Gagal memuat data</td></tr>`;
});
