---
sidebar_position: 13
---

# Pocketbase backend all in one

Sebelumnya, kita menyimpan data di Local Storage, yang berarti data hanya tersimpan di memori HP. Masalahnya, jika aplikasi dihapus atau Anda ganti HP, data tersebut akan hilang. Inilah peran penting Server: sebagai pusat penyimpanan data di internet. Dengan server, data aplikasi Flutter Anda akan tersinkronisasi dan dapat diakses dari perangkat mana pun selama ada koneksi internet.

Mengapa Tidak Membuat Backend Sendiri?
Biasanya, menghubungkan aplikasi ke server membutuhkan Backend (seperti menggunakan bahasa Golang,Node.js, pyhton, rust dan masihbanyak pilihannya). Namun bagi pemula, cara ini cukup berat karena Anda harus belajar dua bahasa sekaligus, serta mengurus hal teknis yang rumit seperti Database, Docker, dan pembuatan API dari nol.

Solusi Cerdas: PocketBase
Untuk mempermudah belajar, kita akan menggunakan PocketBase. Ini adalah alat all-in-one yang menyediakan Database, API, dan sistem login dalam satu paket praktis. Cara menggunakannya semudah menginstal aplikasi biasa, sehingga Anda tidak perlu menulis kode server yang rumit. Dengan PocketBase, kita bisa menghemat waktu dan fokus sepenuhnya pada pengembangan aplikasi Flutter (sisi Client).

![Diagram Flutter vs Backend](./img/server.png)

---

## Persiapan Server PocketBase (Bakcend)

Sebelum menulis kode Flutter, kita harus menyiapkan "dapur" data kita terlebih dahulu.

### 1. Instalasi dan Menjalankan Server

* **Unduh:** Kunjungi [pocketbase.io](https://pocketbase.io/) dan unduh file *binary* yang sesuai dengan Sistem Operasi Anda.
* **Ekstrak:** Buka file `.zip` dan letakkan file `pocketbase` di folder khusus.
* **Jalankan:** Buka Terminal (macOS/Linux) atau CMD (Windows) di dalam folder tersebut, lalu jalankan perintah:

```bash
./pocketbase serve
```

* **Akses:** Server Anda sekarang berjalan di `http://127.0.0.1:8090`.

### 2. Konfigurasi Database (Collection)

1. Buka Dashboard Admin di browser: `http://127.0.0.1:8090/_/`.
2. Buat akun admin pertama Anda.
3. **Buat Koleksi:**

* Klik **"New Collection"**.
* Beri nama: `notes`.
* Klik **"Add Field"** > Pilih tipe **Plain Text** > Beri nama: `title`.

1. **Data Contoh:** Klik **"+ New Record"**, isi bagian `title` (misal: "Belajar Flutter"), lalu simpan. **Salin ID** data tersebut (contoh: `b3bkckd00ql64xg`) untuk digunakan nanti.

### 3. Konfigurasi Keamanan (API Rules)

Secara default, PocketBase mengunci akses data. Kita perlu membukanya agar aplikasi Flutter bisa mengakses data tanpa login:

1. Pilih koleksi `notes` > Klik tab **Settings** (ikon gerigi).
2. Pilih menu **API Rules**.
3. Pada bagian **List/Search Rule** dan **View Rule**, hapus teks di dalamnya hingga muncul tulisan **"Unlock"** (terbuka untuk publik).
4. Klik **Save Changes**.

---

## Persiapan Client Flutter (Frontend)

Langkah pertama yang harus dilakukan adalah menyiapkan proyek Flutter sebagai client. Proyek ini bertugas menampilkan antarmuka serta berkomunikasi dengan server untuk mengambil data.

Proses diawali dengan membuat proyek Flutter baru menggunakan perintah `flutter create`. Setelah proyek berhasil dibuat, kita masuk ke direktori proyek dan menambahkan dependency `pocketbase`. Library ini berfungsi sebagai *bridge* yang memungkinkan Flutter berkomunikasi langsung dengan server PocketBase melalui HTTP API.

```bash
flutter create notes_app
cd notes_app
flutter pub add pocketbase
```

Dengan menambahkan dependency ini, Flutter kini memiliki kemampuan untuk mengirim dan menerima data dari server secara asynchronous.

Agar kode mudah dibaca, dirawat, dan dikembangkan ke tahap selanjutnya, aplikasi perlu memiliki struktur folder yang jelas. Dalam pendekatan ini, kita memisahkan **logika data** dan **tampilan UI**.

Folder `services` digunakan untuk menyimpan seluruh logika yang berhubungan dengan server dan database. Sementara itu, folder `pages` berisi file-file yang berkaitan dengan tampilan antarmuka aplikasi. Pemisahan ini penting agar UI tidak bercampur dengan logika bisnis, sehingga aplikasi tetap bersih dan terstruktur.

```jsx
lib/
├── services/
│   └── pocketbase_service.dart
├── pages/
│   └── home_page.dart
└── main.dart
```

---

### 1. Service PocketBase: Jembatan Client ke Server

Setelah struktur siap, langkah berikutnya adalah membuat **service PocketBase**. Service ini bertanggung jawab penuh dalam mengelola komunikasi antara Flutter dan server, termasuk mengambil data, mengirim data, dan menangani error.

Di dalam file `pocketbase_service.dart`, kita menginisialisasi client PocketBase menggunakan alamat server. Untuk pengujian lokal, alamat `127.0.0.1` digunakan pada aplikasi desktop atau browser, sedangkan emulator Android membutuhkan alamat khusus `10.0.2.2`.

```jsx
import 'package:pocketbase/pocketbase.dart';

/// Class ini berfungsi sebagai 'Data Provider' atau 'Service Layer'.
/// Tujuannya agar logika pengambilan data terpisah dari tampilan UI (Clean Code).
class PocketbaseService {
  // 'static' agar kita bisa mengakses 'pb' tanpa perlu membuat objek baru (instansiasi).
  static final pb = PocketBase('http://127.0.0.1:8090');

  /// Fungsi ini bertugas mengambil satu data (record) spesifik.
  /// Mengembalikan Future<RecordModel> karena proses ambil data butuh waktu (Asynchronous).
  static Future<RecordModel> getNoteById() async {
    // Mengembalikan objek RecordModel yang berisi data dari server.
    // .collection('notes') -> Menentukan tabel/koleksi mana yang diakses.
    // .getOne('...')       -> Mengambil satu baris data berdasarkan ID uniknya.
    // 'await'              -> Memberitahu program untuk menunggu sampai server merespon.
    return await pb.collection('notes').getOne('isi dengan id anda');    
  }
}
```

Penggunaan kata kunci `static` memungkinkan client PocketBase dibuat satu kali dan digunakan kembali di seluruh aplikasi. Fungsi `getNoteById` bersifat asynchronous karena proses pengambilan data dari server membutuhkan waktu dan tidak bisa dieksekusi secara instan.

---

### 2. Inisialisasi State dan Pemanggilan Data

Pada sisi UI, Flutter memerlukan sebuah *state* untuk menampung hasil pengambilan data dari server. Karena data datang secara asynchronous, kita menggunakan tipe `Future<RecordModel>`.

Variabel ini dideklarasikan menggunakan `late`, karena nilainya baru akan diisi ketika widget pertama kali dibuat, tepatnya di dalam metode `initState`.

```jsx
/// Variabel '_noteFuture' disiapkan untuk menyimpan 'janji' data yang akan datang.
/// Menggunakan 'late' karena nilainya baru akan diberikan saat 'initState' dijalankan.
late Future<RecordModel> _noteFuture;

@override
void initState() {
  super.initState();
  // Memasukkan fungsi fetch data ke dalam variabel di initState.
  // TUJUAN: Agar data dipanggil hanya 1x saat aplikasi dibuka, bukan setiap kali render.
  _noteFuture = PocketbaseService.getNoteById();
}
```

Metode `initState` dijalankan satu kali ketika widget diinisialisasi. Ini adalah tempat yang tepat untuk memanggil API, karena proses ini tidak akan terulang setiap kali UI dirender ulang.

---

### 3. Menampilkan Data Server ke UI dengan FutureBuilder

Karena data tidak langsung tersedia, Flutter membutuhkan mekanisme untuk mengetahui kapan data sedang dimuat, kapan terjadi kesalahan, dan kapan data berhasil diterima. Untuk tujuan inilah `FutureBuilder` digunakan.

`FutureBuilder` secara otomatis memantau status dari `Future` yang kita berikan. Ketika data masih diproses, UI akan menampilkan indikator loading. Jika terjadi error, pesan kesalahan akan ditampilkan. Dan ketika data berhasil diterima, UI akan diperbarui secara otomatis tanpa perlu pemanggilan ulang manual.

```jsx
/// FutureBuilder adalah Widget yang membangun dirinya sendiri berdasarkan status data terbaru.
FutureBuilder<RecordModel>(

  // future menerima variabel yang berisi proses pengambilan data kita tadi.
  future: _noteFuture,
  
  // builder adalah fungsi yang menentukan tampilan berdasarkan 'snapshot' (potret data).
  builder: (context, snapshot) {
    
    // STATUS 1: SEDANG LOADING
    // Jika koneksi masih berjalan (waiting), tampilkan animasi putar (loading).
    if (snapshot.connectionState == ConnectionState.waiting) {
      return const Center(child: CircularProgressIndicator());
    }

    // STATUS 2: TERJADI ERROR
    // Jika saat mengambil data ada masalah (internet mati, ID salah, dll).
    if (snapshot.hasError) {
      return Center(child: Text('Error: ${snapshot.error}'));
    }

    // STATUS 3: DATA BERHASIL DIAMBIL
    // snapshot.hasData memastikan data tidak null sebelum kita menampilkannya.
    if (snapshot.hasData) {
      // Mengambil objek data asli dari dalam snapshot.
      final note = snapshot.data!;
      
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text('Data dari Server PocketBase'),
            const SizedBox(height: 10), // Memberi jarak vertikal 10 pixel.
            
            // Menampilkan teks dari database.
            Text(
              // .getStringValue('title') -> Mengambil isi kolom bernama 'title'.
              // 'Judul Kosong' -> Nilai cadangan jika kolom 'title' ternyata tidak ada isinya.
              note.getStringValue('title', 'Judul Kosong'),
              style: const TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      );
    }

    // STATUS 4: KONDISI TAK TERDUGA
    // Jika tidak loading, tidak error, tapi data juga tidak ada.
    return const Center(child: Text('Tidak ada data tersedia'));
  },
);
```

Pada bagian ini, method `getStringValue` digunakan untuk mengambil nilai dari kolom `title` di database PocketBase. Jika kolom tersebut kosong atau `null`, Flutter akan menampilkan teks cadangan agar aplikasi tidak mengalami error.
