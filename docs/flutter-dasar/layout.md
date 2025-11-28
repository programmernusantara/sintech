---
sidebar_position: 2
---

# 🧩 Layout

Layout adalah fondasi dari setiap tampilan (UI) yang kamu lihat di aplikasi Flutter. Tanpa layout, elemen seperti **teks, tombol, gambar, card, atau ikon** tidak akan memiliki posisi, ukuran, atau susunan yang teratur.

Flutter menggunakan pendekatan **berbasis widget**, artinya *semua hal*—termasuk layout—adalah widget. Jadi, layout bisa kamu anggap sebagai:

> **“Widget yang bertugas menyusun widget lain agar rapi, terstruktur, dan proporsional.”**

Memahami layout berarti kamu memegang kendali penuh untuk membangun UI apa pun, dari yang sederhana hingga kompleks.

---

## **Column**
Menyusun widget dari **atas ke bawah**.

Contoh penggunaan:
- Form pendaftaran  
- Tampilan profil  
- Susunan teks dan tombol  

> Seperti “tumpukan vertikal”.

---

## **Row**
Menyusun widget dari **kiri ke kanan**.

Contoh penggunaan:
- Ikon + teks dalam baris  
- Gambar dan deskripsi  
- Tombol sejajar  

---

## **Padding**
Digunakan untuk memberi ruang agar UI tidak terlihat sesak.

- **Padding** → ruang di *dalam* widget  

---

## **Margin**
- **Margin** → ruang di *luar* widget  

---
## **Container**
Widget serbaguna yang bisa memberi:
- ukuran  
- warna  
- margin/padding  
- border radius  
- alignment  

---

## **Stack**
Digunakan untuk **menimpa widget secara berlapis**.

Contoh:  
- Avatar menumpuk banner  
- Teks di atas gambar  

---

## **ListView**
Digunakan saat tampilan harus bisa **scroll**.

---

## **Expanded**
Mengatur pembagian ruang secara fleksibel di Row/Column.

---

## **Finis**

Contoh Lengkap: Menggabungkan Semua Layout Dasar

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
      debugShowCheckedModeBanner: false,
      home: const ProfilePage(),
    );
  }
}

class ProfilePage extends StatelessWidget {
  const ProfilePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              // Stack → Banner + Avatar overlap
              SizedBox(
                height: 260,
                width: double.infinity,
                child: Stack(
                  alignment: Alignment.center,
                  clipBehavior: Clip.none,
                  children: [
                    // Banner
                    Positioned.fill(
                      child: Image.asset(
                        'assets/images/banner.jpg',
                        fit: BoxFit.cover,
                      ),
                    ),

                    // Avatar
                    Positioned(
                      bottom: -55,
                      child: Container(
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: Colors.white,
                          boxShadow: [
                            BoxShadow(
                              color: Colors.grey,
                              blurRadius: 8,
                              offset: Offset(0, 4),
                            ),
                          ],
                        ),
                        child: const CircleAvatar(
                          radius: 55,
                          backgroundColor: Colors.white,
                          child: CircleAvatar(
                            radius: 50,
                            backgroundImage: AssetImage('assets/images/banner.jpg'),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 70),

              // Name
              const Text(
                'Wildan Firmani Quraisi',
                style: TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 8),

              const Text(
                'Flutter Developer • Trader • Content Creator',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 14,
                  color: Colors.black54,
                ),
              ),

              const SizedBox(height: 30),

              // Stats (Row)
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 40),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: const [
                    _StatItem(label: 'Following', value: '120'),
                    _StatItem(label: 'Followers', value: '10.2K'),
                    _StatItem(label: 'Likes', value: '50K'),
                  ],
                ),
              ),

              const SizedBox(height: 40),
            ],
          ),
        ),
      ),
    );
  }
}

class _StatItem extends StatelessWidget {
  final String label;
  final String value;

  const _StatItem({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(
          value,
          style: const TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: const TextStyle(
            fontSize: 14,
            color: Colors.black54,
          ),
        ),
      ],
    );
  }
}
````

---

# 🧠 Penjelasan Algoritma & Sintaks Code (Baris per Baris)

Berikut penjelasan lengkap dan mudah dipahami mengenai apa yang dilakukan setiap bagian.

---

**1. Fungsi `main()`**

```dart
void main() {
  runApp(const MyApp());
}
```

🔍 **Penjelasan:**

* `main()` adalah titik awal aplikasi Flutter.
* `runApp()` memulai aplikasi dan menampilkan widget `MyApp`.
* `const` digunakan untuk optimasi karena widget tidak berubah.

---

**2. Class MyApp**

```dart
class MyApp extends StatelessWidget {
```

* Ini adalah root widget aplikasi.
* `StatelessWidget` berarti UI tidak berubah saat runtime.

---

**3. MaterialApp**

```dart
return MaterialApp(
  debugShowCheckedModeBanner: false,
  home: const ProfilePage(),
);
```

* `MaterialApp` mengatur tema + routing dasar aplikasi.
* `debugShowCheckedModeBanner: false` → Menghilangkan banner debug.
* `home` → halaman pertama yang ditampilkan.

---

**4. Halaman ProfilePage**

```dart
class ProfilePage extends StatelessWidget {
```

* Halaman profil yang akan ditampilkan.

---

**5. Scaffold**

```dart
return Scaffold(
  backgroundColor: Colors.white,
```

* `Scaffold` adalah struktur utama halaman (seperti body HTML).
* Memberi layout standar Material (AppBar, Drawer, Body, dll).

---

**6. SafeArea**

Menjaga tampilan tidak masuk ke area tak aman seperti notch.

---

**7. SingleChildScrollView**

```dart
child: SingleChildScrollView(
```

* Membuat seluruh halaman bisa discroll.
* Sangat penting ketika konten lebih tinggi dari layar.

---

**8. Column (Struktur Utama)**

```dart
child: Column(
  crossAxisAlignment: CrossAxisAlignment.center,
```

* Menyusun seluruh tampilan dari atas ke bawah.
* `crossAxisAlignment.center` → rata tengah secara horizontal.

---

**9. Stack (Banner + Avatar Menumpuk)**

Stack digunakan untuk menumpuk widget:

* **Layer 1** → Banner
* **Layer 2** → Avatar yang keluar dari area banner

---

Banner

```dart
Positioned.fill(
  child: Image.asset(...),
)
```

* `Positioned.fill` → gambar memenuhi seluruh area Stack.
* `fit: BoxFit.cover` → gambar menyesuaikan dengan proporsional.

---

Avatar Overlap

```dart
Positioned(
  bottom: -55,
  child: Container(...)
)
```

* `bottom: -55` → avatar diturunkan keluar dari banner.
* `Container` → memberi shadow + border.
* `CircleAvatar` → membuat gambar menjadi lingkaran.

---

**10. Nama Pengguna**

```dart
Text(
  'Wildan Firmani Quraisi',
  style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
)
```

---

**11. Deskripsi**

```dart
Text(
  'Flutter Developer • Trader • Content Creator',
  textAlign: TextAlign.center,
)
```

* `textAlign.center` → teks rata tengah.

---

**12. Statistik (Row)**

```dart
Row(
  mainAxisAlignment: MainAxisAlignment.spaceBetween,
  children: [
    _StatItem(...),
    _StatItem(...),
    _StatItem(...),
  ],
)
```

* Menggunakan Row untuk membuat tiga kolom data sejajar horizontal.
* `spaceBetween` → jarak lebar di antara item.

---

**13. Komponen Statistik (_StatItem)**

Widget custom kecil untuk membangun item statistik:

```dart
Column(
  children: [
    Text(value, style: ...),
    Text(label, style: ...),
  ],
)
```

* `Column` → value di atas, label di bawah.
* Reusable dan rapi.

---
