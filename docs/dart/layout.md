---
sidebar_position: 9
---

# Layout

Layout adalah fondasi dari setiap tampilan (UI) yang kamu lihat di aplikasi Flutter. Tanpa layout, elemen seperti **teks, tombol, gambar, card, atau ikon** tidak akan memiliki posisi, ukuran, atau susunan yang teratur.

Flutter menggunakan pendekatan **berbasis widget**, artinya *semua hal*—termasuk layout—adalah widget. Jadi, layout bisa kamu anggap sebagai:

> **“Widget yang bertugas menyusun widget lain agar rapi, terstruktur, dan proporsional.”**

Memahami layout berarti kamu memegang kendali penuh untuk membangun UI apa pun, dari yang sederhana hingga kompleks.

---

## Column

`Column` digunakan untuk menyusun widget dari **atas ke bawah** (vertikal).

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
        appBar: AppBar(title: const Text('Layout - Column')),
        body: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: const [
              Text('Hello, World!'),
              SizedBox(height: 10),
              Icon(Icons.star, color: Colors.amber, size: 40),
              SizedBox(height: 10),
              Text('Flutter is awesome!'),
            ],
          ),
        ),
      ),
    );
  }
}
```

**Penjelasan:**

* `Column()` → Menyusun widget secara vertikal.
* `children` → Daftar widget yang akan disusun.
* `mainAxisSize: MainAxisSize.min` → Membuat column mengecil sesuai kontennya.
* `SizedBox(height: 10)` → Memberi jarak antar widget.

---

## Row

`Row` menyusun widget dari **kiri ke kanan** (horizontal).

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
        appBar: AppBar(title: const Text('Layout - Row')),
        body: Center(
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: const [
              Icon(Icons.person, size: 40),
              SizedBox(width: 10),
              Text('Username'),
            ],
          ),
        ),
      ),
    );
  }
}
```

**Penjelasan:**

* `Row()` → Menyusun widget horizontal.
* `mainAxisSize: MainAxisSize.min` → Row tidak mengambil seluruh lebar.
* `SizedBox(width: 10)` → Memberikan jarak antar widget.

---

## Stack

`Stack` digunakan untuk **menumpuk widget** di atas widget lain.

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
        appBar: AppBar(title: const Text('Layout - Stack')),
        body: Center(
          child: Stack(
            alignment: Alignment.bottomRight,
            children: [
              const CircleAvatar(
                radius: 40,
                backgroundImage: NetworkImage(
                  'https://picsum.photos/200',
                ),
              ),
              DecoratedBox(
                decoration: BoxDecoration(
                  color: Colors.green,
                  shape: BoxShape.circle,
                  border: Border.all(color: Colors.white, width: 3),
                ),
                child: const SizedBox(width: 20, height: 20),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
```

**Penjelasan:**

* `Stack()` → Menumpuk widget secara berlapis.
* `alignment: Alignment.bottomRight` → Mengatur posisi widget terakhir.
* `CircleAvatar` → Foto profil.
* `DecoratedBox` → Badge (status online).

---

## ListView

`ListView` digunakan untuk menampilkan daftar widget secara **scroll vertikal**.
Cocok untuk menampilkan data yang jumlahnya tidak terlalu banyak.

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
        appBar: AppBar(title: const Text('Layout - ListView')),
        body: ListView(
          children: const [
            ListTile(
              leading: Icon(Icons.person),
              title: Text('Zaskia Aurani'),
              subtitle: Text('0812 3456 7890'),
              trailing: Icon(Icons.call),
            ),
            ListTile(
              leading: Icon(Icons.person),
              title: Text('Wildan FQ'),
              subtitle: Text('0821 7788 9900'),
              trailing: Icon(Icons.call),
            ),
            ListTile(
              leading: Icon(Icons.person),
              title: Text('Arhan Permadi'),
              subtitle: Text('0857 1122 3344'),
              trailing: Icon(Icons.call),
            ),
            ListTile(
              leading: Icon(Icons.person),
              title: Text('Aneska Putri'),
              subtitle: Text('0838 6655 4411'),
              trailing: Icon(Icons.call),
            ),
            ListTile(
              leading: Icon(Icons.person),
              title: Text('Dimas Kurniawan'),
              subtitle: Text('0895 2211 9933'),
              trailing: Icon(Icons.call),
            ),
          ],
        ),
      ),
    );
  }
}
```

**Penjelasan:**

* `ListView()` → Membuat daftar scroll vertikal.
* `children` → Menampung widget-widget list.
* `ListTile` → Widget standar untuk item list.
* `leading` → Icon di sebelah kiri.
* `title` → Judul item.
* `subtitle` → Deskripsi kecil di bawah title.
* `trailing` → Icon di sebelah kanan.

---

## GridView

`GridView` digunakan untuk menampilkan widget dalam bentuk **grid (kotak-kotak)**.
Cocok untuk galeri foto atau menu aplikasi.

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
        appBar: AppBar(title: const Text('Layout - GridView')),
        body: GridView.count(
          crossAxisCount: 3,
          children: [
            Image.network('https://picsum.photos/200?image=25'),
            Image.network('https://picsum.photos/200?image=26'),
            Image.network('https://picsum.photos/200?image=27'),
            Image.network('https://picsum.photos/200?image=28'),
            Image.network('https://picsum.photos/200?image=29'),
            Image.network('https://picsum.photos/200?image=30'),
          ],
        ),
      ),
    );
  }
}
```

**Penjelasan:**

* `GridView.count()` → Grid dengan jumlah kolom tertentu.
* `crossAxisCount: 3` → Menampilkan 3 kolom.
* `children` → Berisi widget-widget yang ditampilkan dalam grid.
* `Image.network` → Menampilkan gambar dari URL.

---

## ListView.builder

Digunakan untuk menampilkan list yang **jumlahnya banyak** atau dinamis.
Lebih efisien karena hanya membangun item yang terlihat di layar.

```jsx
import 'package:flutter/material.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  MyApp({super.key});

  final List<String> task = [
    'Task 1',
    'Task 2',
    'Task 3',
    'Task 4',
    'Task 5',
  ];

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(title: const Text('Layout - ListView.builder')),
        body: ListView.builder(
          itemCount: task.length,
          itemBuilder: (BuildContext context, int index) {
            return ListTile(
              leading: const Icon(Icons.check_circle_outline),
              title: Text(task[index]),
            );
          },
        ),
      ),
    );
  }
}
```

**Penjelasan:**

* `ListView.builder()` → List yang dibangun sesuai kebutuhan.
* `itemCount` → Banyaknya item list.
* `itemBuilder` → Fungsi untuk membuat setiap item.
* `index` → Posisi item saat ini.
* `ListTile` → Tampilan item list.

---

## GridView.builder

Grid versi builder, cocok untuk item banyak seperti galeri atau produk toko.

```jsx
import 'package:flutter/material.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  MyApp({super.key});

  final List<String> imageUrls = [
    'https://picsum.photos/250?image=237',
    'https://picsum.photos/250?image=238',
    'https://picsum.photos/250?image=239',
    'https://picsum.photos/250?image=240',
    'https://picsum.photos/250?image=241',
    'https://picsum.photos/250?image=242',
  ];

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(title: const Text('Layout - GridView.builder')),
        body: GridView.builder(
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 3,
          ),
          itemCount: imageUrls.length,
          itemBuilder: (BuildContext context, int index) {
            return Image.network(imageUrls[index]);
          },
        ),
      ),
    );
  }
}
```

**Penjelasan:**

* `GridView.builder()` → Grid dinamis dan efisien.
* `gridDelegate` → Mengatur bentuk grid.
* `SliverGridDelegateWithFixedCrossAxisCount` → Jumlah kolom tetap.
* `crossAxisCount: 3` → Grid berisi 3 kolom.
* `itemCount` → Jumlah item.
* `itemBuilder` → Membangun widget berdasarkan index.

---
