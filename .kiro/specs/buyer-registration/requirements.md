# Requirements Document

## Introduction

Fitur ini memperluas halaman pendaftaran akun pembeli (`register.html`) pada platform e-commerce **BOSNIALine** agar setara dengan platform besar seperti Lazada. Saat ini halaman registrasi hanya memiliki field dasar (nama, email, nomor HP, password, konfirmasi password). Fitur baru ini menambahkan field tambahan (tanggal lahir, jenis kelamin, alamat), upload foto profil opsional, verifikasi email/OTP, validasi input sisi klien dan server yang lebih ketat, serta alur redirect setelah registrasi berhasil. Seluruh fungsionalitas terintegrasi dengan sistem autentikasi yang sudah ada (`api/auth.php`, `auth.js`, `auth.css`).

---

## Glossary

- **Registration_Form**: Komponen antarmuka HTML di `register.html` yang menampung semua field pendaftaran pembeli.
- **Form_Validator**: Modul JavaScript pada sisi klien yang memvalidasi input pengguna secara real-time sebelum pengiriman form.
- **Auth_API**: Endpoint backend PHP di `api/auth.php` yang memproses permintaan registrasi, login, dan manajemen sesi.
- **OTP_Service**: Modul di `auth.js` yang bertanggung jawab membuat, menyimpan, mengirim, dan memverifikasi kode One-Time Password.
- **Profile_Photo_Uploader**: Komponen opsional yang menangani pemilihan dan validasi file foto profil di sisi klien.
- **Password_Strength_Meter**: Komponen visual yang mengukur dan menampilkan tingkat kekuatan password secara real-time.
- **Terms_Consent**: Komponen checkbox yang merekam persetujuan pengguna terhadap Syarat & Ketentuan dan Kebijakan Privasi.
- **Buyer**: Pengguna yang mendaftar dengan peran pelanggan (pembeli) di platform BOSNIALine.
- **Session**: Status autentikasi pengguna yang disimpan di `localStorage` dan sesi server PHP.

---

## Requirements

---

### Requirement 1: Form Registrasi Lengkap

**User Story:** Sebagai seorang calon pembeli, saya ingin mengisi form pendaftaran dengan informasi pribadi yang lengkap, agar akun saya memiliki data yang cukup untuk pengalaman belanja yang lebih baik.

#### Acceptance Criteria

1. THE `Registration_Form` SHALL menampilkan field-field berikut: Nama Lengkap, Email, Nomor HP, Password, Konfirmasi Password, Tanggal Lahir, Jenis Kelamin, dan Upload Foto Profil (opsional).
2. THE `Registration_Form` SHALL mengelompokkan field ke dalam seksi bertahap (step) yang logis: Informasi Akun (nama, email, HP, password), Informasi Pribadi (tanggal lahir, jenis kelamin), dan Foto Profil.
3. WHEN pengguna mengisi field Nama Lengkap, THE `Registration_Form` SHALL menampilkan field dengan placeholder "Nama lengkap sesuai KTP".
4. WHEN pengguna membuka `register.html`, THE `Registration_Form` SHALL menampilkan indikator progress langkah yang menunjukkan posisi pengguna dalam alur registrasi multi-langkah.
5. WHERE fitur Upload Foto Profil tersedia, THE `Registration_Form` SHALL menyediakan tombol pilih file yang hanya menerima format gambar (JPEG, PNG, WebP) dengan ukuran maksimal 2 MB.
6. THE `Registration_Form` SHALL menampilkan pratinjau (preview) foto profil secara langsung setelah pengguna memilih file gambar.

---

### Requirement 2: Validasi Input Sisi Klien

**User Story:** Sebagai seorang calon pembeli, saya ingin mendapatkan umpan balik validasi secara langsung saat mengisi form, agar saya dapat memperbaiki kesalahan sebelum mengirimkan data.

#### Acceptance Criteria

1. WHEN pengguna mengetik di field Nama Lengkap, THE `Form_Validator` SHALL memvalidasi bahwa nama memiliki panjang antara 3 hingga 100 karakter dan hanya mengandung huruf, spasi, dan tanda hubung.
2. WHEN pengguna mengetik di field Email, THE `Form_Validator` SHALL memvalidasi format email menggunakan pola standar RFC 5322 dan menampilkan pesan kesalahan jika tidak valid.
3. WHEN pengguna memasukkan nomor HP, THE `Form_Validator` SHALL memanggil fungsi `validatePhone()` yang sudah ada di `auth.js` dan menampilkan hasil normalisasi jika valid.
4. WHEN pengguna mengetik password, THE `Password_Strength_Meter` SHALL menghitung skor kekuatan berdasarkan panjang (minimal 8 karakter), adanya huruf besar, angka, dan karakter khusus, serta menampilkan indikator warna (merah/oranye/kuning/hijau).
5. WHEN pengguna mengetik di field Konfirmasi Password, THE `Form_Validator` SHALL membandingkan nilai dengan field Password secara real-time dan menampilkan pesan "Password cocok ✓" atau "Password tidak cocok ✗".
6. WHEN pengguna memilih Tanggal Lahir, THE `Form_Validator` SHALL memvalidasi bahwa usia pengguna minimal 13 tahun berdasarkan tanggal lahir yang dipilih.
7. IF pengguna memilih file foto profil dengan ukuran lebih dari 2 MB, THEN THE `Form_Validator` SHALL menampilkan pesan kesalahan "Ukuran file maksimal 2 MB" dan membatalkan pemilihan file tersebut.
8. IF pengguna memilih file foto profil dengan format selain JPEG, PNG, atau WebP, THEN THE `Form_Validator` SHALL menampilkan pesan kesalahan "Format file tidak didukung. Gunakan JPEG, PNG, atau WebP".
9. WHEN pengguna mencoba berpindah ke langkah berikutnya dalam form multi-langkah, THE `Form_Validator` SHALL memvalidasi semua field pada langkah saat ini dan mencegah perpindahan jika ada field yang tidak valid.

---

### Requirement 3: Validasi Input Sisi Server

**User Story:** Sebagai pengelola sistem, saya ingin semua data yang masuk ke server divalidasi ulang, agar integritas data terjaga meskipun validasi klien dilewati.

#### Acceptance Criteria

1. WHEN `Auth_API` menerima permintaan registrasi, THE `Auth_API` SHALL memvalidasi bahwa semua field wajib (nama, email, nomor HP, password) tidak kosong setelah proses sanitasi `trim()`.
2. WHEN `Auth_API` menerima email, THE `Auth_API` SHALL memvalidasi format email menggunakan fungsi `filter_var()` dengan flag `FILTER_VALIDATE_EMAIL`.
3. WHEN `Auth_API` menerima password, THE `Auth_API` SHALL memvalidasi bahwa password memiliki panjang minimal 8 karakter.
4. IF `Auth_API` menemukan email yang sudah terdaftar di tabel `users`, THEN THE `Auth_API` SHALL mengembalikan respons JSON `{"ok": false, "msg": "Email sudah terdaftar."}` dengan HTTP status 400.
5. IF `Auth_API` menerima tanggal lahir, THEN THE `Auth_API` SHALL memvalidasi bahwa nilai merupakan tanggal valid dengan format `YYYY-MM-DD`.
6. IF `Auth_API` menerima data file avatar, THEN THE `Auth_API` SHALL memvalidasi tipe MIME file dan membatasi ukuran hingga 2 MB sebelum menyimpan ke server.
7. THE `Auth_API` SHALL menggunakan fungsi `sanitize()` yang ada di `config.php` pada semua input string sebelum diproses.

---

### Requirement 4: Verifikasi Email via OTP

**User Story:** Sebagai pengelola sistem, saya ingin memverifikasi alamat email yang didaftarkan, agar hanya pengguna dengan email valid yang dapat menyelesaikan registrasi.

#### Acceptance Criteria

1. WHEN pengguna berhasil mengisi dan mengirimkan form registrasi, THE `OTP_Service` SHALL membangkitkan kode OTP 6 digit numerik acak dan menyimpannya dengan masa berlaku 5 menit.
2. WHEN `OTP_Service` membangkitkan kode OTP, THE `OTP_Service` SHALL menampilkan modal verifikasi OTP menggunakan fungsi `showOTPModal()` yang sudah ada di `auth.js` dengan parameter `type: "email"`.
3. WHEN pengguna memasukkan kode OTP yang benar dalam masa berlaku, THE `OTP_Service` SHALL menandai field `emailVerified: true` pada objek pengguna di `localStorage`.
4. IF pengguna memasukkan kode OTP yang salah, THEN THE `OTP_Service` SHALL menampilkan pesan kesalahan dan mengizinkan hingga 5 percobaan sebelum membatalkan kode.
5. IF masa berlaku kode OTP sudah habis, THEN THE `OTP_Service` SHALL menampilkan pesan "Kode OTP sudah kedaluwarsa" dan menawarkan opsi kirim ulang.
6. WHEN pengguna mengklik tombol "Kirim Ulang", THE `OTP_Service` SHALL membangkitkan kode baru dan memulai ulang timer 60 detik sebelum tombol kirim ulang dapat digunakan lagi.
7. THE `OTP_Service` SHALL menampilkan kode OTP di `console` browser dalam mode pengembangan sebagai simulasi pengiriman email.

---

### Requirement 5: Upload Foto Profil (Opsional)

**User Story:** Sebagai seorang calon pembeli, saya ingin dapat mengunggah foto profil saat mendaftar, agar akun saya terlihat lebih personal.

#### Acceptance Criteria

1. WHERE fitur upload foto profil tersedia, THE `Profile_Photo_Uploader` SHALL menyediakan area klik atau drag-and-drop untuk memilih gambar.
2. WHEN pengguna memilih file gambar yang valid, THE `Profile_Photo_Uploader` SHALL menampilkan pratinjau gambar dalam elemen `<img>` berbentuk lingkaran (circular preview) sebelum form dikirim.
3. WHEN pengguna memilih gambar, THE `Profile_Photo_Uploader` SHALL mengonversi gambar ke format Data URL menggunakan `FileReader` API untuk pratinjau dan penyimpanan sementara.
4. THE `Profile_Photo_Uploader` SHALL menyediakan tombol "Hapus Foto" yang memungkinkan pengguna membatalkan pilihan foto dan kembali ke avatar inisial.
5. IF pengguna tidak mengunggah foto, THE `Registration_Form` SHALL menggunakan inisial nama pengguna sebagai avatar default sesuai pola yang sudah ada di `auth.css`.

---

### Requirement 6: Persetujuan Syarat & Ketentuan

**User Story:** Sebagai pengelola sistem, saya ingin memastikan pembeli menyetujui syarat & ketentuan sebelum mendaftar, agar platform terlindungi secara hukum.

#### Acceptance Criteria

1. THE `Terms_Consent` SHALL menampilkan checkbox dengan label yang mencantumkan tautan ke "Syarat & Ketentuan" dan "Kebijakan Privasi".
2. WHEN pengguna mencoba mengirimkan form tanpa mencentang `Terms_Consent`, THE `Form_Validator` SHALL mencegah pengiriman dan menampilkan pesan "Anda harus menyetujui Syarat & Ketentuan untuk mendaftar".
3. THE `Terms_Consent` SHALL menggunakan atribut `required` pada elemen checkbox sehingga validasi bawaan HTML5 juga aktif.
4. WHEN pengguna mengklik tautan "Syarat & Ketentuan", THE `Registration_Form` SHALL membuka konten tersebut di tab baru tanpa menutup atau mereset form yang sedang diisi.

---

### Requirement 7: Integrasi dengan Sistem Autentikasi

**User Story:** Sebagai pengembang sistem, saya ingin form registrasi baru terintegrasi penuh dengan sistem autentikasi yang sudah ada, agar tidak ada duplikasi logika dan semua halaman dapat memanfaatkan data yang sama.

#### Acceptance Criteria

1. THE `Registration_Form` SHALL memanggil fungsi `authRegister()` yang sudah ada di `auth.js` untuk mengirimkan data ke `Auth_API`.
2. WHEN `authRegister()` berhasil, THE `Registration_Form` SHALL menyimpan data pengguna ke `localStorage` menggunakan kunci `bosnialine_users` sesuai pola yang sudah ada.
3. WHEN `authRegister()` berhasil, THE `Registration_Form` SHALL menyimpan sesi pengguna ke `localStorage` menggunakan kunci `bosnialine_session`.
4. THE `Auth_API` SHALL menyimpan data pengguna baru ke tabel `users` di database MySQL menggunakan prepared statement PDO untuk mencegah SQL injection.
5. WHEN registrasi berhasil dan OTP diverifikasi, THE `Registration_Form` SHALL memanggil `injectAuthWidget()` untuk memperbarui tampilan navbar di halaman tujuan.
6. THE `Registration_Form` SHALL memuat file `auth.js` dan `auth.css` yang sudah ada tanpa memodifikasi fungsi-fungsi yang sudah ada di dalamnya.

---

### Requirement 8: Redirect Setelah Registrasi Berhasil

**User Story:** Sebagai seorang calon pembeli, setelah berhasil mendaftar dan memverifikasi email, saya ingin diarahkan ke halaman yang tepat, agar pengalaman belanja saya dimulai dengan mulus.

#### Acceptance Criteria

1. WHEN registrasi dan verifikasi OTP berhasil, THE `Registration_Form` SHALL menampilkan pesan sambutan menggunakan fungsi `showToast()` dengan teks "🎉 Akun berhasil dibuat! Selamat datang, [Nama Pengguna]!".
2. WHEN registrasi dan verifikasi OTP berhasil, THE `Registration_Form` SHALL mengarahkan pengguna ke `index.html` secara otomatis dalam waktu 1,5 detik.
3. WHEN `register.html` dibuka oleh pengguna yang sudah login, THE `Registration_Form` SHALL mengarahkan pengguna ke `index.html` secara langsung tanpa menampilkan form.
4. WHERE parameter query `?next=` tersedia pada URL `register.html`, THE `Registration_Form` SHALL mengarahkan pengguna ke URL yang ditentukan oleh parameter tersebut setelah registrasi berhasil, bukan ke `index.html`.

---

### Requirement 9: Aksesibilitas dan Responsivitas

**User Story:** Sebagai seorang calon pembeli yang menggunakan perangkat mobile atau pembaca layar, saya ingin form pendaftaran dapat diakses dan digunakan dengan nyaman, agar saya dapat mendaftar tanpa hambatan.

#### Acceptance Criteria

1. THE `Registration_Form` SHALL menampilkan layout satu kolom pada layar dengan lebar di bawah 768px menggunakan CSS media query yang sudah ada di `auth.css`.
2. THE `Registration_Form` SHALL menerapkan atribut `aria-label` atau `aria-describedby` pada semua field input untuk mendukung pembaca layar.
3. WHEN terjadi kesalahan validasi pada sebuah field, THE `Form_Validator` SHALL menerapkan atribut `aria-invalid="true"` pada elemen input yang bersangkutan.
4. THE `Registration_Form` SHALL memastikan semua elemen interaktif (tombol, input, checkbox) dapat dijangkau menggunakan navigasi keyboard (Tab, Enter, Space).
5. THE `Registration_Form` SHALL menggunakan atribut `inputmode="numeric"` pada field nomor HP untuk menampilkan keyboard numerik di perangkat mobile.
6. THE `Registration_Form` SHALL menggunakan warna dengan rasio kontras minimal 4.5:1 antara teks dan latar belakang, konsisten dengan palet warna yang sudah ada di `style.css` dan `auth.css`.
