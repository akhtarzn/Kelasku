const SUPABASE_URL = "https://vkcgirfabwquzumgsvgy.supabase.co";
const SUPABASE_KEY = "sb_publishable_YSnSFpK1kgADoDDDBPjoCA_33V0lMlc";

const tbody = document.getElementById("data-siswa");

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

function formatTanggal(isoString) {
  const date = new Date(isoString);

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(date).replace(/\./g, ':');
}

const created_at = "2026-02-04 01:53:28.14688+00";
console.log(formatTanggal(created_at)); 

function capitalize(text) {
  return text
    .split(" ")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

fetch(`${SUPABASE_URL}/rest/v1/students?select=*`, {
  method: "GET",
  headers: {
    "apikey": SUPABASE_KEY,
    "Authorization": `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json"
  }
})
.then(response => {
  if (!response.ok) {
    throw new Error("Gagal mengambil data dari Supabase");
  }
  return response.json();
})
.then(students => {
  tbody.innerHTML = "";

  students.forEach((student, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${student.nisn}</td>
      <td>${student.nis}</td>
      <td>✅ ${capitalize(student.name)}</td>
      <td>${classMap[student.class_id] || "Tidak diketahui"}</td>
      <td>${formatTanggal(student.created_at)}</td>
    `;

    tbody.appendChild(row);
  });
})
.catch(error => {
  console.error(error);
  tbody.innerHTML = `
    <tr>
      <td colspan="4">Data gagal dimuat</td>
    </tr>
  `;

});
