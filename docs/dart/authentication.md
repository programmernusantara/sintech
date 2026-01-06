---
sidebar_position: 15
---

# Authentication dengan google

Dalam pengembangan aplikasi, keamanan akses dan perlindungan data pengguna merupakan prioritas utama. Aplikasi tidak boleh dapat diakses secara bebas tanpa verifikasi, terutama jika menyimpan data pribadi pengguna.

Pada tutorial sebelumnya, kita telah membangun aplikasi sederhana dengan fitur CRUD Notes menggunakan Flutter dan PocketBase. Namun, aplikasi tersebut belum aman karena pengguna dapat mengakses aplikasi tanpa login, sehingga data setiap pengguna berpotensi diakses oleh pihak lain.

Oleh karena itu, autentikasi diperlukan agar setiap pengguna melakukan verifikasi identitas terlebih dahulu sebelum menggunakan aplikasi. Dengan autentikasi, data pribadi pengguna akan terlindungi dan hanya dapat diakses oleh pemiliknya.

Pada tutorial ini, kita akan mengimplementasikan fitur autentikasi sederhana menggunakan **Google Authentication** sebagai layanan pihak ketiga. Metode ini tergolong aman karena kredensial pengguna (seperti kata sandi) dikelola langsung oleh Google. Server aplikasi hanya menyimpan identitas dasar pengguna, seperti nama akun dan foto profil.

Selain aman, autentikasi berbasis **OAuth 2.0** juga mudah diimplementasikan dan memberikan pengalaman pengguna yang lebih nyaman.

Mmembuat fitur authenticasi dan crud notes dengan dengan flutter dan pocetbase dengan google 

---

## **Setup Server Pocketbase**

Bagian ini mencakup seluruh konfigurasi backend, mulai dari perizinan Google hingga pengaturan database di PocketBase.

### A. Konfigurasi Google Cloud Console

Sebelum menyentuh PocketBase, kita perlu mendapatkan kredensial dari Google.

1. Buka [Google Cloud Console](https://console.cloud.google.com/).
2. **Buat Project Baru**: Klik pada dropdown project di atas, pilih "New Project", dan beri nama (misal: `Notes App`).
3. **Configure OAuth Consent Screen**:
* Pilih **External**.
* Isi data aplikasi (Nama aplikasi, email support, dan email developer).
* Pada bagian **Scopes**, tambahkan: `.../auth/userinfo.email` dan `.../auth/userinfo.profile`.


4. **Buat Kredensial**:
* Buka menu **APIs & Services > Credentials**.
* Klik **+ Create Credentials > OAuth client ID**.
* Pilih Application type: **Web application**.
* Pada **Authorized redirect URIs**, masukkan alamat lokal untuk pengujian:
`http://127.0.0.1:8090/api/oauth2-redirect`


5. **Simpan Kredensial**: Salin **Client ID** dan **Client Secret** yang muncul untuk digunakan nanti.

---

### B. Aktifkan Google Auth di PocketBase

Setelah mendapatkan kredensial, hubungkan Google Auth ke server PocketBase Anda.

1. Buka Admin UI PocketBase (default: `http://127.0.0.1:8090/_/`).
2. Pergi ke menu **Settings > Auth providers**.
3. Pilih **Google** dan klik tombol **Settings**.
4. Masukkan **Client ID** dan **Client Secret** yang telah disalin sebelumnya.
5. Klik **Save changes**.

---

### C. Konfigurasi Keamanan Koleksi `users`

Koleksi ini sudah ada secara default. Kita perlu mengatur **API Rules** agar user hanya bisa mengakses data mereka sendiri.

| Action | API Rule | Keterangan |
| --- | --- | --- |
| **List/Search** | `id = @request.auth.id` | User hanya bisa melihat datanya sendiri dalam daftar. |
| **View** | `id = @request.auth.id` | Hanya pemilik ID yang bisa melihat detail profilnya. |
| **Create** | *(Biarkan kosong / True)* | Mengizinkan pendaftaran user baru via Google Auth. |
| **Update** | `id = @request.auth.id` | Hanya pemilik akun yang bisa mengubah profilnya. |
| **Delete** | `id = @request.auth.id` | Hanya pemilik akun yang bisa menghapus akunnya. |

---

### D. Membuat Koleksi `notes`

Langkah terakhir adalah membuat tempat penyimpanan catatan dengan relasi ke user.

1. Klik **+ New collection** dan beri nama `notes`.
2. **Tambahkan Field**:
* `title` (Plain text, Non-empty).
* `user` (Relation, pilih collection `users`, Max Select: 1, Required).


3. **Set API Rules** untuk koleksi `notes`:

| Action | API Rule | Penjelasan |
| --- | --- | --- |
| **List/Search** | `user = @request.auth.id` | Hanya tampilkan note yang field `user`-nya sesuai ID login. |
| **View** | `user = @request.auth.id` | Hanya izinkan melihat detail jika dia adalah pemiliknya. |
| **Create** | `@request.auth.id != ""` | Izinkan siapa saja membuat note asal sudah login. |
| **Update** | `user = @request.auth.id` | Hanya pemilik yang boleh mengubah isi catatan. |
| **Delete** | `user = @request.auth.id` | Hanya pemilik yang boleh menghapus catatan. |

---

## **Setup Client Flutter**

Bagian ini menjelaskan langkah-langkah mengintegrasikan aplikasi Flutter dengan PocketBase yang telah kita siapkan di server.

### 1. Persiapan Project

1. **Inisialisasi Project**: Buat project Flutter baru melalui terminal atau IDE favorit Anda.
2. **Instalasi Package**: Tambahkan package `pocketbase` untuk komunikasi ke server, `url_launcher` untuk menangani pembukaan browser saat autentikasi Google dan `SharedPreferences` untuk menyimpan toket google agar user ketika sudah login tidak usah login lagi.
3. **Pengaturan Struktur Folder**: Susun folder agar kode mudah dikelola:
* `services/`: Tempat logika koneksi API dan autentikasi.
* `screens/`: Tempat file tampilan (UI) aplikasi.
* `main.dart`: Titik masuk utama aplikasi.

---

## B. Setup Services

Bagian ini merupakan **Brain/Otak** dari aplikasi kita. Di sini kita memisahkan logika pengambilan data (API/Database) dari tampilan (UI) agar kode lebih rapi dan mudah dikelola.

---

### 1. Service Autentikasi (`auth_service.dart`)

**Definisi:**
Service ini bertanggung jawab penuh atas identitas pengguna. Tugas utamanya adalah menghubungkan aplikasi ke server **PocketBase**, mengelola sesi login agar tidak hilang saat aplikasi ditutup (persistence), dan menangani proses login menggunakan pihak ketiga (Google OAuth2).

**Implementasi Kode**

```jsx
import 'package:pocketbase/pocketbase.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:url_launcher/url_launcher.dart';

class AuthService {
  // Instance statis PocketBase agar bisa dipanggil di seluruh bagian aplikasi
  static late PocketBase pb;

  /// Inisialisasi awal koneksi dan session management
  static Future<void> init() async {
    final prefs = await SharedPreferences.getInstance();

    // Mengonfigurasi AsyncAuthStore untuk penyimpanan token otomatis
    final store = AsyncAuthStore(
      save: (data) => prefs.setString('pb_auth', data), 
      initial: prefs.getString('pb_auth'),              
      clear: () => prefs.remove('pb_auth'),             
    );

    // Menghubungkan client ke URL server PocketBase
    pb = PocketBase('http://127.0.0.1:8090', authStore: store);
  }

  // Cek apakah ada token login yang masih berlaku
  static bool get isLoggedIn => pb.authStore.isValid;

  // Mengambil data profil user yang sedang login
  static RecordModel? get user => pb.authStore.record;

  /// Logika Login menggunakan Google OAuth2
  static Future<void> loginWithGoogle() async {
    await pb.collection('users').authWithOAuth2('google', (url) async {
      // Callback ini membuka browser untuk proses persetujuan akun Google
      await launchUrl(url, mode: LaunchMode.externalApplication);
    });
  }

  /// Menghapus sesi login (Logout)
  static void logout() {
    pb.authStore.clear(); 
  }
}

```

**Penjelasan:**

* **`AsyncAuthStore`**: Ini adalah bagian paling krusial. Fungsinya adalah sinkronisasi otomatis. Ketika user berhasil login, token akan langsung disimpan ke memori HP melalui `SharedPreferences`. Jadi, user tidak perlu login ulang setiap kali membuka aplikasi.
* **`pb.authStore.isValid`**: Sebuah *getter* sederhana untuk mengecek status. Jika `true`, maka user bisa langsung masuk ke halaman utama; jika `false`, arahkan ke halaman login.
* **`authWithOAuth2`**: Fungsi ini sangat sakti karena kita tidak perlu membuat form login manual. PocketBase mengurus proses pertukaran token dengan Google, kita hanya perlu menyediakan browser lewat `launchUrl`.

---

### 2. Service CRUD Notes (`crud_service.dart`)

**Definisi:**
Service ini menangani pengelolaan data catatan (Notes). Di sini kita mendefinisikan bagaimana aplikasi berinteraksi dengan koleksi database, mulai dari mengambil data, menambah data baru, hingga menghapus data.

**Implementasi Kode:**

```jsx
import 'package:authentication/services/auth_service.dart';
import 'package:pocketbase/pocketbase.dart';

class CrudService {
  
  /// Mengambil daftar catatan milik user aktif
  static Future<List<RecordModel>> getMyNote() async {
    return await AuthService.pb
        .collection('notes')
        .getFullList(
          sort: '-created', // Mengurutkan: Terkini ke Terlama
          filter: 'user = "${AuthService.user?.id}"', // Keamanan Data
        );
  }

  /// Menambahkan catatan baru ke server
  static Future<void> addNote(String title) async {
    await AuthService.pb.collection('notes').create(
      body: {
        "title": title,
        "user": AuthService.user?.id // Relasi ke User
      },
    );
  }

  /// Menghapus catatan berdasarkan ID
  static Future<void> deleteNote(String id) async {
    await AuthService.pb.collection('notes').delete(id);
  }
}

```

**Penjelasan:**

* Parameter `filter` pada `getMyNote**`: Ini berfungsi sebagai lapisan keamanan tambahan. Meskipun di server mungkin ada ribuan data, aplikasi hanya akan meminta data yang kolom `user`-nya cocok dengan ID user yang sedang login saat ini.
* Parameter `sort: '-created'**`: Tanda minus (`-`) menandakan *Descending*. Artinya, catatan yang baru saja dibuat akan muncul di urutan paling atas pada daftar aplikasi.
* Field `"user": AuthService.user?.id**`: Saat membuat note baru, kita wajib menyertakan ID pembuatnya. Hal ini agar data tersebut "terkunci" atau dimiliki secara spesifik oleh user tersebut (Relasi Database).

---

## C. Setup Screens (Tampilan)

Bagian ini adalah **Wajah** dari aplikasi kita. Fokus utamanya adalah memberikan pengalaman pengguna (UX) yang sederhana namun berfungsi dengan baik.

---

### 1. Halaman Login (`login_screen.dart`)

**Definisi:**
Halaman ini adalah gerbang utama aplikasi. Fungsinya sangat spesifik: menyediakan akses masuk bagi pengguna menggunakan akun Google. Kita menggunakan `StatelessWidget` karena tidak ada perubahan data internal di halaman ini selain memicu aksi login.

**Implementasi Kode:**

```jsx
import 'package:flutter/material.dart';
import '../services/auth_service.dart';
import 'home_screen.dart';

class LoginScreen extends StatelessWidget {
  const LoginScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // Menempatkan konten tepat di tengah layar
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const FlutterLogo(size: 100), // Visual pemanis
            const SizedBox(height: 30),
            
            // Tombol utama untuk login
            ElevatedButton.icon(
              icon: const Icon(Icons.login),
              label: const Text("Masuk dengan Google"),
              onPressed: () async {
                // 1. Memanggil logika login dari AuthService
                await AuthService.loginWithGoogle();
                
                // 2. Validasi setelah proses login selesai
                if (AuthService.isLoggedIn && context.mounted) {
                  // 3. Navigasi ke Halaman Utama jika berhasil
                  Navigator.pushReplacement(
                    context, 
                    MaterialPageRoute(builder: (_) => const HomeScreen())
                  );
                }
              },
            ),
          ],
        ),
      ),
    );
  }
}

```

**Penjelasan:**

* **`ElevatedButton.icon`**: Kita memilih widget ini agar tombol terlihat lebih modern. Ikon `Icons.login` memberikan petunjuk visual instan kepada pengguna mengenai fungsi tombol tersebut.
* **`await AuthService.loginWithGoogle()`**: Di sini kita memanggil fungsi yang sudah kita buat di bagian **B (Setup Services)**. Program akan "menunggu" sampai pengguna selesai melakukan proses login di browser.
* **`context.mounted`**: Ini adalah pengecekan keamanan penting di Flutter. Fungsinya memastikan bahwa halaman login masih ada di layar saat proses navigasi akan dilakukan (menghindari error jika user menutup aplikasi saat sedang login).
* **`Navigator.pushReplacement`**: Berbeda dengan `push` biasa, `pushReplacement` akan menghapus halaman login dari memori setelah kita pindah ke `HomeScreen`. Tujuannya agar user tidak bisa kembali ke halaman login lagi hanya dengan menekan tombol "Back" di HP mereka.

---

### 2. Halaman Home (`home_screen.dart`)

**Definisi:**
Halaman Home adalah pusat aktivitas pengguna. Di sini, pengguna dapat melihat daftar catatan mereka, menambahkan catatan baru, dan menghapus catatan yang sudah tidak diperlukan. Halaman ini menggunakan `StatefulWidget` karena tampilan perlu diperbarui (re-render) setiap kali data di server berubah.

**Implementasi Kode:**

```jsx
import 'package:authentication/screens/profile_screen.dart';
import 'package:authentication/services/crud_service.dart';
import 'package:flutter/material.dart';
import 'package:pocketbase/pocketbase.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  // Controller untuk menangkap teks yang diketik di input field
  final TextEditingController _controller = TextEditingController();

  // Variabel penampung data catatan yang akan diambil secara asinkron
  late Future<List<RecordModel>> _notes;

  // Mengambil ulang data terbaru dari server
  void _refreshNotes() {
    _notes = CrudService.getMyNote();
  }

  // Fungsi untuk menambah catatan baru
  Future<void> _addNote() async {
    if (_controller.text.isEmpty) return; // Jangan proses jika teks kosong

    await CrudService.addNote(_controller.text); // Simpan ke PocketBase
    _controller.clear();                         // Bersihkan kolom input
    setState(_refreshNotes);                    // Perbarui tampilan layar
  }

  // Fungsi untuk menghapus catatan berdasarkan ID
  Future<void> _deleteNote(String id) async {
    await CrudService.deleteNote(id);            // Hapus dari PocketBase
    setState(_refreshNotes);                    // Perbarui tampilan layar
  }

  @override
  void initState() {
    super.initState();
    _refreshNotes(); // Ambil data catatan saat aplikasi pertama kali dibuka
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.blue,
        title: const Text("Beranda"),
        centerTitle: true,
        actions: [
          // Navigasi ke halaman profil
          IconButton(
            icon: const Icon(Icons.person),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const ProfileScreen()),
              );
            },
          ),
        ],
      ),
      body: Column(
        children: [
          // Area daftar catatan (Flexible/Expanded)
          Expanded(
            child: FutureBuilder<List<RecordModel>>(
              future: _notes, // Memantau proses pengambilan data
              builder: (context, snapshot) {
                // Tampilkan loading jika data masih diproses
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: CircularProgressIndicator());
                } 
                // Tampilkan pesan jika data kosong
                else if (!snapshot.hasData || snapshot.data!.isEmpty) {
                  return const Center(child: Text('Belum ada catatan'));
                } 
                // Tampilkan daftar jika data berhasil diambil
                else {
                  final notes = snapshot.data!;
                  return ListView.builder(
                    itemCount: notes.length,
                    itemBuilder: (context, index) {
                      final note = notes[index];
                      return ListTile(
                        title: Text(note.getStringValue('title')),
                        trailing: IconButton(
                          icon: const Icon(Icons.delete, color: Colors.red),
                          onPressed: () => _deleteNote(note.id),
                        ),
                      );
                    },
                  );
                }
              },
            ),
          ),
          // Bagian bawah: Input field untuk menambah catatan baru
          Container(
            padding: const EdgeInsets.all(10),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _controller,
                    decoration: const InputDecoration(hintText: 'Tambah catatan...'),
                    onSubmitted: (_) => _addNote(), // Tambah saat tekan Enter di keyboard
                  ),
                ),
                IconButton(onPressed: _addNote, icon: const Icon(Icons.add_circle)),
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

* **`FutureBuilder`**: Ini adalah komponen kunci. Widget ini secara otomatis menangani tiga kondisi: saat sedang mengambil data (*waiting*), saat data kosong/error, dan saat data berhasil tampil. Ini membuat aplikasi terasa sangat responsif.
* **`setState(_refreshNotes)`**: Setiap kali kita melakukan operasi (tambah/hapus), kita memanggil fungsi ini. Tujuannya adalah memberitahu Flutter: *"Data telah berubah, tolong gambar ulang layarnya dengan data terbaru!"*.
* **`Expanded` pada ListView**: Tanpa `Expanded`, daftar catatan akan bentrok dengan kolom input di bawahnya. `Expanded` memastikan daftar catatan mengambil sisa ruang yang tersedia di layar.
* **`note.getStringValue('title')`**: Ini adalah cara aman mengambil data dari `RecordModel` PocketBase. Jika field `title` kosong, aplikasi tidak akan *crash*.

---

### 3. Halaman Profil (`profile_screen.dart`)

**Definisi:**
Halaman Profil berfungsi sebagai area informasi akun dan kendali sesi. Di sini, aplikasi mengambil data pengguna yang tersimpan di dalam `AuthService` dan menampilkannya. Selain itu, halaman ini menyediakan akses aman untuk keluar dari aplikasi (Logout) dan memastikan semua data sesi dibersihkan.

**Implementasi Kode:**

```jsx
import 'package:flutter/material.dart';
import '../services/auth_service.dart';
import 'login_screen.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // Mengambil snapshot data user yang sedang aktif dari AuthService
    final user = AuthService.user;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Profil Pengguna'),
        centerTitle: true,
        // Menggunakan tombol Close sebagai navigasi kembali
        leading: IconButton(
          icon: const Icon(Icons.close),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Avatar Placeholder (Opsional: Bisa dikembangkan untuk foto profil)
            const CircleAvatar(
              radius: 40,
              child: Icon(Icons.person, size: 40),
            ),
            const SizedBox(height: 20),

            // Menampilkan Nama User dari PocketBase
            Text(
              user?.getStringValue('name') ?? "Tanpa Nama",
              style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
            ),

            // Menampilkan Email User
            Text(
              user?.getStringValue('email') ?? "Email tidak ditemukan",
              style: const TextStyle(color: Colors.grey),
            ),

            const SizedBox(height: 40),

            // TOMBOL LOGOUT
            SizedBox(
              width: 200,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.redAccent,
                  foregroundColor: Colors.white,
                ),
                onPressed: () {
                  // 1. Bersihkan token dari memory dan storage (Local & Server)
                  AuthService.logout();

                  // 2. Bersihkan navigasi dan kembali ke halaman Login
                  Navigator.pushAndRemoveUntil(
                    context,
                    MaterialPageRoute(builder: (_) => const LoginScreen()),
                    (route) => false, // Parameter ini menghapus semua history halaman
                  );
                },
                child: const Text("Logout dari Aplikasi"),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

```

**Penjelasan:**

* **`AuthService.user`**: Kita tidak perlu melakukan pemanggilan API baru di sini. Karena kita menggunakan PocketBase `AuthStore`, data user sudah tersedia secara lokal di dalam memori aplikasi setelah login berhasil.
* **Operator `??` (Null Coalescing)**: Digunakan untuk memberikan nilai cadangan (fallback). Jika field `name` di database kosong, aplikasi akan menampilkan tulisan "Tanpa Nama" alih-alih menampilkan error.
* **`Navigator.pushAndRemoveUntil`**: Ini adalah bagian yang paling krusial untuk fitur Logout. Fungsi ini tidak hanya memindahkan user ke halaman login, tapi juga **menghapus semua riwayat halaman (stack)**. Hal ini mencegah user kembali ke halaman profil/home dengan tombol "Back" setelah mereka logout.
* **`getStringValue('name')`**: Ini adalah metode bawaan dari `RecordModel` PocketBase untuk mengambil data secara aman dalam bentuk String.

---

## D. Jalankan Aplikasi (`main.dart`)

**Definisi:**
`main.dart` adalah jantung dari aplikasi Flutter. Di sini kita melakukan konfigurasi global, memulai koneksi ke layanan eksternal (PocketBase), dan menentukan **Conditional Routing** (percabangan rute) untuk memutuskan apakah pengguna harus melihat halaman Login atau bisa langsung masuk ke Beranda.

**Implementasi Kode:**

```jsx
import 'package:flutter/material.dart';
import 'services/auth_service.dart';
import 'screens/home_screen.dart';
import 'screens/login_screen.dart';

void main() async {
  // 1. Menjamin inisialisasi framework Flutter selesai
  WidgetsFlutterBinding.ensureInitialized();

  // 2. Menghubungkan ke PocketBase sebelum UI muncul
  await AuthService.init();

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'PocketBase Auth Notes',
      theme: ThemeData(primarySwatch: Colors.blue),
      
      // 3. Penentuan Halaman Pertama (Auto-Login Logic)
      home: AuthService.isLoggedIn 
          ? const HomeScreen() 
          : const LoginScreen(),
    );
  }
}

```

**Penjelasan:**

* **`WidgetsFlutterBinding.ensureInitialized()`**: Baris ini wajib ada jika kita memanggil kode asinkron (`await`) di dalam fungsi `main`. Ini memastikan mesin Flutter siap berkomunikasi dengan platform (Android/iOS) untuk mengakses penyimpanan lokal.
* **`await AuthService.init()`**: Kita menjalankan inisialisasi ini di awal agar saat aplikasi terbuka, status `isLoggedIn` sudah terisi dengan data token yang benar dari memori HP.
* **Ternary Operator pada `home**`:
* Jika `isLoggedIn` adalah **true**, aplikasi langsung menampilkan `HomeScreen`.
* Jika **false**, aplikasi menampilkan `LoginScreen`.
* Ini menciptakan pengalaman *auto-login* yang mulus bagi pengguna.

---

🚀 Panduan Menjalankan Aplikasi

Agar aplikasi berjalan lancar, perhatikan poin-poin teknis berikut:

| Poin | Keterangan |
| --- | --- |
| **Koneksi Internet** | Pastikan emulator atau perangkat fisik Anda memiliki akses internet aktif. |
| **Penyesuaian IP** | Jika menggunakan **Emulator Android**, ganti IP `127.0.0.1` menjadi `10.0.2.2` di file `auth_service.dart`. |
| **HP Asli** | Jika menggunakan kabel data ke HP asli, gunakan alamat IP lokal komputer Anda (misal: `192.168.1.xx`). |
| **Perintah Run** | Ketik `flutter run` di terminal untuk mulai mengompilasi aplikasi. |

---

📝 Ringkasan Alur Kerja Client (End-to-End)

1. **Inisialisasi**: Aplikasi memeriksa apakah ada token di `SharedPreferences`.
2. **Autentikasi**: User menekan tombol login → Browser terbuka (OAuth2) → User memilih akun Google → PocketBase mengirim token kembali ke aplikasi.
3. **Penyimpanan**: Token disimpan secara permanen di HP oleh `AsyncAuthStore`.
4. **Akses Data**: Aplikasi menggunakan token tersebut untuk meminta data catatan yang hanya milik user tersebut ke koleksi `notes`.
5. **Interaksi**: User dapat menambah atau menghapus catatan, dan UI akan langsung memperbarui tampilannya via `setState`.

---
