---
sidebar_position: 6
---

# 📦 Local Storage

Pada dasarnya, aplikasi yang dibuat dengan Flutter tidak secara otomatis menyimpan data ke dalam disk perangkat. Secara default, data hanya disimpan sementara di memori (RAM). Artinya, ketika pengguna menutup aplikasi atau me-restart perangkat, seluruh data tersebut akan hilang dan kembali ke kondisi default.

Sebagai contoh, pada aplikasi yang memiliki fitur Dark Mode dan Light Mode. Ketika pengguna memilih Dark Mode, Flutter akan menampilkan tampilan aplikasi dalam mode gelap. Namun, jika aplikasi ditutup lalu dibuka kembali, pengaturan tema tersebut akan kembali ke default (Light Mode). Hal ini terjadi karena pengaturan tersebut tidak disimpan secara permanen.

Contoh lainnya adalah aplikasi catatan (notes). Jika pengguna menulis sebuah catatan, lalu keluar dari aplikasi tanpa penyimpanan permanen, maka catatan yang telah dibuat akan hilang. Ini tentu tidak diinginkan dalam aplikasi nyata yang digunakan sehari-hari.

Di sinilah peran Local Storage menjadi sangat penting. Local Storage memungkinkan aplikasi menyimpan data langsung ke penyimpanan perangkat (local disk), sehingga data tetap tersedia meskipun aplikasi ditutup atau perangkat dimatikan.

---

## Menyimpan Status Dark Mode

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

## 1. Menggunakan `shared_preferences` untuk Local Storage

Untuk menyimpan data secara permanen, kita akan menggunakan *package* `shared_preferences`.

Tambahkan *Package* Jalankan perintah ini di terminal:

```bash
flutter pub add shared_preferences
```

Kemudian, *import* di file Dart Anda:

```dart
import 'package:shared_preferences/shared_preferences.dart';
```

## 2. Logika Pengambilan Status Tema (Memuat Data)

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

## 3. Logika Perubahan dan Penyimpanan Tema

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

## 4. Inisialisasi Aplikasi (`initState`)

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

## Aplikasi pencatatan tugas

Pada materi sebelumnya, kita telah membuat fitur Dark Mode pada aplikasi. Fitur ini memungkinkan pengguna mengubah tampilan aplikasi menjadi Light Mode atau Dark Mode. Untuk menyimpan pilihan tampilan tersebut, kita menggunakan SharedPreferences sebagai local storage. SharedPreferences cocok digunakan untuk menyimpan data kecil dan sederhana, seperti pengaturan atau preferensi pengguna.

Pada materi kali ini, kita akan menambahkan fitur baru, yaitu pencatatan notes. Fitur ini memungkinkan pengguna untuk membuat dan mengelola catatan secara langsung di dalam aplikasi. Agar catatan tersebut bisa disimpan secara permanen, kita memerlukan local storage yang lebih kuat dan efisien dibandingkan SharedPreferences.
Untuk itu, kita akan menggunakan Hive sebagai local storage utama. Hive adalah database lokal yang ringan, cepat, dan sangat cocok digunakan pada aplikasi Flutter. Hive mampu menyimpan data dalam jumlah lebih banyak dan dalam bentuk yang lebih terstruktur, sehingga ideal untuk menyimpan data notes.

ada akhirnya, aplikasi yang kita bangun akan memiliki dua fitur utama. Pertama, fitur Dark Mode yang menggunakan SharedPreferences untuk menyimpan status tampilan aplikasi. Kedua, fitur CRUD Notes yang menggunakan Hive sebagai media penyimpanan data catatan. Kedua fitur ini saling melengkapi dan menjadi dasar penting dalam pengembangan aplikasi Flutter yang lebih kompleks.
Berikut adalah versi perbaikan dari materi pembelajaran Anda. Saya telah merapikan struktur, memperbaiki alur penjelasan, dan menambahkan komentar pada kode program agar lebih mudah dipahami tanpa mengubah esensi materi asli Anda.

## 1. Persiapan: Impor Package

Langkah pertama adalah menambahkan pustaka (*library*) yang diperlukan untuk membangun antarmuka (UI) dan mengelola penyimpanan data.

```dart
import 'package:flutter/material.dart'; // Library utama UI Flutter
import 'package:hive_flutter/hive_flutter.dart'; // Library database lokal Hive

```

**Penjelasan Utama:**

* `material.dart`: Menyediakan komponen visual seperti tombol, teks, dan tata letak.
* `hive_flutter.dart`: Memungkinkan aplikasi menyimpan data secara permanen di memori ponsel sehingga data tetap ada meskipun aplikasi ditutup.

---

## 2. Inisialisasi Database (Entry Point)

Sebelum aplikasi dijalankan, kita harus menyiapkan sistem Hive agar siap digunakan. Proses ini dilakukan di dalam fungsi `main()`.

```dart
void main() async {
  // 1. Memastikan binding Flutter sudah siap
  WidgetsFlutterBinding.ensureInitialized(); 
  
  // 2. Inisialisasi Hive khusus untuk Flutter
  await Hive.initFlutter(); 
  
  // 3. Membuka "Box" (Wadah penyimpanan)
  // Box di Hive setara dengan tabel pada SQL atau koleksi pada NoSQL
  await Hive.openBox('storageNotes');
  
  runApp(const MyApp());
}

```

**Konsep Penting:**

* `async` & `await`: Digunakan karena proses membuka database membutuhkan waktu (asynchronous). Kita harus menunggu Hive siap sebelum aplikasi muncul.
* `openBox`: Membuat ruang penyimpanan bernama `'storageNotes'`. Anda bisa memberi nama apa saja sesuai kebutuhan.

---

## 3. Struktur Halaman Utama (`NotesPage`)

Di dalam `StatefulWidget`, kita perlu mendefinisikan variabel untuk mengakses database dan mengontrol teks input.

```dart
class _NotesPageState extends State<NotesPage> {
  // Referensi ke Box yang sudah dibuka di main.dart
  final Box _notesBox = Hive.box('storageNotes');
  
  // Controller untuk menangkap input teks dari user
  final TextEditingController _addController = TextEditingController(); // Untuk input baru
  final TextEditingController _editController = TextEditingController(); // Untuk dialog edit

```

---

## 4. Implementasi Logika CRUD

CRUD adalah singkatan dari *Create, Read, Update,* dan *Delete*. Berikut adalah fungsi-fungsinya:

A. Tambah Data (Create)

Menyimpan catatan baru ke dalam Hive. Data disimpan dalam format **Map** (`key: value`).

```dart
void _addNote() {
  if (_addController.text.trim().isEmpty) return; // Validasi: Jangan simpan jika kosong
  
  _notesBox.add({
    'text': _addController.text, 
    'isDone': false
  }); 
  
  _addController.clear(); // Bersihkan input setelah klik tambah
}

```

B. Update Status Checklist (Update)

Mengubah status catatan (selesai atau belum).

```dart
void _toggleDone(int index) {
  final note = _notesBox.getAt(index); // Ambil data lama berdasarkan urutan (index)
  
  // Simpan kembali ke index yang sama dengan nilai 'isDone' yang dibalik
  _notesBox.putAt(index, {
    'text': note['text'], 
    'isDone': !note['isDone']
  });
}

```

C. Edit Teks Catatan (Update)

Menampilkan dialog untuk mengubah isi teks catatan.

```dart
void _editNote(int index) {
  final note = _notesBox.getAt(index);
  _editController.text = note['text']; // Isi field dengan teks lama

  showDialog(
    context: context,
    builder: (context) => AlertDialog(
      title: const Text('Edit Catatan'),
      content: TextField(controller: _editController, autofocus: true),
      actions: [
        TextButton(onPressed: () => Navigator.pop(context), child: const Text('Batal')),
        ElevatedButton(
          onPressed: () {
            if (_editController.text.trim().isEmpty) return;
            _notesBox.putAt(index, {
              'text': _editController.text,
              'isDone': note['isDone'],
            });
            _editController.clear();
            Navigator.pop(context);
          },
          child: const Text('Simpan'),
        ),
      ],
    ),
  );
}

```

D. Hapus Data (Delete)

```dart
void _deleteNote(int index) {
  _notesBox.deleteAt(index); // Menghapus permanen data di index tersebut
}

```

Manajemen Memori (Dispose)

Sangat penting untuk menghapus controller saat halaman tidak lagi digunakan agar tidak terjadi kebocoran memori (*memory leak*).

```dart
@override
void dispose() {
  _addController.dispose();
  _editController.dispose();
  super.dispose();
}

```

---

## 5. User Interface

Bagian ini adalah yang paling penting karena harus memperbarui layar secara otomatis saat data di database berubah. Kita menggunakan `ValueListenableBuilder`.

```dart
// Widget ini mendengarkan perubahan pada _notesBox secara Real-Time
ValueListenableBuilder(
  valueListenable: _notesBox.listenable(), // Pantau perubahan data
  builder: (context, Box box, _) {
    if (box.isEmpty) {
      return const Center(child: Text('Belum ada catatan'));
    }

    // Menggunakan ListView untuk menampilkan data dalam bentuk daftar
    return ListView.builder(
      itemCount: box.length, // Berapa banyak data yang ada
      itemBuilder: (context, index) {
        final note = box.getAt(index); // Ambil data per baris
        return ListTile(
          title: Text(note['text']), // Tampilkan teks catatan
          // ... (kode lainnya)
        );
      },
    );
  },
)

```

**Penjelasan Singkat:**

* **`ValueListenableBuilder`**: Ibarat "satpam" yang terus melihat ke database. Begitu ada data masuk, hapus, atau edit, dia langsung menyuruh UI untuk "gambar ulang" (refresh).
* **`ListView.builder`**: Digunakan agar aplikasi lancar saat menampilkan banyak data sekaligus.

---

UI Menambahkan Data (Create)

Tombol dan kolom input untuk menambah catatan biasanya diletakkan di bagian bawah layar.

```dart
// Kolom Input di bagian bawah
TextField(
  controller: _addController, // Menangkap apa yang diketik user
  decoration: const InputDecoration(hintText: 'Tulis catatan...'),
),

// Tombol Kirim/Tambah
IconButton(
  icon: const Icon(Icons.add),
  onPressed: _addNote, // Memanggil fungsi logika _addNote() yang sudah dibuat
),

```

**Penjelasan Singkat:**

* **`TextField`**: Tempat user mengetik.
* **`_addNote`**: Saat tombol ditekan, UI memicu logika untuk menyimpan teks dari `_addController` ke dalam Hive.

---

UI Mengubah Status & Edit (Update)

Ada dua jenis update di sini: mengubah status (checklist) dan mengubah teks (edit).

**A. Checklist (Update isDone):**

```dart
leading: Checkbox(
  value: note['isDone'], // Menampilkan tanda centang jika true
  onChanged: (_) => _toggleDone(index), // Memicu logika _toggleDone
),

```

Tombol Edit (Update Text):**

```dart
IconButton(
  icon: const Icon(Icons.edit),
  onPressed: () => _editNote(index), // Memunculkan Pop-up Dialog Edit
),

```

**Penjelasan Singkat:**

* UI memberikan akses kepada user melalui icon. Saat icon **Edit** diklik, fungsi `_editNote` akan menjalankan perintah `showDialog` untuk menampilkan jendela kecil tempat user memperbaiki teks.

---

UI Menghapus Data (Delete)

Biasanya menggunakan ikon tong sampah di sebelah kanan setiap baris catatan.

```dart
IconButton(
  icon: const Icon(Icons.delete, color: Colors.red),
  onPressed: () => _deleteNote(index), // Memicu logika _deleteNote
),

```

**Penjelasan Singkat:**

* **`index`**: UI mengirimkan nomor urut catatan tersebut ke fungsi `_deleteNote`. Dengan begitu, Hive tahu persis catatan mana yang harus dibuang dari memori.

---

## Kode Lengkap (Full Code)

Berikut adalah gabungan seluruh logika di atas menjadi satu file aplikasi yang siap dijalankan.

```jsx
import 'package:flutter/material.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() async {
  // Memastikan binding framework Flutter sudah siap sebelum menjalankan kode async
  WidgetsFlutterBinding.ensureInitialized();

  // Inisialisasi Hive (Database lokal yang cepat) untuk Flutter
  await Hive.initFlutter();

  // Membuka "box" (seperti tabel/koleksi) bernama 'storageNotes' untuk menyimpan data
  await Hive.openBox('storageNotes');

  runApp(const MyApp());
}

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  // Variabel untuk menyimpan status tema (Terang atau Gelap)
  ThemeMode _themeMode = ThemeMode.light;

  @override
  void initState() {
    super.initState();
    // Memuat preferensi tema yang disimpan saat aplikasi pertama kali dibuka
    _loadTheme();
  }

  // Mengambil status tema dari memori handphone (SharedPreferences)
  Future<void> _loadTheme() async {
    final prefs = await SharedPreferences.getInstance();
    // Jika data 'isDark' tidak ada, maka default-nya false (light)
    final isDark = prefs.getBool('isDark') ?? false;
    setState(() {
      _themeMode = isDark ? ThemeMode.dark : ThemeMode.light;
    });
  }

  // Fungsi untuk mengganti tema dan menyimpannya secara permanen
  void toggleTheme() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      if (_themeMode == ThemeMode.light) {
        _themeMode = ThemeMode.dark;
        prefs.setBool('isDark', true);
      } else {
        _themeMode = ThemeMode.light;
        prefs.setBool('isDark', false);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: ThemeData.light(),
      darkTheme: ThemeData.dark(),
      themeMode: _themeMode, // Mengontrol tema aplikasi berdasarkan state
      home: NotesPage(onThemeToggle: toggleTheme),
    );
  }
}

class NotesPage extends StatefulWidget {
  final VoidCallback onThemeToggle;
  const NotesPage({super.key, required this.onThemeToggle});

  @override
  State<NotesPage> createState() => _NotesPageState();
}

class _NotesPageState extends State<NotesPage> {
  // Mengambil referensi box Hive yang sudah dibuka di main()
  final Box _notesBox = Hive.box('storageNotes');

  // Controller untuk menangkap input teks dari user
  final TextEditingController _addController = TextEditingController();
  final TextEditingController _editController = TextEditingController();

  // Fungsi menambah catatan baru ke database Hive
  void _addNote() {
    if (_addController.text.trim().isEmpty) return; // Jangan simpan jika kosong
    // Menyimpan data berupa Map (key-value pair)
    _notesBox.add({
      'text': _addController.text,
      'isDone': false, // Default catatan baru belum selesai
    });
    _addController.clear(); // Bersihkan kolom input setelah menambah
  }

  // Fungsi mengganti status ceklis (Selesai / Belum Selesai)
  void _toggleDone(int index) {
    final note = _notesBox.getAt(index);
    // putAt digunakan untuk mengganti data pada posisi (index) tertentu
    _notesBox.putAt(index, {
      'text': note['text'],
      'isDone':
          !note['isDone'], // Membalikkan nilai true jadi false, atau sebaliknya
    });
  }

  // Fungsi untuk menampilkan dialog edit
  void _editNote(int index) {
    final note = _notesBox.getAt(index);
    _editController.text = note['text'];

    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Edit Note'),
          content: TextField(
            controller: _editController,
            autofocus: true,
            decoration: const InputDecoration(hintText: "Ubah catatanmu..."),
          ),
          actions: [
            TextButton(
              onPressed: () {
                _editController.clear();
                Navigator.pop(context); // Tutup dialog
              },
              child: const Text('Batal'),
            ),
            ElevatedButton(
              onPressed: () {
                if (_editController.text.trim().isEmpty) return;
                // Update data di database pada index yang diklik
                _notesBox.putAt(index, {
                  'text': _editController.text,
                  'isDone': note['isDone'],
                });
                _editController.clear();
                Navigator.pop(context);
              },
              child: const Text('Simpan'),
            ),
          ],
        );
      },
    );
  }

  // Menghapus data dari database berdasarkan index
  void _deleteNote(int index) {
    _notesBox.deleteAt(index);
  }

  @override
  void dispose() {
    // Menghapus controller dari memori saat page ditutup agar tidak terjadi memory leak
    _addController.dispose();
    _editController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Assalamualaikum'),
        centerTitle: true,
        actions: [
          IconButton(
            onPressed: widget.onThemeToggle,
            icon: Icon(_notesBox.isEmpty ? Icons.dark_mode : Icons.dark_mode),
          ),
        ],
      ),
      body: Column(
        children: [
          Expanded(
            // ValueListenableBuilder: Widget ajaib yang akan membangun ulang tampilannya
            // secara otomatis setiap kali data di dalam Hive (box) berubah.
            child: ValueListenableBuilder(
              valueListenable: _notesBox.listenable(),
              builder: (context, Box box, _) {
                if (box.isEmpty) {
                  return const Center(child: Text('Belum ada catatan.'));
                }

                return ListView.builder(
                  itemCount: box.length,
                  itemBuilder: (context, index) {
                    final note = box.getAt(index);
                    final bool isDone = note['isDone'];

                    return ListTile(
                      leading: Checkbox(
                        value: isDone,
                        onChanged: (_) => _toggleDone(index),
                      ),
                      // BAGIAN CORET TEKS: Menggunakan TextStyles.lineThrough jika isDone bernilai true
                      title: Text(
                        note['text'],
                        style: TextStyle(
                          decoration: isDone
                              ? TextDecoration.lineThrough
                              : TextDecoration.none,
                          color: isDone
                              ? Colors.grey
                              : null, // Warna memudar jika selesai
                        ),
                      ),
                      trailing: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          IconButton(
                            icon: const Icon(Icons.edit, color: Colors.orange),
                            onPressed: () => _editNote(index),
                          ),
                          IconButton(
                            icon: const Icon(Icons.delete, color: Colors.red),
                            onPressed: () => _deleteNote(index),
                          ),
                        ],
                      ),
                    );
                  },
                );
              },
            ),
          ),
          // Area Input di bagian bawah
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 15, vertical: 8),
            decoration: BoxDecoration(
              color: Theme.of(context).cardColor,
              boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 4)],
            ),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _addController,
                    decoration: const InputDecoration(
                      hintText: 'Tambah catatan baru...',
                      border: InputBorder.none,
                    ),
                    onSubmitted: (_) => _addNote(), // Tekan enter untuk tambah
                  ),
                ),
                IconButton(
                  icon: const Icon(
                    Icons.add_circle,
                    size: 30,
                    color: Colors.blue,
                  ),
                  onPressed: _addNote,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
```
