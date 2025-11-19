---
sidebar_position: 1
---

# 🚀 Introduction

Selamat datang di panduan belajar pemrograman **Dart**!  
Panduan ini dibuat untuk membantu pemula memahami dasar-dasar Dart melalui contoh sederhana, penjelasan yang jelas, dan struktur yang rapi.

Dart adalah bahasa pemrograman yang cepat, modern, dan digunakan untuk membangun aplikasi mobile, web, server, hingga desktop — terutama bersama Flutter.

---

## Hello World

Program pertama yang biasanya dibuat dalam bahasa apa pun adalah **Hello World**.

```jsx
void main() {
  print("Hello World");
}
````

**📘 Penjelasan:**

* `void main()`
  Fungsi **main** adalah titik awal (entry point) setiap program Dart. Program akan mulai dijalankan dari sini.
* `print()`
  Digunakan untuk menampilkan teks ke konsol atau terminal.

---

## Data Types

Variabel adalah tempat menyimpan data. Dart memiliki tipe data utama seperti:


```jsx
void main() {
  int num = 10;
  double precision = 100.00;
  String alfabet = 'Wildan';

  print(
    'Number: $num, Decimal: $precision, String: $alfabet',
  );
}
```

**📘 Penjelasan:**

* **Interpolasi String**
  `'Hello $name'` digunakan untuk memasukkan variabel ke dalam teks.
* `int` → bilangan bulat
* `double` → bilangan desimal
* `String` → teks
* `bool` → nilai benar/salah
* `List` → kumpulan nilai
* `Map` → pasangan kunci–nilai
---

## Arithmetic Operators

Operator ini digunakan untuk perhitungan matematika.

```jsx
void main() {
  var a = 10;
  var b = 5;

  print(a * b); // Perkalian
  print(a / b); // Pembagian
  print(a + b); // Penjumlahan
  print(a - b); // Pengurangan
}
```

Jenis operator:

* `*` → perkalian
* `/` → pembagian
* `+` → penjumlahan
* `-` → pengurangan
* `%` → sisa pembagian (modulus)

---

## Comparison Operators

Operator ini mengecek hubungan antar nilai dan menghasilkan `true` atau `false`.

```jsx
void main() {
  var a = 1;
  var b = 1;

  print(a == b);  // Sama dengan
  print(a != b);  // Tidak sama dengan
  print(a > b);   // Lebih besar dari
  print(a < b);   // Lebih kecil dari
  print(a >= b);  // Lebih besar atau sama dengan
  print(a <= b);  // Lebih kecil atau sama dengan
}
```

Jenis operator:

* `==` → sama dengan
* `!=` → tidak sama dengan
* `>` → lebih besar
* `<` → lebih kecil
* `>=` → lebih besar atau sama dengan
* `<=` → lebih kecil atau sama dengan

---