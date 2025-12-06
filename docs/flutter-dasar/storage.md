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

**Contoh Aplikasi Todo List:**

```jsx
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  runApp(const MyApp());
}

/// Aplikasi Todo List sederhana dengan penyimpanan lokal.
/// Data disimpan menggunakan SharedPreferences.
class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  /// Menyimpan seluruh daftar task.
  List<String> tasks = [];

  /// Controller untuk mengambil input dari TextField.
  final TextEditingController taskController = TextEditingController();

  @override
  void initState() {
    super.initState();
    loadTasks(); // Memuat data saat aplikasi dibuka.
  }

  /// Memuat data task dari penyimpanan lokal.
  Future<void> loadTasks() async {
    final prefs = await SharedPreferences.getInstance();
    tasks = prefs.getStringList('tasks') ?? [];
    setState(() {});
  }

  /// Menambahkan task baru dan menyimpannya.
  Future<void> addTask() async {
    final prefs = await SharedPreferences.getInstance();

    // Ambil data terbaru dari storage.
    tasks = prefs.getStringList('tasks') ?? [];

    final newTask = taskController.text.trim();
    if (newTask.isEmpty) return; // Mencegah input kosong.

    tasks.add(newTask); // Tambahkan ke list.

    await prefs.setStringList('tasks', tasks); // Simpan.

    taskController.clear(); // Bersihkan input.
    setState(() {}); // Perbarui UI.
  }

  /// Menghapus task berdasarkan index.
  Future<void> deleteTask(int index) async {
    final prefs = await SharedPreferences.getInstance();

    tasks.removeAt(index);

    await prefs.setStringList('tasks', tasks); // Simpan perubahan.
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false, // Hilangkan banner debug.
      home: Scaffold(
        appBar: AppBar(
          title: const Text('Todo List'),
          centerTitle: true,
        ),

        body: Column(
          children: [
            /// Menampilkan list task secara scroll.
            Expanded(
              child: ListView.builder(
                itemCount: tasks.length,
                itemBuilder: (context, index) {
                  return Card(
                    margin: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 6,
                    ),
                    child: ListTile(
                      title: Text(tasks[index]),
                      trailing: IconButton(
                        icon: const Icon(Icons.delete, color: Colors.red),
                        onPressed: () => deleteTask(index),
                      ),
                    ),
                  );
                },
              ),
            ),

            /// Input pengguna.
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 12),
              child: TextField(
                controller: taskController,
                decoration: const InputDecoration(
                  labelText: 'Masukkan Task',
                  border: OutlineInputBorder(),
                ),
              ),
            ),

            const SizedBox(height: 10),

            /// Tombol simpan task.
            Padding(
              padding: const EdgeInsets.only(bottom: 16),
              child: ElevatedButton.icon(
                onPressed: addTask,
                icon: const Icon(Icons.add),
                label: const Text('Simpan Task'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

```

---

**1. Bagian: Variabel tasks & Controller:**

```dart
/// List untuk menyimpan semua task.
List<String> tasks = []; // Menyimpan seluruh task dalam bentuk list String

/// Controller untuk mengambil input dari TextField.
final TextEditingController taskController = TextEditingController(); 
// Controller untuk membaca teks yang diketik user di TextField
```

**Penjelasan:**

Bagian ini berfungsi untuk menyiapkan dua komponen penting. `tasks` adalah list yang menyimpan seluruh daftar pekerjaan (task) yang dibuat pengguna. Sementara itu, `taskController` digunakan untuk menangkap teks yang dimasukkan ke dalam TextField. Controller ini membantu membaca nilai input dan menghapus isinya setelah task berhasil ditambahkan.

---

**2. Fungsi loadTasks() – Mengambil Data dari Storage:**

```dart
/// Mengambil data task dari SharedPreferences.
Future<void> loadTasks() async {
  final prefs = await SharedPreferences.getInstance();
  // Mengambil instance SharedPreferences untuk membaca data lokal

  tasks = prefs.getStringList('tasks') ?? [];
  // Ambil list dengan key 'tasks', jika tidak ada kembalikan list kosong

  setState(() {});
  // Memperbarui UI setelah data berhasil dimuat
}
```

**Penjelasan:**

Fungsi `loadTasks()` digunakan untuk mengambil daftar task yang sebelumnya disimpan di penyimpanan lokal menggunakan SharedPreferences. Ketika aplikasi dibuka, fungsi ini membaca data dengan key `'tasks'`. Jika data ditemukan, maka data dimuat ke variabel `tasks`. Jika tidak ada, aplikasi tetap berjalan dengan list kosong. Setelah data diperoleh, `setState()` dipanggil untuk memperbarui tampilan UI.

---

**3. Fungsi addTask() – Menambah dan Menyimpan Task Baru:**

```dart
/// Menambahkan task baru ke dalam list dan menyimpannya.
Future<void> addTask() async {
  final prefs = await SharedPreferences.getInstance();
  // Membuka akses ke SharedPreferences

  tasks = prefs.getStringList('tasks') ?? [];
  // Mengambil data terbaru dari storage agar list tetap sinkron

  final newTask = taskController.text.trim();
  // Mengambil input dari TextField dan menghapus spasi berlebih

  if (newTask.isEmpty) return;
  // Validasi: kalau kosong, tidak melakukan apa-apa

  tasks.add(newTask);
  // Menambahkan task baru ke list

  await prefs.setStringList('tasks', tasks);
  // Menyimpan ulang seluruh list ke SharedPreferences

  taskController.clear();
  // Mengosongkan input TextField setelah berhasil ditambahkan

  setState(() {});
  // Memperbarui tampilan UI
}
```

**Penjelasan:**

Fungsi `addTask()` bertanggung jawab untuk menambahkan task baru yang diinput oleh pengguna. Pertama, aplikasi mengambil data terbaru dari SharedPreferences untuk memastikan tidak ada data yang tertimpa. Setelah itu input dibaca menggunakan `taskController`. Jika input kosong, fungsi dihentikan. Apabila valid, task dimasukkan ke dalam list dan disimpan kembali ke SharedPreferences. Setelah selesai, input dibersihkan dan UI diperbarui.

---

**4. Fungsi deleteTask() – Menghapus Task:**

```dart
/// Menghapus task berdasarkan index.
Future<void> deleteTask(int index) async {
  final prefs = await SharedPreferences.getInstance();
  // Mendapatkan akses ke SharedPreferences

  tasks.removeAt(index);
  // Menghapus task berdasarkan posisi indexnya

  await prefs.setStringList('tasks', tasks);
  // Menyimpan kembali list setelah dihapus

  setState(() {});
  // Memperbarui tampilan agar perubahan terlihat
}
```

**Penjelasan:**

Fungsi `deleteTask()` digunakan untuk menghapus task berdasarkan index tertentu di dalam list. Setelah task dihapus, list yang sudah diperbarui disimpan kembali ke SharedPreferences agar data tetap konsisten. Kemudian UI diperbarui menggunakan `setState()` agar pengguna langsung melihat perubahan.

---

**5. Menampilkan Data Menggunakan ListView:**

```dart
/// Menampilkan data task dalam bentuk list
Expanded(
  child: ListView.builder(
    itemCount: tasks.length, 
    // Jumlah item sesuai panjang list

    itemBuilder: (context, index) {
      return Card(
        margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        // Memberikan jarak antar item

        child: ListTile(
          title: Text(tasks[index]), 
          // Menampilkan teks task

          trailing: IconButton(
            icon: const Icon(Icons.delete, color: Colors.red),
            // Tombol delete berwarna merah

            onPressed: () => deleteTask(index),
            // Ketika ditekan, panggil fungsi deleteTask
          ),
        ),
      );
    },
  ),
)
```

**Penjelasan:**

Bagian ini menampilkan seluruh task menggunakan `ListView.builder`, sebuah widget yang efektif untuk menampilkan list dinamis. Setiap item ditampilkan dalam bentuk Card agar lebih rapi dan terlihat profesional. Di dalam card, terdapat ListTile yang memuat teks task serta tombol delete di bagian kanan. Saat tombol delete ditekan, task akan dihapus dari list.

---

**6. Input Task Menggunakan TextField:**

```dart
/// Input Task
Padding(
  padding: const EdgeInsets.symmetric(horizontal: 12),
  // Memberi jarak kiri dan kanan TextField

  child: TextField(
    controller: taskController,
    // Menghubungkan TextField dengan controller input

    decoration: const InputDecoration(
      labelText: 'Masukkan Task',
      // Label di atas input

      border: OutlineInputBorder(),
      // Menampilkan garis border kotak pada TextField
    ),
  ),
)
```

**Penjelasan:**

TextField ini digunakan untuk memasukkan task baru oleh pengguna. Controller `taskController` terhubung untuk membaca teks yang dimasukkan. Selain itu, TextField diberi dekorasi label "Masukkan Task" dan border agar tampilannya lebih jelas dan nyaman digunakan.

---

**7. Tombol Simpan Task:**

```dart
/// Tombol Simpan
Padding(
  padding: const EdgeInsets.only(bottom: 16),
  // Memberi jarak bawah agar tombol tidak mepet

  child: ElevatedButton.icon(
    onPressed: addTask,
    // Ketika tombol ditekan, panggil fungsi addTask()

    icon: const Icon(Icons.add),  
    // Icon tanda +

    label: const Text('Simpan Task'),
    // Teks tombol
  ),
)
```

**Penjelasan:**

Tombol simpan berfungsi untuk mengeksekusi proses penambahan task ketika ditekan. Tombol ini menggunakan ElevatedButton.icon sehingga menampilkan ikon plus dan teks "Simpan Task". Ketika ditekan, fungsi `addTask()` dipanggil untuk memasukkan task baru ke daftar dan menyimpan ke storage.

---
