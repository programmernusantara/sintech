---
sidebar_position: 2
---

# 🧩 Layout

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

## Demo

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
        appBar: AppBar(title: const Text('Layout Dasar Flutter')),
        body: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Stack(
                alignment: Alignment.bottomRight,
                children: [
                  const CircleAvatar(
                    radius: 40,
                    backgroundImage: NetworkImage('https://picsum.photos/200'),
                  ),
                  Container(
                    width: 18,
                    height: 18,
                    decoration: BoxDecoration(
                      color: Colors.green,
                      shape: BoxShape.circle,
                      border: Border.all(color: Colors.white, width: 3),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),
              Row(
                mainAxisSize: MainAxisSize.min,
                children: const [
                  Icon(Icons.person, size: 32),
                  SizedBox(width: 10),
                  Text('John Doe', style: TextStyle(fontSize: 20)),
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