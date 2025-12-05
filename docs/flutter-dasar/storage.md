---
sidebar_position: 6
---


# 🗄️ Local Storage

Dalam dunia aplikasi, local storage adalah tempat penyimpanan data yang berada langsung di perangkat pengguna. Contoh paling mudah adalah fitur download lagu di Spotify. Setelah lagu di-download, kamu tetap bisa memutarnya meski tanpa internet karena file lagu tersimpan langsung di HP. Konsep ini sama seperti offline storage dalam aplikasi: data cepat diakses, tidak butuh koneksi internet, namun hanya tersedia di perangkat tersebut. Jika kamu berganti HP, maka data harus diunduh atau disimpan ulang.

---

Jenis-Jenis Local Storage di Flutter

## 1. SharedPreferences — Paling Mudah untuk Pemula

SharedPreferences adalah bentuk penyimpanan lokal yang paling sederhana. Cara kerjanya mirip “catatan kecil” aplikasi yang menyimpan data ringan seperti token login, tema, status onboarding, counter, atau pengaturan aplikasi lainnya. Data yang disimpan hanya tipe sederhana: int, String, bool, dan double. SharedPreferences sangat cepat, mudah digunakan, dan ideal sebagai fondasi awal memahami local storage.

---

## 2. Hive — Mudah, Cepat, dan Sangat Powerful (Rekomendasi Utama)

Hive adalah database lokal berbasis NoSQL yang terkenal sangat cepat dan mudah digunakan. Berbeda dari SharedPreferences, Hive dapat menyimpan data yang lebih kompleks seperti list besar atau objek model Dart. Performanya bahkan bisa lebih cepat daripada SQLite. Cocok untuk aplikasi offline-first, pencatatan, penyimpanan cache, hingga data pengguna dalam jumlah besar. Hive menjadi pilihan terbaik untuk pemula hingga menengah yang ingin sesuatu yang fleksibel tapi tetap simpel.

---

## 3. SQLite — Struktur Lebih Serius dan Kuat

SQLite adalah database lokal berbasis SQL, mirip dengan MySQL namun berjalan tanpa koneksi internet. SQLite ideal untuk aplikasi yang memerlukan struktur data teratur dan relasional, seperti aplikasi inventaris, kasir, atau sistem yang membutuhkan query kompleks. Meski powerful, SQLite lebih cocok untuk pengguna yang sudah paham konsep tabel, relasi, query, dan manajemen database.

---

**Contoh Sederhana SharedPreferences (Fondasi untuk Pemula):**

```jsx
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  runApp(const MyApp());
}

/// StatefulWidget digunakan karena nilai counter akan berubah (dinamis).
class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

/// State berisi logika aplikasi: membaca, menyimpan, dan mengubah counter.
class _MyAppState extends State<MyApp> {
  /// Menyimpan nilai counter saat ini (state utama aplikasi).
  int counter = 0;

  @override
  void initState() {
    super.initState();
    loadCounter(); // Ambil nilai counter yang pernah disimpan.
  }

  /// Mengambil nilai counter dari SharedPreferences.
  /// Jika tidak ada, gunakan nilai default = 0.
  Future<void> loadCounter() async {
    final prefs = await SharedPreferences.getInstance();
    counter = prefs.getInt('counter') ?? 0;
    setState(() {}); // Update UI setelah data berhasil dimuat.
  }

  /// Menyimpan nilai counter ke local storage.
  Future<void> saveCounter() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setInt('counter', counter);
  }

  /// Menambah nilai counter, lalu simpan perubahannya.
  void increment() {
    setState(() {
      counter++;
    });
    saveCounter();
  }

  /// Reset counter ke 0 dan hapus dari local storage.
  Future<void> resetCounter() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('counter');
    setState(() {
      counter = 0;
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: Scaffold(
        backgroundColor: Colors.grey[100],
        appBar: AppBar(
          centerTitle: true,
          title: const Text(
            'Counter App',
            style: TextStyle(fontWeight: FontWeight.bold),
          ),
        ),
        body: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                "$counter",
                style: const TextStyle(fontSize: 60),
              ),
              const SizedBox(height: 20),
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  // Tambah counter
                  ElevatedButton(
                    onPressed: increment,
                    child: const Icon(Icons.add),
                  ),

                  const SizedBox(width: 10),

                  // Reset counter
                  ElevatedButton(
                    onPressed: resetCounter,
                    child: const Icon(Icons.restore),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
```

---

**Bagian State – Tempat Logika Berjalan:**

```dart
class _MyAppState extends State<MyApp> {
  int counter = 0;
}
```

• Variabel counter menyimpan angka yang ditampilkan di layar.
• Nilai ini juga yang akan kita simpan lewat SharedPreferences.

---

**initState() – Dipanggil Saat Aplikasi Pertama Kali Dibuka:**

```dart
@override
void initState() {
  super.initState();
  loadCounter();
}
```

Penjelasan sintaks:
• `initState()` otomatis dipanggil sekali ketika widget dibuat.
• `super.initState()` wajib dipanggil agar proses internal Flutter berjalan normal.
• `loadCounter()` dipanggil untuk mengambil data counter dari local storage.

---

**Mengambil Data dari SharedPreferences:**

```dart
Future<void> loadCounter() async {
  final prefs = await SharedPreferences.getInstance();
  counter = prefs.getInt('counter') ?? 0;
  setState(() {});
}
```

**Penjelasan baris per baris:**

1. `Future<void>`
   Menandakan fungsi berjalan secara asynchronous (ada proses menunggu).
2. `SharedPreferences.getInstance()`
   Membuka koneksi ke local storage.
   Wajib memakai await karena butuh waktu memuat data.
3. `prefs.getInt('counter')`
   Mengambil data bertipe integer dengan key "counter".
4. `?? 0`
   Jika data tidak ditemukan (null), gunakan nilai default 0.
5. `setState(() {})`
   Memerintahkan Flutter untuk mengupdate UI setelah data berhasil dimuat.

---

**Menyimpan Nilai Counter:**

```dart
Future<void> saveCounter() async {
  final prefs = await SharedPreferences.getInstance();
  await prefs.setInt('counter', counter);
}
```

Penjelasan:
• prefs.setInt('counter', counter) menyimpan nilai counter ke storage.
• Key "counter" akan menjadi nama penyimpanan yang bisa kita panggil kapan saja.

---

**Menambah Counter:**

```dart
void increment() {
  setState(() {
    counter++;
  });
  saveCounter();
}
```

Penjelasan sintaks:
• `counter++` meningkatkan nilai counter 1 angka.
• `setState()` memberi tahu Flutter bahwa UI harus diperbarui.
• `saveCounter()` menyimpan nilai baru ke storage agar tidak hilang saat aplikasi ditutup.

---

**Reset Counter – Menghapus Data dari Local Storage:**

```dart
Future<void> resetCounter() async {
  final prefs = await SharedPreferences.getInstance();
  await prefs.remove('counter');
  setState(() {
    counter = 0;
  });
}
```

Penjelasan:
• `prefs.remove('counter')` menghapus data yang tersimpan.
• Counter di-set ulang ke 0.
• UI diperbarui dengan setState().

---
