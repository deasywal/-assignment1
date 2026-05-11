//SITTA UT - OFFICIAL SCRIPT (INTEGRATED) Programmer: De' Asywal


//AUTHENTICATION (Login & Logout)
function login() {
    const emailEl = document.getElementById("email");
    const passEl = document.getElementById("password");
    if (!emailEl || !passEl) return;

    const email = emailEl.value.trim();
    const pass = passEl.value.trim();

    // A. CEK AKUN MASTER 
    if (email === "deasywall1203@gmail.com" && pass === "12345") {
        alert("Login Berhasil! Selamat datang, Asywal.");
        localStorage.setItem("namaUser", "Asywal");
        window.location.href = "dashboard.html";
        return;
    }

    // B. CEK AKUN DARI PENDAFTARAN (LocalStorage)
    const userBaru = localStorage.getItem(email);
    if (userBaru) {
        const data = JSON.parse(userBaru);
        if (data.password === pass) {
            alert("Login Berhasil! Selamat datang, " + data.nama);
            localStorage.setItem("namaUser", data.nama);
            window.location.href = "dashboard.html";
            return;
        }
    }

    // C.CEK AKUN DARI DATABASE (data.js)
    if (typeof dataPengguna !== 'undefined') {
        const user = dataPengguna.find(u => u.email === email && u.password === pass);
        if (user) {
            alert("Login Berhasil!");
            localStorage.setItem("namaUser", user.nama);
            window.location.href = "dashboard.html";
            return;
        }
    }

    alert("Email atau Password salah!");
}

function logout() {
    if (confirm("Apakah Anda yakin ingin keluar dari sistem?")) {
        localStorage.removeItem("namaUser"); 
        alert("Anda telah logout.");
        window.location.replace("index.html");
    }
}

function tampilGreeting() {
    const element = document.getElementById("greeting");
    if (!element) return;
    const nama = localStorage.getItem("namaUser") || "User";
    const jam = new Date().getHours();
    let ucapan = jam < 12 ? "Pagi" : (jam < 15 ? "Siang" : (jam < 18 ? "Sore" : "Malam"));
    element.innerText = `Selamat ${ucapan}, ${nama}`;
}

//FITUR PENDAFTARAN
function prosesDaftar() {
    const nama = document.getElementById("regNama").value;
    const email = document.getElementById("regEmail").value;
    const pass = document.getElementById("regPass").value; 
    const modalContent = document.querySelector("#registerModal .modal-content");

    if (!nama || !email || !pass) {
        alert("Mohon lengkapi Nama, Email, dan Password!");
        return;
    }

    // SIMPAN DATA KE MEMORI 
    const dataAkun = {
        nama: nama,
        email: email,
        password: pass
    };
    localStorage.setItem(email, JSON.stringify(dataAkun));

    // Ubah isi modal menjadi pesan sukses
    modalContent.innerHTML = `
        <div style="text-align:center; padding: 20px;">
            <h2 style="color: #27ae60;">✔ Berhasil!</h2>
            <p style="margin: 15px 0;">Halo <b>${nama}</b>, Akun Anda sudah aktif.<br>Silakan login menggunakan email: <b>${email}</b></p>
            <button class="btn-primary" onclick="location.reload()">Selesai & Login</button>
        </div>
    `;
}

// TRACKING PENGIRIMAN
function cariTracking() {
    const input = document.getElementById("nomorDO");
    const container = document.getElementById("hasilTracking");
    if (!input || !container || typeof dataTracking === 'undefined') return;

    const noDO = input.value.trim();
    const data = dataTracking[noDO];

    if (data) {
        container.style.display = "block";
        let listLog = "";
        data.perjalanan.forEach(p => {
            listLog += `<li><b style="color:#2c3e50">${p.waktu}</b><br><span style="color:#7f8c8d">${p.keterangan}</span></li>`;
        });

        container.innerHTML = `
            <h3>Status: <span style="color:#27ae60">${data.status}</span></h3>
            <p>Penerima: <b>${data.nama}</b> | Kurir: <b>${data.ekspedisi}</b></p>
            <hr style="border:0; border-top:1px solid #eee; margin:15px 0;">
            <ul class="timeline">${listLog}</ul>
        `;
    } else {
        alert("Nomor DO '" + noDO + "' tidak ditemukan!");
        container.style.display = "none";
    }
}

// MANAJEMEN STOK
function tambahStok() {
    const fileInput = document.getElementById('coverBuku');
    const kode = document.getElementById("kodeBarang");
    const nama = document.getElementById("namaBarang");
    const stok = document.getElementById("stokBarang");

    if (!fileInput.files[0] || !kode.value || !nama.value || !stok.value) {
        alert("Lengkapi semua data!"); return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const tabel = document.getElementById("tabelStok");
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><img src="${e.target.result}" width="50" style="border-radius:4px"></td>
            <td>${kode.value}</td>
            <td>${nama.value}</td>
            <td>${stok.value}</td>
            <td><button style="background:#e74c3c; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;" onclick="this.parentElement.parentElement.remove()">Hapus</button></td>
        `;
        tabel.appendChild(row);
        alert("Data Berhasil Ditambah!");
    };
    reader.readAsDataURL(fileInput.files[0]);
}

function renderStok() {
    const tabel = document.getElementById("tabelStok");
    if (!tabel || typeof dataBahanAjar === 'undefined') return;
    tabel.innerHTML = "";
    dataBahanAjar.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><img src="${item.cover}" width="50" style="border-radius:4px" onerror="this.src='https://via.placeholder.com/50x70?text=No+Img'"></td>
            <td>${item.kodeBarang}</td>
            <td>${item.namaBarang}</td>
            <td>${item.stok}</td>
            <td><button style="background:#e74c3c; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;" onclick="this.parentElement.parentElement.remove()">Hapus</button></td>
        `;
        tabel.appendChild(row);
    });
}

// MODAL CONTROLLER
function openModal(id) { document.getElementById(id).style.display = "block"; }
function closeModal(id) { document.getElementById(id).style.display = "none"; }

// 5. INIT
window.onload = () => {
    tampilGreeting();
    if (document.getElementById("tabelStok")) renderStok();
};