---
sidebar_position: 14
---

# Rest api crud notes

Dokumentasi ini memberikan panduan langkah demi langkah dalam membangun aplikasi catatan (notes) sederhana menggunakan **Flutter** sebagai framework frontend dan **PocketBase** sebagai backend.

---

## 1: Persiapan Lingkungan Kerja

Langkah awal adalah menyiapkan proyek Flutter dan mengintegrasikan pustaka (library) yang diperlukan.

1 Inisialisasi Proyek Flutter

Buka terminal atau command prompt, kemudian jalankan perintah berikut untuk membuat proyek baru:

```bash
flutter create note_app
cd note_app
```

2 Instalasi Dependencies

Kita memerlukan dua paket utama untuk fitur fungsionalitas aplikasi:

1. **`shared_preferences`**: Digunakan untuk menyimpan preferensi pengguna (seperti tema) secara lokal di perangkat.
2. **`pocketbase`**: SDK resmi untuk menghubungkan aplikasi Flutter dengan server PocketBase.

Jalankan perintah ini di terminal:

```bash
flutter pub add shared_preferences pocketbase
```

3 Konfigurasi Backend (PocketBase)

Sebelum masuk ke kode, siapkan database Anda:

1. **Jalankan server PocketBase** ( `./pocketbase serve` ).
2. Buka Admin UI (biasanya di `http://127.0.0.1:8090/_/`).
3. **Buat Collection Baru**:

* Nama: `notes`
* Fields:
* `title` (Type: Plain Text) — Untuk menyimpan isi catatan.
* `is_done` (Type: Bool) — Untuk status penyelesaian catatan.

1. **API Rules**: Atur Permissions pada bagian `List/Search`, `View`, `Create`, `Update`, dan `Delete` menjadi **"Public"** (kosongkan constraint) agar aplikasi dapat mengakses data tanpa login terlebih dahulu (untuk keperluan belajar).

4 Arsitektur Folder

Agar proyek rapi dan mudah dikelola (maintainable), gunakan struktur folder berikut:

```jsx
lib/
├── main.dart                 # Titik masuk utama aplikasi
├── screens/                  # Folder untuk tampilan (UI)
│   └── home_page.dart        # Halaman utama daftar catatan
└── services/                 # Folder untuk logika bisnis/API
    ├── theme_service.dart    # Pengaturan tema (Dark/Light)
    └── pocketbase_service.dart # Komunikasi dengan server

```

---

## 2: Layanan Manajemen Tema

File ini bertanggung jawab untuk menyimpan pilihan tema pengguna agar tidak hilang saat aplikasi ditutup.

**File:** `lib/services/theme_service.dart`

```jsx
import 'package:shared_preferences/shared_preferences.dart';

class ThemeService {
  // Kunci unik untuk menyimpan data di memori perangkat
  static const String _themeKey = 'isDark';

  // Fungsi untuk mengambil status tema yang tersimpan
  // Mengembalikan [true] jika Dark Mode, [false] jika Light Mode
  static Future<bool> loadTheme() async {
    // Membuka koneksi ke SharedPreferences
    final prefs = await SharedPreferences.getInstance();
    
    // Membaca nilai berdasarkan kunci, jika null (pertama kali buka), berikan false
    return prefs.getBool(_themeKey) ?? false;
  }

  // Fungsi untuk menyimpan status tema ke penyimpanan lokal
  static Future<void> saveTheme(bool isDark) async {
    final prefs = await SharedPreferences.getInstance();
    
    // Menyimpan nilai boolean (true/false) ke dalam storage
    await prefs.setBool(_themeKey, isDark);
  }
}

```

---

## 3: Konfigurasi Utama (Entry Point)

`main.dart` adalah jantung dari aplikasi. Di sini kita mengatur logika perubahan tema secara global.

**File:** `lib/main.dart`

```jsx
import 'package:flutter/material.dart';
import 'screens/home_page.dart';
import 'services/theme_service.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  // Variabel default tema aplikasi
  ThemeMode _themeMode = ThemeMode.light;

  @override
  void initState() {
    super.initState();
    // Memanggil fungsi load tema saat aplikasi pertama kali dijalankan
    _initTheme();
  }

  // Mengambil data tema dari storage dan menerapkannya ke UI
  Future<void> _initTheme() async {
    final isDark = await ThemeService.loadTheme();
    setState(() {
      _themeMode = isDark ? ThemeMode.dark : ThemeMode.light;
    });
  }

  // Fungsi untuk mengubah tema (di panggil dari halaman lain)
  void toggleTheme() async {
    // Jika sekarang light, maka targetnya adalah dark (true)
    final isDark = _themeMode == ThemeMode.light;

    // 1. Simpan perubahan ke storage secara permanen
    await ThemeService.saveTheme(isDark);

    // 2. Update tampilan aplikasi (State)
    setState(() {
      _themeMode = isDark ? ThemeMode.dark : ThemeMode.light;
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(

      debugShowCheckedModeBanner: false,
      title: 'Note App',

      theme: ThemeData.light(),
      darkTheme: ThemeData.dark(),
  

      // Menentukan tema mana yang sedang aktif
      themeMode: _themeMode,

      // Menampilkan halaman utama dan mengirim fungsi toggleTheme
      home: HomePages(onThemeToggle: toggleTheme),
    );
  }
}

```

---

## 4: Halaman Utama (Interface)

Halaman ini berfungsi untuk menampilkan daftar catatan dan tombol kontrol tema.

**File:** `lib/screens/home_page.dart`

```jsx
import 'package:flutter/material.dart';

class HomePages extends StatefulWidget {
  // Menerima fungsi callback dari main.dart untuk mengubah tema
  final VoidCallback onThemeToggle;

  const HomePages({
    super.key,
    required this.onThemeToggle,
  });

  @override
  State<HomePages> createState() => _HomePagesState();
}

class _HomePagesState extends State<HomePages> {
  @override
  Widget build(BuildContext context) {
    // Mengambil status apakah sedang dark mode untuk menentukan icon
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: const Text('My Notes'),
        centerTitle: true,
        actions: [
          // Tombol untuk berpindah tema
          IconButton(
            icon: Icon(isDark ? Icons.light_mode : Icons.dark_mode),
            onPressed: widget.onThemeToggle, // Menjalankan fungsi yang dikirim dari main.dart
            tooltip: 'Ganti Tema',
          ),
        ],
      ),
      body: const Center(
        child: 
            Text(
              'Halaman Notes Siap Diisi!',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.w500),
            ),
      ),
  }
}
```

---

## 5: Layanan Komunikasi Data (PocketBase Service)

File ini bertindak sebagai jembatan antara aplikasi Flutter dan database PocketBase. Semua logika pengambilan dan manipulasi data dikumpulkan di sini agar kode lebih rapi.

**File:** `lib/services/pocketbase_service.dart`

```jsx
import 'package:pocketbase/pocketbase.dart';

class PocketbaseService {
  // Alamat server PocketBase (sesuaikan jika server Anda memiliki IP berbeda)
  static final pb = PocketBase('http://127.0.0.1:8090');

  // MENGAMBIL DATA: Mendapatkan semua catatan dari collection 'notes'
  // Diurutkan berdasarkan status 'is_done' (yang belum di atas) 
  // dan waktu pembuatan terbaru.
  static Future<List<RecordModel>> getAllNote() async {
    return await pb.collection('notes').getFullList(
      sort: 'is_done,-created', 
    );
  }

  // MENAMBAH DATA: Membuat baris baru di collection 'notes'
  static Future<void> addNote(String title) async {
    await pb.collection('notes').create(
      body: {
        'title': title,
        'is_done': false, // Default catatan baru adalah belum selesai
      },
    );
  }

  // MENGHAPUS DATA: Menghapus catatan berdasarkan ID uniknya
  static Future<void> deleteNote(String id) async {
    await pb.collection('notes').delete(id);
  }

  // MEMPERBARUI DATA: Mengubah isi teks (title) catatan
  static Future<void> updateNote(String id, String title) async {
    await pb.collection('notes').update(
      id,
      body: {'title': title},
    );
  }

  // TOGGLE STATUS: Mengubah status selesai/belum selesai
  static Future<void> toggleDone(String id, bool currentStatus) async {
    await pb.collection('notes').update(
      id,
      body: {'is_done': !currentStatus}, // Membalikkan nilai boolean
    );
  }
}

```

---

## 6: Logika Bisnis pada Halaman Utama

Kita perlu menambahkan variabel dan fungsi kontrol di dalam `_HomePagesState` agar UI dapat berinteraksi dengan `PocketbaseService`.

**File:** `lib/screens/home_page.dart` (Bagian Logic)

```jsx
// ... (lanjutan dari _HomePagesState)

// Controller untuk menangkap input teks dari user
final TextEditingController _noteController = TextEditingController();

// Variabel penampung data dari PocketBase
late Future<List<RecordModel>> _notes;

@override
void initState() {
  super.initState();
  _refreshNotes(); // Ambil data saat halaman pertama kali dibuka
}

// Fungsi untuk memicu pengambilan ulang data dari server
void _refreshNotes() {
  _notes = PocketbaseService.getAllNote();
}

// Fungsi Logic untuk Menambah Catatan
Future<void> _addNote() async {
  if (_noteController.text.isEmpty) return; // Jangan proses jika kosong

  await PocketbaseService.addNote(_noteController.text);
  _noteController.clear(); // Bersihkan kolom input setelah input sukses

  setState(_refreshNotes); // Perbarui tampilan
}

// Fungsi Logic untuk Menghapus Catatan
Future<void> _deleteNote(String id) async {
  await PocketbaseService.deleteNote(id);
  setState(_refreshNotes);
}

// Fungsi Logic untuk Mengubah Status Ceklis
Future<void> _toggleDone(String id, bool isDone) async {
  await PocketbaseService.toggleDone(id, isDone);
  setState(_refreshNotes);
}

// Menampilkan Dialog untuk Mengedit Judul Catatan
void _showEditDialog(RecordModel note) {
  // Isi controller dengan teks lama agar user tinggal mengubahnya
  final editController = TextEditingController(text: note.getStringValue('title'));

  showDialog(
    context: context,
    builder: (context) => AlertDialog(
      title: const Text('Edit Catatan'),
      content: TextField(
        controller: editController,
        autofocus: true,
        decoration: const InputDecoration(labelText: 'Judul Baru'),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context),
          child: const Text('Batal'),
        ),
        ElevatedButton(
          onPressed: () async {
            await PocketbaseService.updateNote(note.id, editController.text);
            if (!mounted) return;
            setState(_refreshNotes); // Refresh list
            Navigator.pop(context);   // Tutup dialog
          },
          child: const Text('Simpan'),
        ),
      ],
    ),
  );
}

```

---

## 7: Pembangunan Antarmuka (UI) CRUD

Terakhir, kita susun elemen-elemen UI di dalam metode `build` untuk menampilkan data secara dinamis.

**File:** `lib/screens/home_page.dart` (Bagian UI)

```jsx
@override
Widget build(BuildContext context) {
  return Scaffold(
    appBar: AppBar(
      title: const Text('Catatan Harian'),
      // ... (tombol toggle tema dari dokumentasi sebelumnya)
    ),
    body: Column(
      children: [
        // 1. AREA DAFTAR CATATAN (Dinamis)
        Expanded(
          child: FutureBuilder<List<RecordModel>>(
            future: _notes, // Sumber data
            builder: (context, snapshot) {
              // Saat loading
              if (snapshot.connectionState == ConnectionState.waiting) {
                return const Center(child: CircularProgressIndicator());
              }
              // Jika error atau data kosong
              if (!snapshot.hasData || snapshot.data!.isEmpty) {
                return const Center(child: Text('Belum ada catatan.'));
              }
              final notes = snapshot.data!;
              return ListView.builder(
                itemCount: notes.length,
                itemBuilder: (context, index) {
                  final note = notes[index];
                  final isDone = note.getBoolValue('is_done');

                  return ListTile(
                    // Ceklis di sebelah kiri
                    leading: Checkbox(
                      value: isDone,
                      onChanged: (_) => _toggleDone(note.id, isDone),
                    ),
                    // Judul Catatan
                    title: Text(
                      note.getStringValue('title'),
                      style: TextStyle(
                        decoration: isDone ? TextDecoration.lineThrough : null,
                        color: isDone ? Colors.grey : null,
                      ),
                    ),
                    // Menu opsi (Edit/Hapus) di sebelah kanan
                    trailing: PopupMenuButton<String>(
                      onSelected: (value) {
                        if (value == 'edit') _showEditDialog(note);
                        if (value == 'delete') _deleteNote(note.id);
                      },
                      itemBuilder: (context) => [
                        const PopupMenuItem(value: 'edit', child: Text('Edit')),
                        const PopupMenuItem(
                          value: 'delete', 
                          child: Text('Hapus', style: TextStyle(color: Colors.red)),
                        ),
                      ],
                    ),
                  );
                },
              );
            },
          ),
        ),
        // 2. AREA INPUT (Bagian Bawah)
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
          decoration: BoxDecoration(
            color: Theme.of(context).cardColor,
            boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 4)],
          ),
          child: Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _noteController,
                  decoration: const InputDecoration(
                    hintText: 'Tulis catatan baru...',
                    border: InputBorder.none,
                  ),
                  onSubmitted: (_) => _addNote(), // Tekan Enter untuk kirim
                ),
              ),
              IconButton(
                icon: const Icon(Icons.send_rounded, color: Colors.blue),
                onPressed: _addNote,
              ),
            ],
          ),
        ),
      ],
    ),
  );
}

```
