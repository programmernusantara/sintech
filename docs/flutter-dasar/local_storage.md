---
sidebar_position: 6
---

# 📦 Local Storage

Pada dasarnya, aplikasi yang dibuat dengan Flutter tidak secara otomatis menyimpan data ke dalam disk perangkat. Secara default, data hanya disimpan sementara di memori (RAM). Artinya, ketika pengguna menutup aplikasi atau me-restart perangkat, seluruh data tersebut akan hilang dan kembali ke kondisi default.

Sebagai contoh, pada aplikasi yang memiliki fitur Dark Mode dan Light Mode. Ketika pengguna memilih Dark Mode, Flutter akan menampilkan tampilan aplikasi dalam mode gelap. Namun, jika aplikasi ditutup lalu dibuka kembali, pengaturan tema tersebut akan kembali ke default (Light Mode). Hal ini terjadi karena pengaturan tersebut tidak disimpan secara permanen.

Contoh lainnya adalah aplikasi catatan (notes). Jika pengguna menulis sebuah catatan, lalu keluar dari aplikasi tanpa penyimpanan permanen, maka catatan yang telah dibuat akan hilang. Ini tentu tidak diinginkan dalam aplikasi nyata yang digunakan sehari-hari.

Di sinilah peran Local Storage menjadi sangat penting. Local Storage memungkinkan aplikasi menyimpan data langsung ke penyimpanan perangkat (local disk), sehingga data tetap tersedia meskipun aplikasi ditutup atau perangkat dimatikan.

---

## 1. Contoh Kasus: Menyimpan Status Dark Mode

Status Awal Tanpa Penyimpanan Permanen
Kode awal ini hanya menyimpan status tema di dalam memori (**RAM**). Tema akan kembali ke **Light Mode** setiap kali aplikasi dibuka ulang.

```jsx
import 'package:flutter/material.dart';

void main() {
  runApp(const Home());
}

class Home extends StatefulWidget {
  const Home({super.key});

  @override
  State<Home> createState() => _HomeState();
}

class _HomeState extends State<Home> {
  /// Variabel tema saat ini. Default: Light Mode
  ThemeMode _themeMode = ThemeMode.light;

  /// Fungsi untuk mengganti tema (tanpa penyimpanan permanen)
  void _toggleTheme() {
    setState(() {
      _themeMode = _themeMode == ThemeMode.light
          ? ThemeMode.dark
          : ThemeMode.light;
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: ThemeData.light(),
      darkTheme: ThemeData.dark(),
      themeMode: _themeMode, // Tema yang sedang aktif
      home: Scaffold(
        appBar: AppBar(
          title: const Text('Counter'),
          actions: [
            IconButton(
              onPressed: _toggleTheme, // Ganti tema saat ditekan
              icon: const Icon(Icons.dark_mode),
            ),
          ],
        ),
        body: const Center(
          child: Text('Hello, World'),
        ),
      ),
    );
  }
}

```

## 2. Menggunakan `shared_preferences` untuk Local Storage

Untuk menyimpan data secara permanen, kita akan menggunakan *package* `shared_preferences`.

Tambahkan *Package* Jalankan perintah ini di terminal:

```bash
flutter pub add shared_preferences
```

Kemudian, *import* di file Dart Anda:

```dart
import 'package:shared_preferences/shared_preferences.dart';
```

## 3. Logika Pengambilan Status Tema (Memuat Data)

Fungsi ini dijalankan untuk memuat status tema yang sudah tersimpan saat aplikasi pertama kali dibuka.

```dart
// Mengambil status dark mode dari local storage
Future<void> _loadTheme() async {
    // 1. Dapatkan instance SharedPreferences
    final prefs = await SharedPreferences.getInstance();
    
    // 2. Ambil nilai Boolean dengan kunci 'isDrak'. 
    //    Jika belum ada, defaultnya false (Tema Terang).
    final isDrak = prefs.getBool('isDrak') ?? false;

    // 3. Perbarui status tema aplikasi
    setState(() {
        _themeMode = isDrak ? ThemeMode.dark : ThemeMode.light;
    });
}

```

## 4. Logika Perubahan dan Penyimpanan Tema

Fungsi ini menangani pergantian tema dan menyimpan status tema yang baru ke penyimpanan lokal.

```dart
// Mengubah theme dan menyimpan data
Future<void> _toggleTheme() async {
    // 1. Dapatkan instance SharedPreferences
    final prefs = await SharedPreferences.getInstance();
    
    // 2. Periksa tema saat ini
    final isDrak = _themeMode == ThemeMode.dark; 

    // 3. Simpan nilai kebalikan (!isDrak) sebagai tema yang baru
    await prefs.setBool('isDrak', !isDrak); 

    // 4. Perbarui status tema aplikasi
    setState(() {
        // Ganti tema kebalikannya
        _themeMode = isDrak ? ThemeMode.light : ThemeMode.dark;
    });
}

```

## 5. Inisialisasi Aplikasi (`initState`)

Panggil fungsi `_loadTheme` di `initState` agar tema yang tersimpan langsung dimuat segera setelah *widget* dibuat.

```dart
// Jalankan logika saat pertama kali aplikasi di muat
@override
void initState() {
    super.initState();
    _loadTheme(); // Panggil fungsi untuk memuat tema yang tersimpan
}

```

## Kode Lengkap (Dengan Local Storage)

Berikut adalah kode lengkap yang sudah mengimplementasikan penyimpanan tema secara permanen menggunakan `shared_preferences`.

```jsx
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  runApp(const Home());
}

class Home extends StatefulWidget {
  const Home({super.key});

  @override
  State<Home> createState() => _HomeState();
}

class _HomeState extends State<Home> {
  /// Variabel untuk menyimpan mode tema saat ini. Defaultnya adalah tema terang (light)
  ThemeMode _themeMode = ThemeMode.light;

  // Mengubah theme dan menyimpan data ke local storage
  Future<void> _toggleTheme() async {
    final prefs = await SharedPreferences.getInstance();
    final isDrak = _themeMode == ThemeMode.dark; // Periksa tema saat ini

    await prefs.setBool('isDrak', !isDrak); // Simpan nilai kebalikan (tema baru)

    setState(() {
      // Update status tema di aplikasi
      _themeMode = isDrak ? ThemeMode.light : ThemeMode.dark;
    });
  }

  // Mengambil status dark mode dari local storage
  Future<void> _loadTheme() async {
    final prefs = await SharedPreferences.getInstance();
    // Ambil nilai 'isDrak'. Jika null, gunakan false.
    final isDrak = prefs.getBool('isDrak') ?? false;

    setState(() {
      // Tentukan mode tema berdasarkan nilai yang dimuat
      _themeMode = isDrak ? ThemeMode.dark : ThemeMode.light;
    });
  }

  // Jalankan logika saat pertama kali aplikasi di muat
  @override
  void initState() {
    super.initState();
    _loadTheme();
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: ThemeData.light(), // Tema terang
      darkTheme: ThemeData.dark(), // Tema gelap
      themeMode: _themeMode, // Tentukan tema yang sedang aktif dari state
      home: Scaffold(
        appBar: AppBar(
          backgroundColor: Colors.blueGrey,
          title: const Text('Counter'),
          actions: [
            IconButton(
              onPressed: _toggleTheme, // Panggil fungsi ubah/simpan tema
              icon: const Icon(Icons.dark_mode),
            ),
          ],
        ),
        body: const Center(
          child: Text('Hello, World'),
        ),
      ),
    );
  }
}

```
