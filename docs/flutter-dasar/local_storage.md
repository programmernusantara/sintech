---
sidebar_position: 6
---

# 📦 Local Storage

Pada dasarnya, aplikasi yang dibuat dengan Flutter tidak secara otomatis menyimpan data ke dalam disk perangkat. Secara default, data hanya disimpan sementara di memori (RAM). Artinya, ketika pengguna menutup aplikasi atau me-restart perangkat, seluruh data tersebut akan hilang dan kembali ke kondisi default.

Sebagai contoh, pada aplikasi yang memiliki fitur Dark Mode dan Light Mode. Ketika pengguna memilih Dark Mode, Flutter akan menampilkan tampilan aplikasi dalam mode gelap. Namun, jika aplikasi ditutup lalu dibuka kembali, pengaturan tema tersebut akan kembali ke default (Light Mode). Hal ini terjadi karena pengaturan tersebut tidak disimpan secara permanen.

Contoh lainnya adalah aplikasi catatan (notes). Jika pengguna menulis sebuah catatan, lalu keluar dari aplikasi tanpa penyimpanan permanen, maka catatan yang telah dibuat akan hilang. Ini tentu tidak diinginkan dalam aplikasi nyata yang digunakan sehari-hari.

Di sinilah peran Local Storage menjadi sangat penting. Local Storage memungkinkan aplikasi menyimpan data langsung ke penyimpanan perangkat (local disk), sehingga data tetap tersedia meskipun aplikasi ditutup atau perangkat dimatikan.

## Dark mode

status dark mode code awal tanpa menyimpan status ke local storage

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
  /// Variabel untuk menyimpan mode tema saat ini
  /// Defaultnya adalah tema terang (light)
  ThemeMode _themeMode = ThemeMode.light;

  /// Fungsi untuk mengganti tema antara light dan dark
  void _toggleTheme() {
    setState(() {
      // Ubah nilai _themeMode berdasarkan kondisi saat ini
      // Jika saat ini light -> ubah ke dark
      // Jika saat ini dark  -> ubah ke light
      _themeMode = _themeMode == ThemeMode.light
          ? ThemeMode.dark
          : ThemeMode.light;
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner:
          false, // Hilangkan banner debug di pojok kanan
      theme: ThemeData.light(), // Tema terang
      darkTheme: ThemeData.dark(), // Tema gelap
      themeMode: _themeMode, // Tema yang sedang aktif
      home: Scaffold(
        appBar: AppBar(
          title: const Text('Counter'), // Judul aplikasi
          actions: [
            // Tombol untuk mengganti tema
            IconButton(
              onPressed:
                  _toggleTheme, // Panggil fungsi _toggleTheme saat ditekan
              icon: const Icon(Icons.dark_mode), // Icon tema
            ),
          ],
        ),
        body: const Center(
          child: Text('Hello, World'), // Konten utama aplikasi
        ),
      ),
    );
  }
}
```
