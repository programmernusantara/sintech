---
sidebar_position: 5
---

# 🧠 State Management

State Management adalah cara **mengatur**, **menyimpan**, dan **memperbarui data** dalam aplikasi Flutter.  
Dalam Flutter, *state* adalah **informasi yang dapat berubah**, dan setiap perubahan akan **mempengaruhi tampilan UI**.

---

Jenis Widget Berdasarkan State

| Widget | Deskripsi | Contoh Penggunaan |
|--------|-----------|--------------------|
| **StatelessWidget** | UI **tidak berubah** setelah widget dibangun. Tidak menyimpan data yang dapat berubah. | Teks statis, ikon, gambar |
| **StatefulWidget** | UI **dapat berubah** saat aplikasi berjalan. Menyimpan data yang dapat diperbarui. | Counter, form, animasi, data API |

📝 Intinya

- **StatelessWidget** → untuk UI yang *tetap* / tidak berubah.  
- **StatefulWidget** → untuk UI yang *berubah* berdasarkan data atau interaksi pengguna.

---

🧪 Contoh Aplikasi Counter

Di bawah ini contoh aplikasi sederhana menggunakan `StatefulWidget` untuk menambah dan mengurangi angka:

```jsx
import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      debugShowCheckedModeBanner: false,
      home: CounterPage(),
    );
  }
}

class CounterPage extends StatefulWidget {
  const CounterPage({super.key});

  @override
  State<CounterPage> createState() => _CounterPageState();
}

class _CounterPageState extends State<CounterPage> {
  int angka = 0;

  void tambah() => setState(() => angka++);
  void kurang() => setState(() => angka--);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              "$angka",
              style: const TextStyle(
                fontSize: 60,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 24),

            Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                _buildButton(
                  icon: Icons.add,
                  label: "Tambah",
                  onPressed: tambah,
                ),
                const SizedBox(width: 12),
                _buildButton(
                  icon: Icons.remove,
                  label: "Kurang",
                  onPressed: kurang,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  /// Widget tombol reusable agar kode lebih rapi.
  Widget _buildButton({
    required IconData icon,
    required String label,
    required VoidCallback onPressed,
  }) {
    return ElevatedButton.icon(
      onPressed: onPressed,
      icon: Icon(icon),
      label: Text(label),
      style: ElevatedButton.styleFrom(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
      ),
    );
  }
}
```

---

**📘 Penjelasan State pada Contoh di Atas:**

🔹 1. Menyimpan Data (State)

```dart
int angka = 0;
```

Variabel ini disimpan di dalam class `State`, sehingga dapat berubah saat aplikasi berjalan.

---

🔹 2. Memperbarui Data Menggunakan `setState()`

```dart
void tambah() => setState(() => angka++);
void kurang() => setState(() => angka--);
```

`setState()` memberi tahu Flutter bahwa ada perubahan data, sehingga UI harus dibangun ulang.

---

🔹 3. Proses Saat Tombol Ditekan

Ketika tombol **Tambah** atau **Kurang** ditekan:

1. Nilai `angka` berubah
2. Fungsi `setState()` dijalankan
3. Flutter membangun ulang widget
4. Tampilan angka diperbarui

---

📌 Kenapa Harus Menggunakan `setState()`?

Karena Flutter menggunakan sistem *reactive UI*, sehingga UI hanya berubah jika Flutter diberi tahu ada perubahan.
Tanpa `setState()`, perubahan data **tidak akan** memengaruhi UI.

---
