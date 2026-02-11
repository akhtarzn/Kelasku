const SUPABASE_URL = "https://vkcgirfabwquzumgsvgy.supabase.co";
const SUPABASE_KEY = "sb_publishable_YSnSFpK1kgADoDDDBPjoCA_33V0lMlc";

const tbody = document.getElementById("data-jadwalpelajaran");
const searchInput = document.getElementById("search-input");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const pageInfo = document.getElementById("page-info");

// State untuk Pagination
let allLessons_schedule = [];
let filteredLessons_schedule = [];
let currentPage = 1;
const itemsPerPage = 38; // Rata-rata jumlah siswa per kelas

const classMap = {
  "89b8ebb3-3bcb-41bc-bb93-affbf1f723dd": "XI-A1",
  "d396ca44-94c6-4753-8fc1-be5be3957e35": "XI-A2",
  "32152e9d-96d0-45b2-8dff-95eb184d0a69": "XI-B1",
  "186fcf0b-b8d6-44ce-8e4c-31dcbea5cd9c": "XI-B2",
  "f022afb4-436a-40d1-93a3-68440fbe9531": "XI-C1",
  "f4452b54-8e48-48a3-94fe-093c672255a3": "XI-C2",
  "142c061e-e8d6-4e60-990b-2c84712a20ed": "XI-D1",
  "cb09894a-6c23-4fb8-89e0-e15c1b934069": "XI-D2",
  "52298bab-0dd2-497f-ad86-36e5b4e8aa09": "XI-E1",
  "431528f9-6b13-412a-979f-4e7c2bea938f": "XI-E2",
  "2c09603c-f8c1-4e49-83b1-69f66ba3b17c": "XI-F1",
  "88461269-760c-4aba-8f0a-b54646c979a8": "XI-F2"
};

const teacherMap = {
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
  const paginatedData = filteredLessons.slice(startIndex, endIndex);

  if (paginatedData.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">Data tidak ditemukan 🔍</td></tr>`;
    updatePaginationControls(0);
    return;
  }
  
  paginatedData.forEach((lesson_schedule, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${startIndex + index + 1}</td>
      <td>${classMap[lesson_schedule.class_id] || "Tidak diketahui"}</td>
      <td>${lesson_schedule.day}</td>
      <td>${lesson_schedule.time_start} - ${lesson_schedule.time_end}</td>
      <td>✅ ${capitalize(lesson_schedule.subject)}</td>
      <td>${teacherMap[lesson_schedule.teacher_id] || "Tidak diketahui"}</td>
      <td>${formatTanggal(lesson_schedule.created_at)}</td>
    `;
    tbody.appendChild(row);
  });

  updatePaginationControls(filteredLessons_schedule.length);
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
  const totalPages = Math.ceil(filteredLessons_schedule.length / itemsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderTable();
  }
});

// Event Listener untuk Pencarian
searchInput.addEventListener("input", (e) => {
  const keyword = e.target.value.toLowerCase();
  
  filteredLessons_schedule = allLessons_schedule.filter(lesson_schedule => {
    const className = (classMap[lesson_schedule.class_id] || "").toLowerCase();
    const teacherName = (teacherMap[lesson_schedule.teacher_id] || "").toLowerCase();
    return lesson_schedule.day.toLowerCase().includes(keyword) || 
           lesson_schedule.time_start.toString().includes(keyword) || 
           lesson_schedule.time_end.toString().includes(keyword) || 
           lesson_schedule.subject.toLowerCase().includes(keyword) ||
           className.includes(keyword) || teacherName.includes(keyword);
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
.then(lessons_schedule => {
  allLessons_schedule = lessons_schedule;
  filteredLessons_schedule = lessons_schedule;
  renderTable();
})
.catch(error => {
  console.error(error);
  tbody.innerHTML = `<tr><td colspan="6">Gagal memuat data</td></tr>`;
});
