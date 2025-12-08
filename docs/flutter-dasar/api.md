---
sidebar_position: 6
---

# 🌐 Data Fetching Flutter

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

## Mengambil Data dari Internet dalam bentuk tunggal

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

## **Mengambil data dari internet dalam bentuk list:**

Materi ini membahas cara mengambil data dari API dalam bentuk list menggunakan Flutter.

**📡 Membuat Fungsi Request (Fetch Data):**

Kita membutuhkan fungsi **Asynchronous** (`async`) karena mengambil data dari internet butuh waktu (tidak instan).

```dart
Future<List<Album>> fetchAlbums() async {
  // 1. Kirim request GET ke URL API
  final response = await http.get(
    Uri.parse('https://jsonplaceholder.typicode.com/albums'),
  );

  // 2. Cek Status Code (200 artinya BERHASIL/OK)
  if (response.statusCode == 200) {
    // 3. Decode: Mengubah text JSON string menjadi List di Dart
    List jsonResponse = jsonDecode(response.body);
    
    // 4. Mapping: Mengubah setiap item di List menjadi Objek Album
    return jsonResponse.map((data) => Album.fromJson(data)).toList();
  } else {
    // Jika gagal (misal 404 atau 500)
    throw Exception('Gagal memuat album');
  }
}
```

**Penjelasan:**

**Request:** Aplikasi "menelpon" server (`http.get`).
**Await:** Aplikasi menunggu jawaban (loading).
**Response:**
      Jika **200 (OK)**: Data diproses.
      Jika **Error**: Munculkan pesan error.

---

**📦 Membuat Model Class (Data Modeling):**

Data dari API biasanya berbentuk **JSON**. Kita perlu mengubah JSON ini menjadi **Objek Dart** agar mudah digunakan (misalnya untuk autocompletion dan type safety).

**Contoh JSON dari Server:**

```json
{
  "userId": 1,
  "id": 1,
  "title": "quidem molestiae enim"
}
```

**Kode Model Class (Dart):**

```dart
class Album {
  final int userId;
  final int id;
  final String title;

  // Constructor
  Album({
    required this.userId, 
    required this.id, 
    required this.title
  });

  // Factory Method: Mengubah JSON (Map) menjadi Objek Album
  // Menggunakan fitur modern Dart 3 (Pattern Matching)
  factory Album.fromJson(Map<String, dynamic> json) {
    return switch (json) {
      {
        'userId': int userId, 
        'id': int id, 
        'title': String title
      } => Album(
          userId: userId,
          id: id,
          title: title,
        ),
      _ => throw const FormatException('Format JSON tidak sesuai'),
    };
  }
}
```

**Penjelasan:**

  `factory Album.fromJson`: Pabrik pembuatan objek. Menerima data mentah (Map), lalu mengonversinya menjadi `Album`.
  `switch (json)`: Memvalidasi apakah data JSON memiliki key `userId`, `id`, dan `title` dengan tipe data yang benar. Jika ya, buat objek. Jika tidak, lempar Error.

---

**🔄 State Management Sederhana:**

Karena data bersifat *Future* (akan datang nanti), kita perlu tempat penampungan sementara di dalam Widget.

```dart
late Future<List<Album>> futureAlbums;

@override
void initState() {
  super.initState();
  // Panggil API tepat saat Widget pertama kali dibuat
  futureAlbums = fetchAlbums();
}
```

`late`: Kita janji variabel ini akan diisi nanti (sebelum dipakai).
`initState()`: Memastikan data hanya dipanggil sekali saat halaman dibuka, bukan berulang-ulang saat layar di-refresh.

---

**📱 Menampilkan Data ke UI (FutureBuilder):**

`FutureBuilder` adalah Widget ajaib yang otomatis berubah tampilan berdasarkan status data: **Loading**, **Sukses**, atau **Error**.

```dart
FutureBuilder<List<Album>>(
  future: futureAlbums, // Variabel Future yang kita buat tadi
  builder: (context, snapshot) {
    
    // KONDISI 1: Data Berhasil Didapat
    if (snapshot.hasData) {
      List<Album> dataAlbum = snapshot.data!;
      
      return ListView.builder(
        itemCount: dataAlbum.length,
        itemBuilder: (context, index) {
          return ListTile(
            leading: CircleAvatar(child: Text('${dataAlbum[index].id}')),
            title: Text(dataAlbum[index].title),
            subtitle: Text('User ID: ${dataAlbum[index].userId}'),
          );
        },
      );
    } 
    
    // KONDISI 2: Terjadi Error
    else if (snapshot.hasError) {
      return Center(child: Text("Error: ${snapshot.error}"));
    }

    // KONDISI 3: Masih Loading (Default)
    return const Center(child: CircularProgressIndicator());
  },
)
```

**Penjelasan:**

**Cek `snapshot`:** Snapshot adalah status data saat ini.
Jika `hasData` ✅: Tampilkan `ListView`.
Jika `hasError` ❌: Tampilkan pesan error.
Jika belum ada keduanya ⏳: Tampilkan `CircularProgressIndicator` (loading spinner).

---

**✅ Full Code (Siap Copy-Paste):**

Berikut adalah kode lengkap `main.dart` yang bisa langsung Anda coba:

```jsx
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

// 1. Model Class
class Album {
  final int userId;
  final int id;
  final String title;

  Album({required this.userId, required this.id, required this.title});

  factory Album.fromJson(Map<String, dynamic> json) {
    return switch (json) {
      {'userId': int userId, 'id': int id, 'title': String title} => Album(
          userId: userId,
          id: id,
          title: title,
        ),
      _ => throw const FormatException('Failed to load album'),
    };
  }
}

void main() => runApp(const MyApp());

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Belajar API Flutter',
      theme: ThemeData(primarySwatch: Colors.blue),
      home: const AlbumListScreen(),
    );
  }
}

class AlbumListScreen extends StatefulWidget {
  const AlbumListScreen({super.key});

  @override
  State<AlbumListScreen> createState() => _AlbumListScreenState();
}

class _AlbumListScreenState extends State<AlbumListScreen> {
  // 2. State Variable
  late Future<List<Album>> futureAlbums;

  // 3. Fungsi Fetch API
  Future<List<Album>> fetchAlbums() async {
    final response = await http.get(
      Uri.parse('https://jsonplaceholder.typicode.com/albums'),
    );

    if (response.statusCode == 200) {
      List jsonResponse = jsonDecode(response.body);
      return jsonResponse.map((data) => Album.fromJson(data)).toList();
    } else {
      throw Exception('Failed to load album');
    }
  }

  // 4. Init State
  @override
  void initState() {
    super.initState();
    futureAlbums = fetchAlbums();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Daftar Album API')),
      // 5. FutureBuilder UI
      body: FutureBuilder<List<Album>>(
        future: futureAlbums,
        builder: (context, snapshot) {
          if (snapshot.hasData) {
            return ListView.builder(
              itemCount: snapshot.data!.length,
              itemBuilder: (context, index) {
                var album = snapshot.data![index];
                return ListTile(
                  leading: CircleAvatar(child: Text('${album.id}')),
                  title: Text(album.title),
                );
              },
            );
          } else if (snapshot.hasError) {
            return Center(child: Text('${snapshot.error}'));
          }
          return const Center(child: CircularProgressIndicator());
        },
      ),
    );
  }
}
```

---

**Panduan Lengkap Menampilkan Data di Flutter dengan `FutureBuilder`:**

1️⃣ Konsep Dasar: Apa itu `FutureBuilder`?

`FutureBuilder` adalah **Widget khusus di Flutter** yang bertugas **membangun (menampilkan) UI secara otomatis** berdasarkan status dari operasi **asinkron** (`Future`). Ini menghilangkan kebutuhan untuk mengelola status *loading*, *data*, dan *error* secara manual dengan `setState()`.

  **`Future`**: Objek yang menjanjikan nilai (data) atau *error* di masa depan.
  **Status yang Dimonitor:**
    1.  ⏳ **Waiting/Loading:** `Future` sedang berjalan.
    2.  ✅ **Done with Data:** `Future` berhasil mengembalikan data.
    3.  ❌ **Done with Error:** `Future` gagal mengembalikan *error*.

---

2️⃣ Struktur Sintaks Dasar

Kode ini menunjukkan bagaimana `FutureBuilder` menggunakan parameter `future` sebagai sumber data dan `builder` untuk merespons statusnya.

```dart
FutureBuilder<List<Album>>(
  future: futureAlbums, // Sumber data asinkron
  builder: (context, snapshot) { // Fungsi pembuat UI berdasarkan status
    
    // Di sini kita cek status 'snapshot' dan kembalikan Widget yang sesuai.
    
    // KONDISI 1, 2, 3...
    
  },
)
```

2.1 Deklarasi Tipe dan Parameter Wajib

  **`FutureBuilder<List<Album>>`**: Menentukan **tipe data** yang diharapkan dari `Future`. Di sini, diharapkan mengembalikan `List<Album>`. Ini menjamin **type safety**.
  **`future: futureAlbums`**: Parameter **wajib**. Ini adalah variabel `Future` yang akan terus dipantau oleh `FutureBuilder` sampai selesai.
  **`builder: (context, snapshot) { ... }`**: Parameter **wajib**. Fungsi yang dipanggil **setiap kali status `future` berubah**.
      **`snapshot`**: Objek utama (`AsyncSnapshot`) yang berisi **status koneksi** dan **nilai data/error saat ini**.

---

3️⃣ Alur Pengecekan Status (`snapshot`)

Di dalam fungsi `builder`, pengecekan dilakukan secara berurutan, biasanya dimulai dari kondisi *loading* atau *error* sebelum menampilkan data final.

3.1 ⏳ KONDISI 1: Masih Loading (Menunggu)

Ini adalah kondisi yang paling dasar dan sering diletakkan terakhir sebagai *default* atau diawali dengan pengecekan `snapshot.connectionState`.

```dart
// Pengecekan status koneksi
if (snapshot.connectionState == ConnectionState.waiting) {
    return const Center(child: CircularProgressIndicator());
}
// ATAU, jika tidak ada kondisi lain yang terpenuhi:
// return const Center(child: CircularProgressIndicator());
```

  **Tujuan:** Menampilkan indikator bahwa aplikasi sedang memproses data.
  **Widget:** `CircularProgressIndicator` (loading spinner).

3.2 ❌ KONDISI 2: Terjadi Error

Setelah selesai, `Future` mungkin mengembalikan *error*.

```dart
else if (snapshot.hasError) {
  return Center(child: Text("Error: ${snapshot.error}"));
}
```

  **`snapshot.hasError`**: Bernilai `true` jika `Future` selesai dengan **kegagalan** (misalnya, masalah jaringan atau respons API yang tidak valid).
  **`snapshot.error`**: Menyimpan detail pesan *error* yang dapat ditampilkan kepada pengguna.

3.3 ✅ KONDISI 3: Data Berhasil Didapat (Sukses)

Ini adalah kondisi ketika `Future` telah selesai dengan sukses dan mengembalikan data yang valid.

A. Mengambil Data

```dart
if (snapshot.hasData) {
  List<Album> dataAlbum = snapshot.data!; 
  // ... Lanjut ke langkah B
}
```

  **`snapshot.hasData`**: Bernilai `true` jika data telah berhasil diterima.
  **`snapshot.data!`**: Properti ini mengambil data aktual (`List<Album>`). Tanda **`!` (Null Assertion Operator)** digunakan karena kita sudah yakin datanya tidak `null` (berkat `snapshot.hasData`).
  **`dataAlbum`**: Variabel yang menyimpan daftar objek `Album` siap untuk ditampilkan.

B. Membangun Daftar UI

Data ditampilkan secara efisien menggunakan `ListView.builder`.

```dart
  return ListView.builder(
    itemCount: dataAlbum.length,
    itemBuilder: (context, index) {
      // ... Lanjut ke langkah C
    },
  );
```

  **`ListView.builder`**: Widget yang sangat **efisien** untuk daftar panjang; ia hanya membuat *widget* untuk item yang terlihat di layar (*lazy loading*).
  **`itemCount`**: Menentukan jumlah baris yang akan dibuat (sesuai panjang `dataAlbum`).
  **`itemBuilder`**: Fungsi yang dipanggil untuk **setiap baris**, dengan `index` menunjukkan item mana yang harus ditampilkan.

 C. Mendesain Setiap Item (`ListTile`)

Setiap item dibuat menggunakan `ListTile` dan data yang sesuai dengan `index`.

```dart
      return ListTile(
        leading: CircleAvatar(child: Text('${dataAlbum[index].id}')),
        title: Text(dataAlbum[index].title),
        subtitle: Text('User ID: ${dataAlbum[index].userId}'),
      );
```

  **`ListTile`**: Widget standar untuk satu baris daftar.
      **`leading`**: Widget di sebelah kiri (digunakan untuk menampilkan ID).
      **`title`**: Judul utama (digunakan untuk menampilkan `album.title`).
      **`subtitle`**: Teks pendukung (digunakan untuk menampilkan `album.userId`).
