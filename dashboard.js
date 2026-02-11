// ===============================
// KONFIGURASI SUPABASE
// ===============================
const SUPABASE_URL = "https://vkcgirfabwquzumgsvgy.supabase.co";
const SUPABASE_KEY = "sb_publishable_YSnSFpK1kgADoDDDBPjoCA_33V0lMlc";

const HEADERS = {
  "apikey": SUPABASE_KEY,
  "Authorization": `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json"
};

// ===============================
// FETCH DATA DARI SUPABASE
// ===============================
async function fetchDashboardData() {
  // Kita melakukan fetch ke semua table secara paralel
  const [
    resTeachers,
    resStudents,
    resClasses,
    resLessons,
    resSchedules
  ] = await Promise.all([
    fetch(`${SUPABASE_URL}/rest/v1/teachers?select=id`, { headers: HEADERS }),
    fetch(`${SUPABASE_URL}/rest/v1/students?select=id`, { headers: HEADERS }),
    fetch(`${SUPABASE_URL}/rest/v1/classes?select=id`, { headers: HEADERS }),
    fetch(`${SUPABASE_URL}/rest/v1/lessons?select=id`, { headers: HEADERS }),
    fetch(`${SUPABASE_URL}/rest/v1/lesson_schedule?select=id`, { headers: HEADERS })
  ]);

  // Pastikan semua response ok
  if (!resTeachers.ok || !resStudents.ok || !resClasses.ok || !resLessons.ok || !resSchedules.ok) {
    throw new Error("Gagal mengambil data dari salah satu tabel");
  }

  return {
    teachers: await resTeachers.json(),
    students: await resStudents.json(),
    classes: await resClasses.json(),
    lessons: await resLessons.json(),
    schedules: await resSchedules.json()
  };
}

// ===============================
// RENDER STAT KE CARD
// ===============================
function renderStats(data) {
  // Mengisi angka ke elemen HTML
  document.getElementById("teachers").textContent = data.teachers.length;
  document.getElementById("students").textContent = data.students.length;
  document.getElementById("classes").textContent = data.classes.length;
  document.getElementById("lessons").textContent = data.lessons.length;
  document.getElementById("schedules").textContent = data.schedules.length;

  // Menghilangkan efek transparan setelah data siap
  const statsSection = document.getElementById("stats");
  statsSection.classList.remove("opacity-60");
  statsSection.classList.add("opacity-100");
}

// ===============================
// INIT DASHBOARD
// ===============================
async function initDashboard() {
  try {
    const data = await fetchDashboardData();
    renderStats(data);
  } catch (error) {
    console.error("Gagal memuat dashboard:", error);
    // Jika gagal, tampilkan angka 0 atau error
    const ids = ["teachers", "students", "classes", "lessons", "schedules"];
    ids.forEach(id => {
      document.getElementById(id).textContent = "⚠️";
      document.getElementById(id).classList.add("text-sm");
    });
  }
}

// Jalankan saat halaman dimuat
document.addEventListener("DOMContentLoaded", initDashboard);
