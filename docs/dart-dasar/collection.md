---
sidebar_position: 3
---

# 🧾 Collection

Dalam bahasa Dart, terdapat beberapa **struktur data koleksi** yang digunakan untuk menyimpan banyak nilai sekaligus.
Setiap struktur data memiliki karakteristik dan kegunaannya masing-masing dalam pengelolaan data.

---

## List

**List** digunakan untuk menyimpan banyak data dalam satu variabel.
Data di dalam List memiliki **indeks** (mulai dari angka 0).


```jsx

void main() {
  List<String> user = ['Wildan', 'Rani', 'Lita'];

  print('Data awal: $user');
  print('Index ke-1: ${user[1]}');
  print('Jumlah data: ${user.length}');

  user.add('Firmani');
  print('Tambah 1 data: $user');

  user.addAll(['Gufron', 'Ubet']);
  print('Tambah banyak data: $user');

  user.removeAt(1);
  print('Hapus index 1: $user');
}

```

**📘 Penjelasan:**

* `List<String>` → Menyimpan banyak data String berurutan.
* `user.add()` → Menambah satu elemen.
* `user.addAll()` → Menambah banyak elemen sekaligus.
* `user.removeAt(1)` → Menghapus elemen berdasarkan indeks.

---

## Set

**Set** menyimpan data **unik** (tidak boleh ada elemen yang sama).
Set juga **tidak memiliki urutan pasti** seperti List.

```jsx

void main() {
  Set<String> kota = {'Jakarta', 'Bandung', 'Surabaya'};
  print(kota);

  print('Jumlah data: ${kota.length}');

  kota.add('Jogjakarta');
  print('Tambah 1 data: $kota');

  kota.addAll({'Lumajang', 'Banyuwangi'});
  print('Tambah banyak data: $kota');

  kota.remove('Jakarta');
  print('Hapus data: $kota');

  kota.removeAll({'Bandung', 'Surabaya'});
  print('Hapus banyak data: $kota');
}

```

**📘 Penjelasan:**

* Elemen Set **tidak duplikat**.
* `add()` → Menambah 1 data.
* `addAll()` → Menambah banyak data.
* `remove()` & `removeAll()` → Menghapus data.

---

## Map

**Map** menyimpan data dalam bentuk **key → value**.
Key harus **unik**, dan digunakan untuk mengambil value.

```jsx

void main() {
  Map<String, String> ibuKota = {
    'USA': 'Washington',
    'China': 'Beijing',
    'Indonesia': 'IKN',
  };

  print(ibuKota);
  print('Ibu kota USA: ${ibuKota['USA']}');

  ibuKota['Japan'] = 'Tokyo';
  print('Tambah data: $ibuKota');

  ibuKota['USA'] = 'Updated';
  print('Update data: $ibuKota');

  ibuKota.remove('USA');
  print('Hapus data: $ibuKota');
}

```

**📘 Penjelasan:**

* `Map<String, String>` → Menyimpan pasangan key–value.
* `ibuKota['Japan'] = 'Tokyo'` → Menambah data baru.
* Mengubah data cukup dengan menimpa value menggunakan key yang sama.
* `remove('USA')` → Menghapus pasangan key–value.

---