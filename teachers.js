const SUPABASE_URL = "https://vkcgirfabwquzumgsvgy.supabase.co";
const SUPABASE_KEY = "sb_publishable_YSnSFpK1kgADoDDDBPjoCA_33V0lMlc";

const tbody = document.getElementById("data-guru");
const searchInput = document.getElementById("search-input");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const pageInfo = document.getElementById("page-info");

// State untuk Pagination
let allTeachers = [];
let filteredTeachers = [];
let currentPage = 1;
const itemsPerPage = 20;

const lessonMap = {
  "06a23265-1b7c-4ad3-acde-b2ca3331dede": "Matematika Wajib",
  "13fa2504-5d40-407b-9c5e-8ac6d5f9f991": "TIK",
  "3cbf6105-a428-427d-bcf8-bfa9b739cc44": "Wali Kelas",
  "55785470-1ff0-45f6-9c9e-8856e9f79580": "Kimia",
  "ec81b04b-0362-4bae-8b6e-6895722fb929": "Fisika",
  "10d4199e-8572-40c3-b02a-9b681e2d96fb": "Bahasa Inggris",
  "f85bc864-3d2e-40f8-9e8c-a3643988da30": "Bahasa Indonesia",
  "89de57e6-76f3-488c-b68d-66dda9342fcf": "Kebaharian",
  "616e05f7-8a3c-4d48-b094-6681b71f2b0d": "PKWU"
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
  const paginatedData = filteredTeachers.slice(startIndex, endIndex);

  if (paginatedData.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">Data tidak ditemukan 🔍</td></tr>`;
    updatePaginationControls(0);
    return;
  }

  paginatedData.forEach((teacher, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${teacher.nip}</td>
      <td>✅ ${capitalize(teacher.name)}</td>
      <td>${lessonMap[teacher.lesson_id] || "Tidak diketahui"}</td>
      <td>${formatTanggal(teacher.created_at)}</td>
    `;
    tbody.appendChild(row);
  });

  updatePaginationControls(filteredTeachers.length);
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
  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderTable();
  }
});

// Event Listener untuk Pencarian
searchInput.addEventListener("input", (e) => {
  const keyword = e.target.value.toLowerCase();
  
  filteredTeachers = allTeachers.filter(teacher => {
    const lessonName = (lessonMap[teacher.lesson_id] || "").toLowerCase();
    return teacher.name.toLowerCase().includes(keyword) ||
           teacher.nip.toString().includes(keyword) ||  
           lessonName.includes(keyword);
  });

  currentPage = 1;
  renderTable();
});

// Fetch Data Awal
fetch(`${SUPABASE_URL}/rest/v1/teachers?select=*`, {
  method: "GET",
  headers: {
    "apikey": SUPABASE_KEY,
    "Authorization": `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json"
  }
})
.then(response => response.json())
.then(teachers => {
  allTeachers = teachers;
  filteredTeachers = teachers;
  renderTable();
})
.catch(error => {
  console.error(error);
  tbody.innerHTML = `<tr><td colspan="6">Gagal memuat data</td></tr>`;
});
