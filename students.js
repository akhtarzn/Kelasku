const SUPABASE_URL = "https://vkcgirfabwquzumgsvgy.supabase.co";
const tbody = document.getElementById("data-siswa");

const classMap = {
  "32152e9d-96d0-45b2-8dff-95eb184d0a69": "XI-B1",
  "186fcf0b-b8d6-44ce-8e4c-31dcbea5cd9c": "XI-B2"
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
