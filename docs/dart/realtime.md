---
sidebar_position: 18
---

# Rest Api vs Realtime

Sejauh ini, kita telah menggunakan **REST API** konvensional untuk mengelola data *notes*. Pola ini bekerja secara satu arah: aplikasi Flutter mengirim permintaan (*Request*), dan server memberikan jawaban (*Response*). Masalahnya, server tidak akan pernah bicara jika tidak ditanya.

Dalam kasus aplikasi *chat* atau sistem informasi darurat, mengandalkan REST API murni akan sangat melelahkan bagi pengguna. Mereka harus melakukan *refresh* secara manual atau aplikasi harus melakukan *polling* (bertanya berulang kali secara otomatis) hanya untuk mendapatkan data baru. Ini memboroskan baterai, kuota data, dan memberikan pengalaman pengguna yang terasa "patah-patah".

#### 2. Realtime: Komunikasi Dua Arah yang Instan

Berbeda dengan REST API yang pasif, **Realtime** menciptakan jalur komunikasi dua arah. Bayangkan REST API seperti mengirim surat (harus dikirim dulu baru dibalas), sedangkan Realtime seperti sambungan telepon yang terus terhubung.

Begitu data masuk ke database, server tidak menunggu aplikasi bertanya, melainkan langsung **mendorong (*push*)** data tersebut ke Flutter. Hasilnya? Pengguna menerima pesan atau perubahan data di layar mereka pada detik yang sama saat perubahan itu terjadi di server, tanpa perlu ada proses *reload* atau muat ulang halaman.

#### 3. Mekanisme Kerja di Pocketbase

Pocketbase membuat transisi dari REST API ke Realtime menjadi sangat mudah melalui sistem **Subscribe**. Prosesnya dapat diringkas dalam tiga langkah sederhana:

* **Koneksi Terjaga:** Flutter membuka satu jalur khusus ke Pocketbase yang tetap terbuka (menggunakan protokol SSE).
* **Langganan (Subscription):** Kita menentukan koleksi data mana yang ingin dipantau (misalnya: `messages`).
* **Reaksi Otomatis:** Setiap kali ada aksi `create`, `update`, atau `delete` di database, Pocketbase mengirimkan paket data ke Flutter, dan aplikasi kita cukup "mendengarkan" lalu memperbarui tampilan secara otomatis.

#### 4. Kesimpulan: Pilih yang Mana?

* **Gunakan REST API** untuk data yang jarang berubah dan tidak membutuhkan kecepatan tinggi, seperti profil pengguna atau pengaturan aplikasi.
* **Gunakan Realtime** untuk fitur yang membutuhkan interaksi cepat dan kolaboratif, seperti aplikasi *chatting*, skor pertandingan langsung, atau stok barang yang berubah dengan cepat.

---

## Membuat aplikasi messages dengan Flutter & Pocketbase

## 1. Setup Server: Kekuatan Pocketbase

Langkah pertama dimulai dari sisi backend. Di Pocketbase, buatlah koleksi baru bernama `messages`.

* **Tambah Field:** Buat field bernama `content` (tipe: text).
* **API Rules:** Untuk keperluan belajar, atur API Rules (**List, View, Create, Update, Delete**) menjadi "Unlock" (kosongkan atau buat publik) agar bisa diakses tanpa login.

**Mengapa Pocketbase?**
Pocketbase menghilangkan kerumitan membangun server WebSocket dari nol menggunakan Node.js atau Go secara manual. Fitur **realtime** sudah tertanam secara *built-in* di setiap koleksi. Pocketbase sendiri ditulis dengan bahasa Go, memberikan performa tinggi namun tetap mudah digunakan.

---

## 2. Setup Flutter: Efisiensi dengan SDK

Buat proyek Flutter baru bernama `messages_app`. Alih-alih menggunakan paket HTTP manual, kita akan menggunakan **Pocketbase SDK** resmi untuk Flutter yang menangani sinkronisasi data secara otomatis.

**Struktur Proyek:**

* `lib/main.dart`: Titik masuk aplikasi.
* `lib/services/message_service.dart`: Logika komunikasi server.
* `lib/screens/chat_screen.dart`: Antarmuka pengguna (UI).

---

## 3. Logika Service: Jantung Komunikasi

Service ini bertanggung jawab membuka koneksi dan "mendengarkan" setiap perubahan data di server.

```jsx
import 'dart:async';
import 'package:pocketbase/pocketbase.dart';

class PocketBaseService {
  // Inisialisasi koneksi ke server PocketBase
  static final pb = PocketBase('http://127.0.0.1:8090');

  // Mengambil aliran data (Stream) pesan secara realtime
  static Stream<List<RecordModel>> getMessageStream() async* {
    // 1. Ambil data historis (50 pesan terakhir) dari koleksi 'messages'
    final initialFetch = await pb
        .collection('messages')
        .getList(sort: '-created', perPage: 50);

    List<RecordModel> listPesan = initialFetch.items;

    // 2. Kirim data awal ke UI agar chat tidak kosong saat dibuka
    yield listPesan;

    // 3. Buat controller untuk mengelola aliran data tambahan
    final controller = StreamController<List<RecordModel>>();

    // 4. Berlangganan (Subscribe) ke perubahan data di server
    pb.collection('messages').subscribe('*', (dataServer) {
      // Jika terdeteksi ada data baru yang dibuat ('create')
      if (dataServer.action == 'create') {
        // Masukkan pesan baru tersebut ke posisi paling atas list
        listPesan.insert(0, dataServer.record!);
        // Update aliran data agar UI melakukan render ulang
        controller.add(List.from(listPesan));
      }
    });

    // Menghubungkan aliran controller ke output fungsi
    yield* controller.stream;
  }

  // Fungsi untuk mengirim pesan baru ke server
  static Future<void> sendMessage(String isiPesan) async {
    if (isiPesan.trim().isEmpty) return; // Validasi: abaikan jika teks kosong

    // Simpan ke tabel 'messages' dengan field 'content'
    await pb.collection('messages').create(body: {'content': isiPesan});
  }

  // Fungsi untuk memutus koneksi realtime (Optimasi RAM & Baterai)
  static void stopRealtime() => pb.collection('messages').unsubscribe('*');
}

```

**Penjelasan:**

* `async*` dan `yield`: Berbeda dengan `Future` yang hanya mengembalikan satu nilai, `async*` menghasilkan **Stream** (aliran data berkelanjutan). `yield` digunakan untuk "mendorong" data keluar ke siapa pun yang mendengarkan.
* **`getList`**: Digunakan untuk mengambil data yang sudah ada di database saat pertama kali aplikasi dibuka agar chat tidak kosong.
* **`subscribe('*')`**: Ini adalah fitur sakti Pocketbase. Tanda asterisk (`*`) berarti kita mendengarkan *semua* kejadian (tambah, ubah, hapus) pada koleksi tersebut secara instan.
* **`controller.add`**: Setiap kali ada pesan baru dari server, kita menambahkannya ke daftar lokal dan mengirimkan daftar terbaru tersebut ke UI melalui controller.

---

## 4. Screen Messages: Dari Future ke Stream

Kita akan menggunakan **StreamBuilder** untuk menampilkan data. Widget ini sangat cerdas karena akan otomatis membangun ulang (rebuild) tampilan setiap kali ada data baru yang masuk dari Stream.

```jsx
import 'package:flutter/material.dart';
import 'package:pocketbase/pocketbase.dart';
import '../services/pb_service.dart';

class ChatScreen extends StatefulWidget {
  const ChatScreen({super.key});

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  // Kontroler untuk membaca teks dari input field
  final TextEditingController _textController = TextEditingController();

  // Aksi saat tombol kirim ditekan
  void _handleSend() {
    PocketBaseService.sendMessage(_textController.text);
    _textController.clear(); // Bersihkan kolom input setelah kirim
  }

  @override
  void dispose() {
    // Bersihkan resource saat halaman ditutup agar tidak memory leak
    PocketBaseService.stopRealtime();
    _textController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('WhatsApp')),
      body: Column(
        children: [
          // Widget untuk menampilkan daftar pesan secara realtime
          Expanded(
            child: StreamBuilder<List<RecordModel>>(
              stream: PocketBaseService.getMessageStream(), // Sumber data stream
              builder: (context, snapshot) {
                // Tampilkan loading spinner jika data belum siap
                if (!snapshot.hasData) {
                  return const Center(child: CircularProgressIndicator());
                }

                final semuaPesan = snapshot.data!;

                return ListView.builder(
                  reverse: true, // Membalik arah: pesan terbaru di bawah
                  itemCount: semuaPesan.length,
                  itemBuilder: (context, index) {
                    final item = semuaPesan[index];
                    return ListTile(
                      title: Text(item.getStringValue('content')),
                      subtitle: Text(
                        item.getStringValue('created'), // Info waktu kirim
                        style: const TextStyle(fontSize: 10),
                      ),
                    );
                  },
                );
              },
            ),
          ),

          // Area input teks di bagian bawah
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8.0, vertical: 4.0),
            color: Colors.grey[200],
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _textController,
                    decoration: const InputDecoration(
                      hintText: 'Tulis sesuatu...',
                      border: InputBorder.none,
                    ),
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.send, color: Colors.blue),
                  onPressed: _handleSend, // Jalankan fungsi kirim
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

**Penjelasan:**

* **`StreamBuilder`**: Widget ini bertindak sebagai "jembatan" antara logika Stream di service dengan UI. Jika ada data baru, `snapshot.data` akan terisi otomatis.
* **`reverse: true`**: Dalam aplikasi chat, kita ingin pesan terbaru muncul di dekat jempol (bawah). Parameter ini membalik urutan ListView.
* **`item.getStringValue('content')`**: Cara aman mengambil data dari `RecordModel` Pocketbase. Jika field tidak ditemukan, aplikasi tidak akan crash, melainkan mengembalikan string kosong.
* **`dispose()`**: Sangat penting untuk memanggil `stopRealtime()` di sini agar koneksi ke server diputus saat pengguna keluar dari aplikasi, guna menghemat baterai.

---

## 5. Main Entry: Menjalankan Aplikasi

Terakhir, kita menyatukan semua komponen di main.dart. Ini adalah titik di mana aplikasi Flutter pertama kali dijalankan dan melakukan inisialisasi koneksi ke server Pocketbase.

```jsx
import 'package:flutter/material.dart';
import 'screens/chat_screen.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'PocketBase Chat',
      debugShowCheckedModeBanner: false, // Menghilangkan banner debug
      theme: ThemeData(primarySwatch: Colors.blue),
      home: const ChatScreen(), // Halaman utama aplikasi
    );
  }
}

```

**Alur Kerja Aplikasi Chat**

1. **Berlangganan (Subscribe):** Saat aplikasi dibuka, Flutter mendaftarkan diri ke Pocketbase untuk mendengarkan perubahan pada koleksi `messages`.
2. **Input Pengguna:** Pengguna mengetik pesan. Saat tombol kirim ditekan, Flutter mengirim perintah `create` ke API Pocketbase.
3. **Server Trigger:** Pocketbase menyimpan pesan baru ke database dan seketika itu juga "berteriak" menyiarkan data tersebut ke semua aplikasi yang sedang berlangganan.
4. **UI Update:** `StreamBuilder` menangkap "teriakan" server tersebut, memperbarui daftar pesan, dan Flutter merender ulang tampilan secara otomatis.
