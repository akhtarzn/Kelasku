const SUPABASE_URL = "https://vkcgirfabwquzumgsvgy.supabase.co";
const SUPABASE_KEY = "sb_publishable_YSnSFpK1kgADoDDDBPjoCA_33V0lMlc";

const tbody = document.getElementById("data-siswa");
const searchInput = document.getElementById("search-input");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const pageInfo = document.getElementById("page-info");

// State untuk Pagination
let allStudents = [];
let filteredStudents = [];
let currentPage = 1;
const itemsPerPage = 38; // Rata-rata jumlah siswa per kelas

const classMap = {
  "864680e8-bc61-4ac9-8946-49c79d421258": "X-1",
  "bc8aa7cd-1022-4ebb-b96a-0bc78ee88ad7": "X-2",
  "6a1e09d7-48b3-449e-8546-94e6a2e30f95": "X-3",
  "231b4633-a176-4402-a5ec-8d78d25d7ef0": "X-4",
  "f881fe9b-52f3-4e24-bd85-b77eadbfbcda": "X-5",
  "51c7591f-3ea0-447e-bfb7-c84a58e1ec1d": "X-6",
  "eb4c2a2d-aeb1-4c17-8cd5-84dd211738dd": "X-7",
  "6b0c1515-c157-4af0-81d9-8604b2f80ebf": "X-8",
  "57667a16-d74e-471d-9730-a7c41a7591b1": "X-9",
  "738172ca-3eef-47a6-905e-c496dcbb71b6": "X-10",
  "e5ac8408-fc85-45df-ba0f-fbf8c72fa284": "X-11",
  "82df6fb7-8c47-4b1b-83b9-46c46707cd69": "X-12",
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
  "88461269-760c-4aba-8f0a-b54646c979a8": "XI-F2",
  "87531d32-f0e7-4bf6-b622-520605b516de": "XII-A1",
  "0665098f-e371-4709-87e7-f7a00af35479": "XII-A2",
  "42731275-32eb-43b2-a69a-441c119ff055": "XII-B1",
  "0817e9c5-c1bb-4343-bdd7-407dee0b37a9": "XII-B2",
  "64dae38f-e1a6-44fb-8b14-8d6f9844ede7": "XII-C1",
  "ac63220d-bdf5-4972-8cef-e08c1e59898c": "XII-C2",
  "5d0a0750-3a36-414f-98f9-0083afa8423e": "XII-D1",
  "df80dac5-d19c-4666-a052-dca93756ad11": "XII-D2",
  "3e3bf619-b981-491a-b733-42adbfbeb7bb": "XII-E1",
  "45243263-41c3-4b8c-bb0b-4d2fcb72a65d": "XII-E2",
  "4559b3a5-3f99-436d-8a6e-212cfcd9a7eb": "XII-F1",
  "54406c95-48ca-46d2-823e-6d7eb9f7e55a": "XII-F2"
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
  const paginatedData = filteredStudents.slice(startIndex, endIndex);

  if (paginatedData.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">Data tidak ditemukan 🔍</td></tr>`;
    updatePaginationControls(0);
    return;
  }

  paginatedData.forEach((student, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${startIndex + index + 1}</td>
      <td>${student.nisn}</td>
      <td>${student.nis}</td>
      <td>✅ ${capitalize(student.name)}</td>
      <td>${classMap[student.class_id] || "Tidak diketahui"}</td>
      <td>${formatTanggal(student.created_at)}</td>
    `;
    tbody.appendChild(row);
  });

  updatePaginationControls(filteredStudents.length);
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
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderTable();
  }
});

// Event Listener untuk Pencarian
searchInput.addEventListener("input", (e) => {
  const keyword = e.target.value.toLowerCase();
  
  filteredStudents = allStudents.filter(student => {
    const className = (classMap[student.class_id] || "").toLowerCase();
    return student.name.toLowerCase().includes(keyword) || 
           student.nisn.toString().includes(keyword) || 
           student.nis.toString().includes(keyword) || 
           className.includes(keyword);
  });

  currentPage = 1; // Reset ke halaman pertama saat mencari
  renderTable();
});

// Fetch Data Awal
fetch(`${SUPABASE_URL}/rest/v1/students?select=*`, {
  method: "GET",
  headers: {
    "apikey": SUPABASE_KEY,
    "Authorization": `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json"
  }
})
.then(response => response.json())
.then(students => {
  allStudents = students;
  filteredStudents = students;
  renderTable();
})
.catch(error => {
  console.error(error);
  tbody.innerHTML = `<tr><td colspan="6">Gagal memuat data</td></tr>`;
});
