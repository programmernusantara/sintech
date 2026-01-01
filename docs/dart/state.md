---
sidebar_position: 12
---

# State

State Management adalah cara Flutter untuk menyimpan, mengatur, dan memperbarui data yang digunakan untuk membangun tampilan (UI).

---

## Jenis State

Flutter memiliki dua jenis widget berdasarkan bagaimana mereka menangani perubahan data.

🧱 StatelessWidget

Widget yang **tidak memiliki data yang berubah**. Setelah dibangun, UI akan tetap sama.

**Cocok digunakan untuk:**

* Teks statis
* Gambar
* Ikon
* Layout statis

---

🔄 StatefulWidget

Widget yang **dapat berubah saat aplikasi berjalan**.
Memiliki objek `State` yang menyimpan dan memperbarui data.

**Cocok digunakan untuk:**

* Counter
* Form input
* Data dari API
* Animasi
* Halaman yang membutuhkan update otomatis

---

📝 Perbedaan StatelessWidget vs StatefulWidget

| Jenis               | Perubahan UI        | Penyimpanan Data                     |
| ------------------- | ------------------- | ------------------------------------ |
| **StatelessWidget** | Tidak dapat berubah | Tidak memiliki state                 |
| **StatefulWidget**  | Dapat berubah       | Memiliki state yang dapat diperbarui |

---

## setState()

`setState()` digunakan untuk **memberi tahu Flutter** bahwa ada data yang berubah dan UI harus diperbarui.

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

**Penjelasan:**

**`int angka = 0;`**

Variabel yang disimpan di dalam class State.
Nilai inilah yang akan berubah dan digunakan untuk memperbarui UI.

**`void tambah() => setState(() => angka++);`**

setState() memberi tahu Flutter bahwa **data sudah berubah**, sehingga Flutter akan menjalankan ulang fungsi build() agar UI menampilkan angka terbaru.

**`void kurang() => setState(() => angka--);`**

Sama seperti tambah(), perubahan nilai angka dibungkus di dalam setState() agar UI diperbarui.

**`build()`**

Fungsi yang akan **dipanggil ulang setiap kali setState() dijalankan**.
Tujuannya untuk menampilkan data terbaru ke layar.

**`_buildButton()`**

Fungsi helper untuk membuat tombol agar kode tetap rapi dan tidak repetitif.

---

## initState()

`initState()` adalah fungsi yang dipanggil **sekali saat widget pertama kali dibuat**.

```jsx
import 'package:flutter/material.dart';

void main() {
  runApp(const App());
}

class App extends StatefulWidget {
  const App({super.key});

  @override
  State<App> createState() => _AppState();
}

class _AppState extends State<App> {
  String pesan = "Belum disiapkan";

  @override
  void initState() {
    super.initState();

    Future.delayed(const Duration(seconds: 1), () {
      setState(() {
        pesan = "Halaman sudah siap!";
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(title: const Text('Instagram')),
        body: Center(
          child: Text(
            pesan,
            style: const TextStyle(fontSize: 20),
          ),
        ),
      ),
    );
  }
}
```

---

**Penjelasan:**

**`initState()`**

Dipanggil **sekali saja** ketika widget pertama kali ditampilkan. Digunakan untuk inisialisasi data awal.

**`super.initState()`**

Wajib dipanggil agar lifecycle bawaan Flutter tetap berjalan dengan benar.

**`Future.delayed(...)`**

Contoh simulasi proses "menunggu", seperti memuat data dari API.

**`setState(() { pesan = "Halaman sudah siap!"; });`**

Mengubah nilai state sehingga UI ikut berubah setelah delay 1 detik.

---
