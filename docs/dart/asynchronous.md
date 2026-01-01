---
sidebar_position: 8
---

# Async

Asynchronous programming memungkinkan program melakukan beberapa operasi sekaligus tanpa harus menunggu operasi sebelumnya selesai. Ini sangat berguna ketika berhadapan dengan operasi lambat seperti HTTP request, file I/O, atau database.

---

## Async vs Sync

- **Synchronous (Sync)**: Kode dieksekusi secara berurutan, satu per satu. Baris berikutnya menunggu baris sebelumnya selesai.  
- **Asynchronous (Async)**: Kode dapat berjalan di latar belakang, sehingga program tidak menunggu operasi selesai. Cocok untuk operasi lambat.

```jsx
void main() {
  print("Mulai");

  Future.delayed(Duration(seconds: 3), () => print("Tugas selesai"));

  print("Selesai");
}
```

**Algoritma:**

* `void main() {}` → Menandai fungsi utama program.
* `print("Mulai");` → Cetak teks "Mulai" ke console.
* `Future.delayed(Duration(seconds: 3), () => print("Tugas selesai"));` → Membuat Future yang dijalankan setelah 3 detik, mencetak "Tugas selesai" tanpa menghentikan eksekusi kode lain.
* `print("Selesai");` → Dicetak langsung, tanpa menunggu Future selesai.

---

## Future

**Future** adalah objek yang mewakili nilai yang akan tersedia di masa depan. Berguna untuk operasi async seperti mengambil data dari server atau membaca file.

```jsx
Future<String> sayHello() {
  return Future.delayed(Duration(seconds: 1), () => "Hello dari Future");
}

void main() {
  print("Mulai");

  sayHello().then((value) => print(value));

  print("Selesai");
}
```

**Algoritma:**

* `Future<String> sayHello()` → Fungsi yang mengembalikan Future bertipe String.
* `return Future.delayed(Duration(seconds: 1), () => "Hello dari Future");` → Membuat Future yang menghasilkan string setelah 1 detik.
* `sayHello().then((value) => print(value));` → Menangkap hasil Future saat selesai, lalu mencetak nilainya.
* `print("Selesai");` → Dicetak segera tanpa menunggu Future selesai.

---

## Async & Await

* **`async`** → Menandai fungsi asynchronous. Otomatis mengembalikan Future.
* **`await`** → Menunggu Future selesai sebelum melanjutkan baris kode berikutnya. Membuat kode async lebih mudah dibaca seperti synchronous.

```jsx
Future<String> fetchData() async {
  await Future.delayed(Duration(seconds: 2));
  return "Data dari server";
}

void main() async {
  print("Mulai fetch data...");

  String data = await fetchData();
  print(data);

  print("Selesai");
}
```

**Algoritma:**

* `Future<String> fetchData() async` → Fungsi async yang mengembalikan Future String.
* `await Future.delayed(Duration(seconds: 2));` → Menunggu 2 detik sebelum melanjutkan eksekusi.
* `return "Data dari server";` → Mengembalikan string sebagai hasil Future.
* `String data = await fetchData();` → Menunggu `fetchData()` selesai dan menyimpan hasilnya ke variabel `data`.

---

## GET API

**GET API** digunakan untuk mengambil data dari server. Biasanya hasilnya berupa JSON, yang perlu diubah menjadi `List` atau `Map` agar bisa digunakan di Dart.

```jsx
import 'dart:convert';
import 'package:http/http.dart' as http;

Future<List> fetchPosts() async {
  final response =
      await http.get(Uri.parse('https://jsonplaceholder.typicode.com/posts'));

  return jsonDecode(response.body);
}

void main() async {
  try {
    List data = await fetchPosts();
    print("Jumlah post: ${data.length}");
    print("Judul post pertama: ${data[0]['title']}");
  } catch (e) {
    print('Error: $e');
  }
}
```

**Algoritma:**

* `import 'dart:convert';` → Library untuk konversi JSON.
* `import 'package:http/http.dart' as http;` → Library untuk HTTP request.
* `await http.get(Uri.parse(...));` → Mengirim GET request dan menunggu response.
* `jsonDecode(response.body)` → Mengubah JSON menjadi List atau Map.
* `try { ... } catch (e) { ... }` → Menangkap error jika request gagal.
* `print("Jumlah post: ${data.length}");` → Mencetak jumlah data.
* `print("Judul post pertama: ${data[0]['title']}");` → Mencetak judul post pertama.

---

## Error Handling

Error handling penting untuk mencegah aplikasi crash saat terjadi kesalahan.

```jsx
import 'dart:convert';
import 'package:http/http.dart' as http;

Future<List> fetchData() async {
  final response =
      await http.get(Uri.parse('https://jsonplaceholder.typicode.com/posts'));

  if (response.statusCode == 200) {
    return jsonDecode(response.body);
  } else {
    throw Exception('Gagal ambil data. Status code: ${response.statusCode}');
  }
}

void main() async {
  try {
    List data = await fetchData();
    print(data[1]);
  } catch (e) {
    print('Error: $e');
  }
}
```

**Algoritma:**

* `if (response.statusCode == 200)` → Mengecek apakah request berhasil.
* `throw Exception(...)` → Jika gagal, lempar exception dengan pesan.
* `try { ... } catch (e) { ... }` → Menangkap exception saat memanggil fungsi async.
* `print(data[1]);` → Mengakses data jika berhasil.
* `print('Error: $e');` → Menampilkan pesan error jika terjadi exception.

---
