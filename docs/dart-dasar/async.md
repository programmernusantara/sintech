---
sidebar_position: 8
---

# ⚡ Async

Dalam pemrograman Dart, **asynchronous programming** memungkinkan program menjalankan beberapa proses **secara bersamaan** tanpa harus menunggu satu tugas selesai terlebih dahulu.  
Konsep ini penting ketika menangani tugas yang memerlukan waktu lama, seperti:

- mengambil data dari internet,
- membaca/menulis file,
- memberi jeda waktu.

Dengan asynchronous, program **tidak macet**. Ia tetap menjalankan kode lain sementara proses yang lama berjalan di latar belakang.

---

## Synchronous

Pada mode **synchronous**, semua baris kode dijalankan **berurutan**.  
Satu baris selesai → baru lanjut ke baris berikutnya.

```jsx
void main() {
  print('start');
  print('task');
  print('end');
}
````


**📘 Penjelasan:**

* Semua perintah berjalan **secara urut**.
---

## Asynchronous

`Future.delayed()` membuat sebuah tugas dijalankan **di masa depan** (setelah waktu tertentu) tanpa menghentikan kode berikutnya.

```jsx
void main() {
  print('start');

  Future.delayed(Duration(seconds: 3), () => print('task'));

  print('end');
}
```

**📘 Penjelasan:**

* `Future.delayed()` menjadwalkan tugas untuk dijalankan setelah 3 detik.
* Program **tidak menunggu** tugas selesai.
---

## Future dengan `.then()`

Kita bisa menangani hasil `Future` menggunakan method `.then()`, mirip callback.

```jsx
void main() {
  print('start');

  getDataThen().then((value) => print(value));

  print('end');
}

Future<String> getDataThen() async {
  return Future.delayed(Duration(seconds: 2), () => 'Mark');
}
```

**📘 Penjelasan:**

* `getDataThen()` mengembalikan `Future<String>`.
* `.then()` menangkap nilai ketika proses selesai.
---

## Async & Await

`async` dan `await` membuat asynchronous lebih mudah dibaca seperti synchronous.

```jsx
void main() async {
  print('start');

  String result = await getDataAwait();
  print(result);

  print('end');
}

Future<String> getDataAwait() async {
  await Future.delayed(Duration(seconds: 3));
  return 'task';
}
```

**📘 Penjelasan:**

* `async` → fungsi berisi operasi asynchronous.
* `await` → menunggu Future selesai.
---

## Error Handling

Ketika memakai `async–await`, kita dapat menangani error menggunakan `try–catch`.

```jsx
void main() {
  print('start');
  getUser();
  print('end');
}

Future<void> getUser() async {
  try {
    String data = await getData();
    print(data);
  } catch (err) {
    print('Some error: $err');
  }
}

Future<String> getData() async {
  return Future.delayed(Duration(seconds: 3), () => 'Wildan');
}
```

**📘 Penjelasan:**

* `getUser()` memanggil `getData()` menggunakan `await`.
* `try–catch` menangkap error jika terjadi kesalahan.