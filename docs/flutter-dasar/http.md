---
sidebar_position: 7
---

# 🌐 Working Http

Dalam perkembangan teknologi saat ini, hampir semua aplikasi yang kita gunakan setiap hari—seperti Instagram, Shopee, WhatsApp, atau aplikasi keuangan—memerlukan koneksi internet untuk bekerja. Ketika sebuah aplikasi ingin mengambil data dari server, mengirim data ke server, atau berinteraksi dengan layanan lain di internet, aplikasi tersebut membutuhkan sebuah “jembatan penghubung”. Jembatan itulah yang disebut **API**. Tanpa API, aplikasi modern tidak bisa menampilkan data, tidak bisa login, tidak bisa mengirim formulir, dan pada dasarnya tidak dapat melakukan komunikasi apa pun dengan dunia luar.

## Apa itu API?

**API (Application Programming Interface)** adalah sebuah jembatan komunikasi yang memungkinkan aplikasi Flutter berinteraksi dengan internet, server, atau layanan lain.  

- **Flutter = Pelanggan 🍽️**  
  - **Ilustrasi:** Kamu duduk di meja restoran ingin makan, tapi tidak bisa langsung masuk ke dapur.  
  - **Penjelasan:** Flutter ingin data (misal data user) tetapi tidak bisa langsung mengambil dari database server.

- **API = Pelayan 🧑‍🍳**  
  - **Ilustrasi:** Pelayan datang ke meja dan bertanya, “Mau pesan apa?”  
  - **Penjelasan:** API menerima permintaan dari Flutter, membawa ke server, lalu mengantar hasilnya kembali ke Flutter.

- **HTTP Request = Pesanan 📝**  
  - **Ilustrasi:** Kamu bilang, “Saya pesan Nasi Goreng!”  
  - **Penjelasan:** Flutter mengirim request (permintaan) untuk mengambil data dari server.

- **Server & Database = Dapur & Bahan Makanan 🍳🥦**  
  - **Ilustrasi:** Di dapur, koki membaca pesanan, memasak, dan menyiapkan makanan dari bahan-bahan yang ada.  
  - **Penjelasan:** Server memproses request, mengambil data dari database, dan menyiapkan hasilnya.

- **Response = Makanan Siap 🍛**  
  - **Ilustrasi:** Koki menyerahkan makanan ke pelayan, pelayan membawa ke mejamu.  
  - **Penjelasan:** Server mengirim data kembali ke Flutter, seperti pelayan mengantarkan makanan.

- **Flutter Menampilkan Data 📱**  
  - **Ilustrasi:** Kamu menerima makanan dan mulai menyantapnya.  
  - **Penjelasan:** Flutter menerima data dan menampilkannya di UI agar user bisa melihatnya.

---

## Get Api

Mengambil data dari internet diperlukan untuk sebagian besar aplikasi. Untungnya, Dart dan Flutter menyediakan alat, seperti **http paket**, untuk jenis pekerjaan ini.

**Catatan:**  
Anda sebaiknya menghindari penggunaan `dart:io` atau `dart:html` untuk pembuatan permintaan HTTP secara langsung. Pustaka tersebut bergantung pada platform dan terikat pada satu implementasi.

Resep ini menggunakan langkah-langkah berikut:

1. Tambahkan **http paket**.  
2. Buat permintaan jaringan menggunakan **http paket**.  
3. Ubah respons menjadi objek Dart kustom.  
4. Ambil dan tampilkan data dengan Flutter.

---

### 1. Tambahkan `http` paket

Paket ini `http` menyediakan cara paling sederhana untuk mengambil data dari internet.  

Untuk menambahkan `http` paket sebagai dependensi, jalankan:

```bash
flutter pub add http
````

Impor paket `http`:

```dart
import 'package:http/http.dart' as http;
```

Jika Anda menerapkannya ke Android, edit **AndroidManifest.xml** berkas Anda untuk menambahkan izin Internet:

```xml
<!-- Required to fetch data from the internet. -->
<uses-permission android:name="android.permission.INTERNET" />
```

Demikian pula, jika Anda menerapkan ke macOS, edit file `macos/Runner/DebugProfile.entitlements` dan `macos/Runner/Release.entitlements` untuk menyertakan hak klien jaringan:

```xml
<!-- Required to fetch data from the internet. -->
<key>com.apple.security.network.client</key>
<true/>
```

---

### 2. Buat Permintaan Jaringan

Resep ini membahas cara mengambil album sampel dari JSONPlaceholder menggunakan metode `http.get()`:

```dart
Future<http.Response> fetchAlbum() {
  return http.get(Uri.parse('https://jsonplaceholder.typicode.com/albums/1'));
}
```

Metode `http.get()` mengembalikan **Future** yang berisi **Response**.

***Future** adalah kelas inti Dart untuk bekerja dengan operasi asinkron. Objek Future merepresentasikan nilai potensial atau kesalahan yang akan tersedia di masa mendatang.
Kelas **http.Response** berisi data yang diterima dari panggilan http yang berhasil.

---

### 3. Ubah Respons Menjadi Objek Dart Khusus

Meskipun mudah untuk membuat permintaan jaringan, bekerja dengan file mentah `Future<http.Response>` tidaklah nyaman. Untuk mempermudah, ubahlah `http.Response` menjadi objek Dart.

#### Buat Kelas Album

Pertama, buat kelas **Album** yang berisi data dari permintaan jaringan. Kelas ini mencakup konstruktor pabrik yang membuat Album dari JSON:

```dart
class Album {
  final int userId;
  final int id;
  final String title;

  const Album({required this.userId, required this.id, required this.title});

  factory Album.fromJson(Map<String, dynamic> json) {
    return switch (json) {
      {'userId': int userId, 'id': int id, 'title': String title} => Album(
        userId: userId,
        id: id,
        title: title,
      ),
      _ => throw const FormatException('Failed to load album.'),
    };
  }
}
```

#### Konversikan `http.Response` ke `Album`

Gunakan langkah-langkah berikut untuk memperbarui `fetchAlbum()` agar mengembalikan `Future<Album>`:

1. Ubah badan respons menjadi JSON Map dengan paket `dart:convert`.
2. Jika server mengembalikan respons OK dengan kode status 200, ubah JSON Map menjadi Album menggunakan metode pabrik `fromJson()`.
3. Jika server tidak mengembalikan respons OK dengan kode status 200, lemparkan pengecualian.

```dart
Future<Album> fetchAlbum() async {
  final response = await http.get(
    Uri.parse('https://jsonplaceholder.typicode.com/albums/1'),
  );

  if (response.statusCode == 200) {
    // If the server did return a 200 OK response,
    // then parse the JSON.
    return Album.fromJson(jsonDecode(response.body) as Map<String, dynamic>);
  } else {
    // If the server did not return a 200 OK response,
    // then throw an exception.
    throw Exception('Failed to load album');
  }
}
```

Hore! Sekarang Anda punya fungsi untuk mengambil album dari internet.

---

### 4. Ambil Datanya

Panggil `fetchAlbum()` dalam metode `initState()` atau `didChangeDependencies()`.

```dart
class _MyAppState extends State<MyApp> {
  late Future<Album> futureAlbum;

  @override
  void initState() {
    super.initState();
    futureAlbum = fetchAlbum();
  }
  // ···
}
```

Future ini digunakan pada langkah berikutnya.

---

### 5. Menampilkan Data

Untuk menampilkan data di layar, gunakan **FutureBuilder** widget. Widget ini disertakan dengan Flutter dan memudahkan Anda bekerja dengan sumber data asinkron.

Anda harus memberikan dua parameter:

1. **Future** yang ingin Anda kerjakan. Dalam hal ini, nilai masa depan dikembalikan dari fungsi `fetchAlbum()`.
2. **Fungsi builder** yang memberi tahu Flutter apa yang harus dirender, tergantung pada status Future: pemuatan, keberhasilan, atau kesalahan.

```dart
FutureBuilder<Album>(
  future: futureAlbum,
  builder: (context, snapshot) {
    if (snapshot.hasData) {
      return Text(snapshot.data!.title);
    } else if (snapshot.hasError) {
      return Text('${snapshot.error}');
    }

    // By default, show a loading spinner.
    return const CircularProgressIndicator();
  },
)
```

#### Mengapa `fetchAlbum()` dipanggil dalam `initState()`?

Meskipun nyaman, tidak disarankan untuk memasukkan panggilan API dalam metode `build()`. Flutter memanggil `build()` setiap kali perlu mengubah tampilan, yang cukup sering terjadi. Jika `fetchAlbum()` ditempatkan di `build()`, maka akan dipanggil berulang kali, membuat aplikasi lambat.

Menyimpan hasil `fetchAlbum()` dalam variabel status memastikan Future hanya dieksekusi satu kali dan kemudian di-cache untuk pembuatan ulang berikutnya.

```dart
return Text('${snapshot.error}');
}
// Sementara menunggu data, tampilkan loading spinner
return const CircularProgressIndicator();
```

**Code Lengkap:**

```jsx
import 'dart:convert'; // Digunakan untuk mengubah string JSON menjadi Map di Dart
import 'package:http/http.dart' as http; // Paket HTTP untuk melakukan request ke API
import 'package:flutter/material.dart'; 

void main() {
  runApp(MyApp()); // Menjalankan aplikasi Flutter, MyApp adalah root widget
}

// Fungsi untuk mengambil data album dari API secara asinkron
Future<Album> fetchAlbum() async {
  // Mengirim GET request ke API JSONPlaceholder
  final response = await http.get(
    Uri.parse('https://jsonplaceholder.typicode.com/albums/1'),
  );

  // Mengecek apakah status code berhasil (200 OK)
  if (response.statusCode == 200) {
    // Jika berhasil, ubah string JSON menjadi objek Album menggunakan fromJson
    return Album.fromJson(jsonDecode(response.body) as Map<String, dynamic>);
  } else {
    // Jika gagal, lempar exception agar bisa ditangani di UI
    throw Exception('Failed to load album');
  }
}

// Model data Album
class Album {
  final int userId; // ID pengguna pemilik album
  final int id;     // ID album
  final String title; // Judul album

  // Konstruktor Album, semua field wajib diisi
  Album({required this.userId, required this.id, required this.title});

  // Factory constructor untuk mengubah Map JSON menjadi objek Album
  factory Album.fromJson(Map<String, dynamic> json) {
    // Menggunakan switch pattern untuk validasi struktur JSON
    return switch (json) {
      {'userId': int userId, 'id': int id, 'title': String title} => Album(
        userId: userId,
        id: id,
        title: title,
      ),
      // Jika JSON tidak sesuai format, lempar FormatException
      _ => throw const FormatException('Failed to load album'),
    };
  }
}

// Root widget aplikasi
class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

// State utama aplikasi
class _MyAppState extends State<MyApp> {
  // Future untuk menyimpan hasil API agar tidak dipanggil ulang saat build
  late Future<Album> futureAlbum;

  @override
  void initState() {
    super.initState();
    // Memanggil API satu kali saat widget dibuat
    futureAlbum = fetchAlbum();
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(title: Text('Fetch API')), // Judul aplikasi
        body: Center(
          // FutureBuilder digunakan untuk menampilkan data dari Future
          child: FutureBuilder<Album>(
            future: futureAlbum, // Future yang ingin ditampilkan
            builder: (context, snapshot) {
              // Jika data sudah tersedia, tampilkan judul album
              if (snapshot.hasData) {
                return Text(snapshot.data!.title);
              } 
              // Jika terjadi error, tampilkan pesan error
              else if (snapshot.hasError) {
                return Text('${snapshot.error}');
              }
              // Sementara menunggu data, tampilkan loading spinner
              return const CircularProgressIndicator();
            },
          ),
        ),
      ),
    );
  }
}

```

## Post Api

```jsx
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

void main() {
  runApp(const MyApp()); // Menjalankan aplikasi utama
}

// Model data Todo untuk merepresentasikan struktur data dari API
class Todo {
  final int? userId; // ID user (opsional karena tidak selalu dikirim)
  final int id; // ID unik todo
  final String title; // Judul todo
  final bool completed; // Status apakah todo selesai

  Todo({
    this.userId,
    required this.id,
    required this.title,
    required this.completed,
  });

  // Mengubah JSON menjadi objek Todo
  factory Todo.fromJson(Map<String, dynamic> json) {
    return Todo(
      userId: json['userId'],
      id: json['id'],
      title: json['title'],
      completed: json['completed'],
    );
  }
}

/// Fungsi POST API untuk membuat Todo baru
Future<Todo> createTodo(String title) async {
  final response = await http.post(
    Uri.parse('https://jsonplaceholder.typicode.com/todos'),
    headers: {'Content-Type': 'application/json; charset=UTF-8'},
    body: jsonEncode({
      'title': title,
      'completed': false, // default status todo baru
    }),
  );

  // Status 201 = berhasil membuat data baru
  if (response.statusCode == 201) {
    return Todo.fromJson(jsonDecode(response.body));
  } else {
    throw Exception('Gagal membuat todo');
  }
}

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  final TextEditingController controller = TextEditingController(); // Input field controller
  Future<Todo>? futureTodo; // Menyimpan hasil POST untuk ditampilkan

  // Fungsi submit ketika tombol kirim ditekan
  void _submit() {
    final title = controller.text.trim(); // Ambil input dan hapus spasi berlebih
    if (title.isEmpty) return; // Validasi input kosong

    setState(() {
      futureTodo = createTodo(title); // Panggil API
    });

    controller.clear(); // Bersihkan input setelah submit
  }

  @override
  void dispose() {
    controller.dispose(); // Membersihkan controller dari memory
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(
          title: const Text('Post Api'),
          centerTitle: true,
        ),

        body: Column(
          children: [
            // Bagian tampilan hasil POST (Todo yang dibuat)
            Expanded(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: FutureBuilder<Todo>(
                  future: futureTodo,
                  builder: (context, snapshot) {
                    // Belum ada todo yang dibuat
                    if (!snapshot.hasData) {
                      return const Center(
                        child: Text(
                          'Belum ada todo dibuat',
                          style: TextStyle(fontSize: 16, color: Colors.grey),
                        ),
                      );
                    }

                    final todo = snapshot.data!; // Todo hasil POST

                    return Card(
                      margin: const EdgeInsets.all(8),
                      child: ListTile(
                        title: Text('ID: ${todo.id}'), // Menampilkan ID dari API
                        subtitle: Text(todo.title), // Menampilkan judul
                        trailing: Text('Completed: ${todo.completed}'), // Status selesai
                      ),
                    );
                  },
                ),
              ),
            ),
            // Bagian input seperti WhatsApp di bawah
            Container(
              padding: const EdgeInsets.all(16),
              color: Colors.grey.shade200,
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: controller,
                      decoration: InputDecoration(
                        labelText: 'Tulis Todo...',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(15), // Sudut membulat
                        ),
                        filled: true,
                        fillColor: Colors.white,
                      ),
                    ),
                  ),

                  const SizedBox(width: 10),

                  // Tombol kirim
                  CircleAvatar(
                    backgroundColor: Colors.blue,
                    child: IconButton(
                      onPressed: _submit,
                      icon: const Icon(Icons.send, color: Colors.white),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
```

**Penjelasan Lengkap:**

1. Struktur Model `Todo`

Model `Todo` digunakan untuk menyamakan struktur data antara aplikasi Flutter dan data dari API.

🔍 Tujuan Model:

Menyimpan data todo dalam bentuk objek Dart.
Memudahkan proses konversi JSON ke objek (dan sebaliknya).

📌 Bagian Penting:

`userId` → ID pemilik todo (opsional).
`id` → ID unik todo dari API.
`title` → Judul atau nama todo.
`completed` → Status apakah todo sudah selesai.
`factory Todo.fromJson()` → Mengonversi data JSON API menjadi objek Dart.

Model ini membuat data yang diterima dari API lebih mudah digunakan di UI Flutter.

---

2. Fungsi Post Api — `createTodo()`

Ini adalah bagian inti yang berfungsi untuk **mengirim data Todo baru** ke server menggunakan metode `POST`.

📝 Proses yang Terjadi

1. Fungsi menerima parameter `title` dari input pengguna.
2. Mengirim request POST ke: `https://jsonplaceholder.typicode.com/todos`.
3. Mengirim JSON berisi:

   ```json
   { "title": "nama todo", "completed": false }
   ```

4. Menunggu respon dari server.
5. Jika status kode **201**, berarti berhasil membuat data baru.
6. Hasil JSON dikonversi menjadi objek `Todo` menggunakan `Todo.fromJson()`.

⚠️ Error Handling

Jika server tidak mengembalikan status 201, fungsi langsung memberikan error:

> “Gagal membuat todo”

Ini penting untuk debugging jika API gagal.

---

3. Variabel `futureTodo`

Variabel ini memiliki tipe `Future<Todo>?` yang digunakan untuk menyimpan hasil request POST.

🎯 Fungsinya

Menjadi sumber data untuk `FutureBuilder`.
Setiap kali pengguna memasukkan todo baru, variabel ini akan menyimpan future dari hasil POST.
UI otomatis diperbarui ketika future selesai.

---

4. Fungsi `_submit()`

Fungsi ini dipanggil ketika user menekan ikon **Send**.

🔍 Alur Kerja `_submit()`

1. Mengambil teks dari `TextField`.
2. `trim()` menghapus spasi berlebih.
3. Jika kosong → batal.
4. Memanggil `createTodo(title)`.
5. Menyimpan future ke variabel `futureTodo`.
6. Melakukan `setState()` agar UI diperbarui.
7. Membersihkan TextField.

🎯 Tujuan Utama

Menghubungkan input pengguna dengan proses POST API.

---

5. — Menampilkan Hasil POST - `FutureBuilder` 

`FutureBuilder` adalah widget Flutter yang memantau proses asynchronous (Future).

🔍 Fungsi di Kode Ini

Menunggu hasil POST API.
Menampilkan pesan default jika belum ada data.
Menampilkan kartu (Card + ListTile) ketika data sudah diterima.

📌 Yang Ditampilkan

ID todo.
Judul todo.
Status `completed`.

`FutureBuilder` sangat membantu pemula untuk menampilkan data API tanpa harus membuat state management kompleks.

---

6. Bagian Input

Bagian ini adalah area untuk mengetik todo baru.

🧩 Komponen Utama

**TextField** → tempat pengguna mengetik judul todo.
**CircleAvatar + IconButton** → tombol kirim.
Dekorasi UI dibuat rapi dan modern (styling WhatsApp-like).

🔍 Alur Pembuatan Todo

1. User mengetik sesuatu.
2. Tekan tombol send.
3. `_submit()` dijalankan.
4. API dipanggil.
5. Hasil ditampilkan oleh `FutureBuilder`.

Bagian ini membantu pengguna memahami interaksi langsung antara input UI dan API.

---
