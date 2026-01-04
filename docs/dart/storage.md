---
sidebar_position: 17
---

# Storage S3

Pada materi sebelumnya, kita telah mempelajari cara membuat sistem CRUD (Create, Read, Update, Delete) sederhana yang hanya mengelola data berbasis teks. Kali ini, kita akan meningkatkan level aplikasi kita dengan mempelajari cara mengelola file.

Mengelola file memiliki kompleksitas tersendiri. Di Flutter, sebelum mengirimkan file ke backend (PocketBase), kita harus memahami bahwa file tidak dikirim begitu saja dalam bentuk objek "File", melainkan harus dikonversi menjadi **MultipartFile** atau **Bytes**.

Kita akan membangun aplikasi penyimpanan file sederhana (seperti Google Drive versi minimalis) yang mendukung format:

* **Foto:** JPG, PNG
* **Video:** MP4, MOV
* **Musik:** MP3
* **Dokumen:** PDF, DOC

---

## 1: Object Storage (RustFS)

Secara default, PocketBase menggunakan **SQLite** untuk menyimpan metadata. Meskipun PocketBase bisa menyimpan file secara lokal, SQLite tidak direkomendasikan untuk penyimpanan file berskala besar. Oleh karena itu, kita akan menggunakan **Object Storage** eksternal sebagai "gudang" utama, sementara PocketBase bertindak sebagai perantara (bridge).

Dibandingkan menggunakan Amazon S3 (berbayar) atau MinIO (yang lisensi open source-nya mulai terbatas), kita akan menggunakan **RustFS**. RustFS adalah solusi *object storage* yang ditulis dengan bahasa Rust—sangat cepat, efisien, aman, dan sepenuhnya *open source*.

1. **Unduh RustFS:** Download file eksekusi RustFS sesuai dengan sistem operasi (OS) Anda.
2. **Jalankan & Setup:** Jalankan file eksekutabel tersebut, kemudian lakukan registrasi dan login.
3. **Buat Bucket:** Buat sebuah *bucket* baru sebagai wadah penyimpanan. Beri nama, misalnya: `files`.
4. **Buat Kredensial (S3 Access):**
* Untuk tahap pembelajaran, Anda bisa mengatur Access Key: `admin` dan Secret Key: `admin123`.
* *Catatan: Pada tahap produksi, selalu gunakan kunci acak yang dihasilkan secara otomatis demi keamanan.*

---

## 2: Konfigurasi Koleksi di PocketBase

Setelah gudang penyimpanan siap, kita perlu menyiapkan tabel (koleksi) di PocketBase untuk mencatat metadata file tersebut.

1. Buka Admin Dashboard PocketBase Anda.
2. **Buat Koleksi Baru:** Beri nama koleksi `files`.
3. **Tambah Field:**
* Tambahkan field baru bertipe **File**.
* Beri nama field tersebut, contohnya: `drive`.


4. **Atur Validasi File:** Pada pengaturan field `drive`, tentukan format yang diizinkan (MIME types):
* `jpg, png, mp4, mov, mp3, pdf, doc`.


5. Simpan perubahan.

---

## 3: Menghubungkan PocketBase dengan RustFS (S3 Compatibility)

Sekarang kita akan menghubungkan PocketBase agar setiap kali ada file yang diunggah, file tersebut otomatis diteruskan ke RustFS.

1. Masuk ke menu **Settings** di PocketBase.
2. Pilih menu **Files Storage**.
3. Aktifkan opsi **S3 Storage**.
4. Isi konfigurasi berdasarkan data dari RustFS:
* **Bucket:** `files`
* **Endpoint:** Isi dengan URL tempat RustFS berjalan (contoh: `http://localhost:9000`).
* **Access Key:** `admin`
* **Secret Key:** `admin123`
* **Region:** Bisa diisi bebas (contoh: `us-east-1` atau `singapore`).

5. Klik **Save Changes**.

---

**Kesimpulan**

Sampai tahap ini, infrastruktur server kita telah siap. PocketBase kini tidak lagi menyimpan file di penyimpanan lokal yang terbatas, melainkan sudah terintegrasi dengan **RustFS** yang jauh lebih tangguh dan cepat. Pastikan Anda memahami alur ini: **Flutter (Client) -> PocketBase (API/Bridge) -> RustFS (Storage).**

---

# Implementasi Client-Side (Flutter)

Setelah berhasil melakukan konfigurasi pada sisi server (**PocketBase & RustFS**), langkah selanjutnya adalah membangun aplikasi Flutter. Pada tahap ini, kita akan fokus pada bagaimana Flutter memproses file fisik menjadi data yang bisa dikirim melalui jaringan.

## 1. Persiapan Project Flutter

Tahap awal adalah menyiapkan lingkungan kerja dan pustaka (*library*) pihak ketiga agar Flutter dapat berkomunikasi dengan API PocketBase dan menangani pemilihan file dari memori perangkat.

**Pembuatan Project:**
```bash
flutter create storage_app
```

* **Instalasi Package:**
Buka `pubspec.yaml` atau jalankan perintah `flutter pub add` untuk package berikut:
1. **`pocketbase`**: SDK utama untuk autentikasi dan manipulasi database.
2. **`http`**: Diperlukan untuk membungkus data file ke dalam format *MultipartFile*.
3. **`file_picker`**: Memungkinkan pengguna memilih file (gambar, video, dokumen) dari sistem file perangkat.
4. **`url_launcher`**: Digunakan untuk membuka tautan unduhan file di browser eksternal.


5. **Struktur Folder**
Penerapan pola *Service-UI Separation* dilakukan agar kode tidak menumpuk di satu file:
* `lib/main.dart`: Inisialisasi aplikasi.
* `lib/services/storage_service.dart`: Logika "belakang layar" (API Call).
* `lib/screens/home_screen.dart`: Antarmuka visual untuk pengguna.

---

## 2. Membangun Storage Service

File ini adalah jantung dari fungsionalitas storage kita. Di sini kita mengatur koneksi ke PocketBase dan mendefinisikan metode CRUD khusus file.

File: `lib/services/storage_service.dart`

```jsx
import 'package:pocketbase/pocketbase.dart';
import 'package:http/http.dart' as http;
import 'package:url_launcher/url_launcher.dart';

class StorageService {
  // Alamat IP server PocketBase Anda (gunakan 10.0.2.2 untuk emulator Android)
  static final PocketBase pb = PocketBase('http://127.0.0.1:8090');

  // Nama koleksi yang telah dibuat di dashboard PocketBase
  static const String collection = 'files';

  // Fungsi untuk mengambil semua daftar record file dari server
  static Future<List<RecordModel>> getAllFiles() async {
    // Mengambil list penuh dan diurutkan berdasarkan waktu pembuatan terbaru
    return pb.collection(collection).getFullList(sort: '-created');
  }

  // Fungsi mengunggah file dengan konversi ke Bytes
  static Future<void> uploadFile({
    required List<int> bytes,
    required String fileName,
  }) async {
    await pb.collection(collection).create(
      files: [
        // Mengonversi data bytes menjadi MultipartFile agar bisa diterima server
        http.MultipartFile.fromBytes('file', bytes, filename: fileName),
      ],
    );
  }

  // Fungsi untuk memicu pengunduhan file
  static Future<void> downloadFile(RecordModel record) async {
    // Mengambil nama file asli dari field 'file' di database
    final fileName = record.getStringValue('file');

    // Mendapatkan URL publik file dari PocketBase
    final Uri url = pb.files.getUrl(record, fileName);

    // Menambahkan parameter query '?download=1' agar browser langsung mengunduh
    final Uri downloadUrl = url.replace(
      queryParameters: {...url.queryParameters, 'download': '1'},
    );

    // Mengecek apakah URL bisa dibuka, lalu meluncurkannya ke browser/aplikasi eksternal
    if (await canLaunchUrl(downloadUrl)) {
      await launchUrl(downloadUrl, mode: LaunchMode.externalApplication);
    }
  }

  // Fungsi untuk menghapus record sekaligus file fisik di Object Storage
  static Future<void> deleteFile(String id) async {
    await pb.collection(collection).delete(id);
  }
}

```

**Penjelasan Detail:**

1. **`PocketBase pb`**: Ini adalah inisialisasi koneksi. Objek `pb` ini yang akan kita gunakan terus-menerus untuk memanggil perintah seperti "ambil data" atau "hapus data".
2. **`getAllFiles()`**: Alurnya adalah mengirim permintaan (Request) ke PocketBase untuk melihat isi tabel `files`. Parameter `sort: '-created'` artinya data yang paling baru dibuat akan muncul di urutan paling atas.
3. **`uploadFile()` (Sangat Penting)**:
* Fungsi ini menerima `List<int> bytes`. Mengapa bytes? Karena internet tidak bisa mengirim "file" secara langsung; file harus dipecah menjadi angka-angka biner (0 dan 1) yang disebut bytes.
* `http.MultipartFile.fromBytes`: Ini membungkus bytes tersebut ke dalam paket "Multipart". Bayangkan seperti memasukkan barang ke dalam kotak paket yang rapi agar kurir (protokol HTTP) tahu bahwa ini adalah file, bukan teks biasa.
* `'file'`: Ini harus sama dengan nama field yang Anda buat di dashboard PocketBase.

4. **`downloadFile()`**:
* Alurnya: Kita minta URL lokasi file di server.
* `'download': '1'`: Ini adalah trik agar browser tidak hanya "membuka" file (seperti melihat foto), tapi benar-benar "mengunduh" (menyimpan) ke memori.
* `LaunchMode.externalApplication`: Ini memerintahkan HP untuk membuka browser (Chrome/Safari) untuk mengunduh file tersebut.

---

## 3. Membangun User Interface (UI)

Bagian ini menangani interaksi pengguna seperti menekan tombol upload dan menampilkan *progress* saat data sedang dimuat.

File: `lib/screens/home_screen.dart`

```jsx
import 'package:flutter/material.dart';
import 'package:file_picker/file_picker.dart';
import 'package:pocketbase/pocketbase.dart';
import '../services/storage_service.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  // Variabel untuk menampung data masa depan (Future) dari server
  late Future<List<RecordModel>> _filesFuture;

  @override
  void initState() {
    super.initState();
    _refreshFiles(); // Memuat data saat aplikasi pertama kali dibuka
  }

  // Fungsi untuk menyegarkan tampilan daftar file
  void _refreshFiles() {
    setState(() {
      _filesFuture = StorageService.getAllFiles();
    });
  }

  // Logika UI saat tombol upload ditekan
  Future<void> uploadFile() async {
    // Membuka file picker agar pengguna bisa memilih file
    final result = await FilePicker.platform.pickFiles(withData: true);
    if (result == null) return; // Jika batal memilih, hentikan proses

    // Mengirim file ke service
    await StorageService.uploadFile(
      bytes: result.files.first.bytes!,
      fileName: result.files.first.name,
    );
    _refreshFiles(); // Refresh daftar setelah berhasil upload
  }

  Future<void> downloadFile(RecordModel file) async {
    await StorageService.downloadFile(file);
  }

  Future<void> deleteFile(String fileId) async {
    await StorageService.deleteFile(fileId);
    _refreshFiles(); // Refresh daftar setelah berhasil hapus
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('File Storage')),
      // FutureBuilder digunakan untuk menangani UI berdasarkan status data (loading/error/success)
      body: FutureBuilder<List<RecordModel>>(
        future: _filesFuture,
        builder: (context, snapshot) {
          // Tampilan saat data sedang diambil
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          // Tampilan jika terjadi error pada koneksi/server
          if (snapshot.hasError) {
            return Center(child: Text('Terjadi kesalahan: ${snapshot.error}'));
          }
          // Tampilan jika data kosong
          if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return const Center(child: Text('Tidak ada file.'));
          }

          final files = snapshot.data!;

          // Menampilkan daftar file dalam bentuk list scrollable
          return ListView.builder(
            itemCount: files.length,
            itemBuilder: (context, index) {
              final file = files[index];
              return ListTile(
                leading: const Icon(Icons.insert_drive_file, color: Colors.blue),
                title: Text(file.getStringValue('file')), // Nama file
                subtitle: Text(file.getStringValue('created')), // Tanggal upload
                trailing: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    IconButton(
                      icon: const Icon(Icons.download),
                      onPressed: () => downloadFile(file),
                    ),
                    IconButton(
                      icon: const Icon(Icons.delete, color: Colors.red),
                      onPressed: () => deleteFile(file.id),
                    ),
                  ],
                ),
              );
            },
          );
        },
      ),
      // Tombol mengambang untuk mengunggah file baru
      floatingActionButton: FloatingActionButton(
        onPressed: uploadFile,
        child: const Icon(Icons.upload),
      ),
    );
  }
}

```

**Penjelasan Detail:**

1. **`FutureBuilder`**: Ini adalah bagian paling cerdas di UI.
* **Alurnya**: Saat aplikasi dibuka, `FutureBuilder` bertanya ke `_filesFuture`: "Apakah datanya sudah siap?".
* Jika belum (masih loading), dia menampilkan `CircularProgressIndicator` (roda berputar).
* Jika sudah, dia menggambar daftar file menggunakan `ListView.builder`.


2. **`FilePicker.platform.pickFiles(withData: true)`**:
* Saat Anda tekan tombol upload, HP akan membuka galeri/file manager.
* `withData: true`: Sangat penting! Ini memerintahkan Flutter untuk langsung membaca file tersebut menjadi **Bytes** saat dipilih. Tanpa ini, kita hanya mendapat alamat file, bukan isi filenya.


3. **`_refreshFiles()`**:
* Setelah kita `upload` atau `delete`, data di server berubah, tapi tampilan di HP tidak otomatis berubah.
* Kita memanggil `setState()` untuk memaksa Flutter menjalankan kembali fungsi `getAllFiles()` agar daftar filenya diperbarui sesuai kondisi terbaru di server.


4. **`ListTile`**: Ini hanya komponen UI untuk membungkus informasi file (nama, tanggal) dan tombol aksi (download/delete) agar terlihat rapi.

---

## 4. Jalankan & Menguji Aplikasi

Terakhir, kita perlu menghubungkan semuanya di `main.dart` agar aplikasi bisa dijalankan.

File: `lib/main.dart`

```jsx
import 'package:flutter/material.dart';
import '../screens/home_screen.dart';

void main() {
  // Inisialisasi dasar aplikasi Flutter
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      debugShowCheckedModeBanner: false, // Menghilangkan banner debug
      home: HomeScreen(), // Menetapkan HomeScreen sebagai halaman awal
    );
  }
}

```

## Prosedur Pengetesan:

1. **Jalankan Project**: Gunakan `flutter run`.
2. **Upload Test**: Gunakan tombol ikon upload di pojok kanan bawah. Pilih file gambar atau dokumen. Jika berhasil, daftar akan muncul di layar.
3. **Verifikasi Backend**: Buka dashboard PocketBase Anda. Pastikan ada record baru. Lalu cek RustFS Anda untuk memastikan file fisik tersimpan di bucket `files`.
4. **Download & Delete**: Coba tekan ikon unduh untuk memastikan file bisa diakses kembali, dan tekan ikon hapus untuk membersihkan data.

**Selesai.** Anda telah berhasil membangun sistem manajemen file lengkap dengan Flutter, PocketBase, dan RustFS!

---
