---
sidebar_position: 1
---

# 🚀 Introduction
Flutter adalah **framework open-source** buatan Google yang digunakan untuk membangun aplikasi **mobile (Android/iOS), web, dan desktop** menggunakan **satu basis kode**.  
Flutter sangat cepat, efisien, dan menggunakan pendekatan deklaratif berbasis **widget**.

Dalam Flutter, **semua elemen tampilan adalah widget**.
Untuk memahaminya, bayangkan kamu sedang membangun sebuah rumah.

Sebuah rumah tersusun dari banyak komponen kecil seperti batu bata, pintu, jendela, dan perabot.
Jika semua bagian itu digabungkan, jadilah sebuah rumah yang utuh.

Begitu juga dengan Flutter:

> **Widget adalah bagian-bagian kecil yang menyusun tampilan aplikasi — sama seperti komponen rumah yang membentuk sebuah rumah.**

---

## Hello World

Flutter bekerja dengan prinsip **Widget Tree**, yaitu seluruh tampilan aplikasi dibentuk dari susunan pohon widget — mulai dari widget induk hingga widget-widget kecil yang ada di dalamnya.

```jsx
import 'package:flutter/material.dart';

void main() {
  runApp(
    MaterialApp(
      home: Scaffold(
        body: Center(
          child: Text('Hello, World'),
        ),
      ),
    ),
  );
}
```

**Algoritma:**

* `import 'package:flutter/material.dart';` → Mengimpor library Material Design bawaan Flutter.
* `void main() {...}` → Fungsi utama yang pertama kali dijalankan.
* `runApp()` → Menjalankan aplikasi Flutter dan memuat widget utama.
* `MaterialApp` → Struktur dasar aplikasi dengan tema dan navigasi.
* `Scaffold` → Kerangka tampilan (AppBar, body, drawer, dll).
* `Center` → Meletakkan widget di tengah layar.
* `Text('Hello, World')` → Menampilkan teks sederhana di layar.

---

## StatelessWidget

`StatelessWidget` adalah widget yang **tidak memiliki state**, sehingga tampilan bersifat permanen selama aplikasi berjalan.

```jsx
import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(
          title: Text('Instagram'),
          backgroundColor: Colors.green,
        ),
        body: Center(
          child: Text('Hello, World'),
        ),
      ),
    );
  }
}
```

**Algoritma:**

* `class MyApp extends StatelessWidget` → Membuat widget statis tanpa perubahan data.
* `build()` → Metode yang membangun UI.
* `MaterialApp` → Root widget dari aplikasi.
* `Scaffold` → Layout dasar halaman.
* `AppBar` → Menampilkan judul di bagian atas aplikasi.
* `Text('Hello, World')` → Menampilkan teks statis.

---

## StatefulWidget

`StatefulWidget` adalah widget yang dapat **berubah tampilannya** ketika data berubah, misalnya saat tombol ditekan atau nilai diperbarui.

```jsx
import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  int counter = 0;

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(
          title: const Text('Instagram'),
        ),
        body: Center(
          child: ElevatedButton(
            onPressed: () {
              setState(() {
                counter++;
              });
            },
            child: Text('$counter'),
          ),
        ),
      ),
    );
  }
}
```

**Algoritma:**

* `class MyApp extends StatefulWidget` → Widget yang memiliki data yang bisa berubah.
* `createState()` → Menghubungkan widget ke class state.
* `class _MyAppState extends State<MyApp>` → Menyimpan dan mengatur data yang dinamis.
* `int counter = 0;` → Data yang akan ditampilkan.
* `setState()` → Memperbarui tampilan ketika state berubah.
* `ElevatedButton` → Tombol interaktif.
* `Text('$counter')` → Menampilkan nilai counter.

---