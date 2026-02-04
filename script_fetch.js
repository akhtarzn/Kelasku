const tbody = document.getElementById("data-siswa");

// mapping ID kelas → nama kelas (contoh)
const classMap = {
  "32152e9d-96d0-45b2-8dff-95eb184d0a69": "XI-B1",
  "186fcf0b-b8d6-44ce-8e4c-31dcbea5cd9c": "XI-B2"
};

// fungsi bantu: kapitalisasi nama
function capitalizeName(name) {
  return name
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

fetch("tabel.json")
  .then(response => {
    if (!response.ok) {
      throw new Error("Gagal mengambil data");
    }
    return response.json();
  })
  .then(students => {
    students.forEach((student, index) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${student.NISN}</td>
        <td>${student.NIS}</td>
        <td>${student.NAMA}</td>
        <td>${student.KELAS}</td>
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



