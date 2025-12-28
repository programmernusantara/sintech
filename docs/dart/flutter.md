---
sidebar_position: 8
---

# Flutter

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

`StatelessWidget` adalah widget yang **tidak memiliki state**, sehingga tampilan bersifat permanen selama aplikasi berjalan, nantinya aplikasi kita di bungkus di code ini.

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

## Text

`Text` digunakan untuk menampilkan tulisan di layar.  
Widget ini mendukung berbagai gaya seperti warna, ukuran, dekorasi, dan background.

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
          title: const Text('Widget Dasar - Text'),
        ),
        body: const Center(
          child: Text(
            'Hello, World!',
            style: TextStyle(
              fontSize: 24,
              color: Colors.blue,
              backgroundColor: Colors.yellow,
              decoration: TextDecoration.underline,
            ),
          ),
        ),
      ),
    );
  }
}
```

**Algoritma:**

* `Text()` → Menampilkan teks.
* `style: TextStyle()` → Mengatur gaya teks.
* `fontSize` → Ukuran huruf.
* `color` → Warna teks.
* `backgroundColor` → Latar belakang teks.
* `decoration` → Garis dekorasi seperti underline, overline, dan lineThrough.

---

## Icon

`Icon` digunakan untuk menampilkan ikon dari library bawaan Flutter, seperti ikon menu, hati, kamera, dan lainnya.

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
          title: const Text('Widget Dasar - Icon'),
        ),
        body: const Center(
          child: Icon(
            Icons.favorite,
            color: Colors.pink,
            size: 100,
          ),
        ),
      ),
    );
  }
}
```

**Algoritma:**

* `Icon(Icons.favorite)` → Menampilkan ikon hati.
* `color` → Mengubah warna ikon.
* `size` → Mengatur ukuran ikon.

---

## Image

`Image` digunakan untuk menampilkan gambar.
Flutter mendukung gambar dari **internet**, **asset lokal**, maupun **file lokal**.

Contoh berikut menggunakan gambar dari internet.

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
          title: const Text('Widget Dasar - Image'),
        ),
        body: Center(
          child: Image.network(
            'https://picsum.photos/200/300',
            width: 200,
            height: 300,
            fit: BoxFit.cover,
          ),
        ),
      ),
    );
  }
}
```

**Algoritma:**

* `Image.network()` → Mengambil dan menampilkan gambar dari internet.
* `width` dan `height` → Mengatur ukuran gambar.
* `fit: BoxFit.cover` → Menyesuaikan gambar agar memenuhi area tanpa distorsi.

---

## Container

`Container` adalah salah satu widget paling serbaguna di Flutter.  
Widget ini digunakan untuk memberikan **padding, margin, ukuran, warna, border, radius**, dan berbagai dekorasi lain pada sebuah elemen tampilan.

`Container` hanya dapat memiliki **satu child widget**, misalnya `Text`, `Icon`, `Image`, atau widget lainnya.

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
          title: const Text('Widget Dasar - Container'),
        ),
        body: Center(
          child: Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.black,
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Icon(
              Icons.person,
              color: Colors.white,
              size: 50,
            ),
          ),
        ),
      ),
    );
  }
}
```

---

**Penjelasan:**

* `Container()` → Membungkus widget lain untuk menambahkan dekorasi.
* `padding` → Memberikan jarak di dalam area container.
* `decoration: BoxDecoration()` → Mengatur desain seperti warna, border, radius.
* `color` → Warna background container.
* `borderRadius` → Membuat sudut membulat.
* `child: Icon()` → Isi container, bisa berupa widget apa pun.
