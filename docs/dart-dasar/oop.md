---
sidebar_position: 7
---

# 🧱 OOP

Pemrograman Berorientasi Objek (Object Oriented Programming/OOP) adalah metode pemrograman yang menggunakan objek dan interaksinya untuk membangun aplikasi. Paradigma ini umum digunakan pada bahasa seperti Dart, Java, C++, dan Python.

Dalam OOP, sebuah objek memiliki **atribut (property)** dan **perilaku (method)**.
Contohnya, objek `Person` bisa memiliki `name`, `age`, dan method seperti `walk()` atau `talk()`.

---

## Class

**Class** adalah blueprint untuk membuat objek. Di dalam class terdapat property, method, dan constructor.

```jsx
class Person {

}

void main() {}
```

**Penjelasan:**

* `class Person {}` → membuat class bernama **Person**, masih kosong.
* `void main()` → fungsi utama program.

---

## Property

Property adalah variabel di dalam class untuk menyimpan data.

```jsx
class Person {
  String name = 'Wildan';
  int age = 20;
}

void main() {}
```

**Penjelasan:**

* `String name = 'Wildan';` → property bertipe String dengan nilai awal.
* `int age = 20;` → property bertipe integer dengan nilai awal.

---

## Object

Objek adalah hasil nyata dari class. Dibuat menggunakan `NamaClass()`.

```jsx
class Person {
  String name = "Wildan";
  int age = 20;
}

void main() {
  var user = Person();
  print("Nama: ${user.name}");
  print("Umur: ${user.age}");
}
```

**Penjelasan:**

* `var user = Person();` → membuat objek bernama **user**.
* `${user.name}` → mengambil property `name`.
* `${user.age}` → mengambil property `age`.

---

## Constructor

Constructor digunakan untuk memberikan nilai awal saat objek dibuat.

```jsx
class Person {
  String name;
  int age;

  Person(this.name, this.age);
}

void main() {
  var user = Person("Wildan", 20);
  print('Nama: ${user.name}');
  print('Umur: ${user.age}');
}
```

**Penjelasan:**

* `String name;` → property tanpa nilai awal.
* `Person(this.name, this.age);` → constructor yang otomatis mengisi property.
* `Person("Wildan", 20)` → membuat objek dengan nilai awal.

---

## Method

Method adalah fungsi di dalam class yang memberikan aksi/perilaku pada objek.

```jsx
class Person {
  String name;
  int age;

  Person(this.name, this.age);

  void sayHello() {
    print('Halo, saya $name, umur saya $age.');
  }
}

void main() {
  Person("Wildan", 20).sayHello();
}
```

**Penjelasan:**

* `void sayHello()` → method tanpa nilai kembali.
* `$name` dan `$age` → mengambil property milik objek.
* `.sayHello()` → memanggil method objek.

---

## Inheritance

Class anak dapat mewarisi property dan method dari class induk.

```jsx
class Animal {
  String name;

  Animal(this.name);

  void sound(String suara) {
    print('$name mengeluarkan suara: $suara');
  }
}

class Dog extends Animal {
  Dog(super.name);
}

void main() {
  Dog("Bobi").sound("Guk Guk");
}
```

**Penjelasan:**

* `class Animal` → class induk.
* `extends Animal` → class `Dog` mewarisi `Animal`.
* `Dog(super.name)` → constructor anak memanggil constructor induk.

---

## Override

Polymorphism memungkinkan method yang sama memiliki perilaku berbeda pada class anak.

```jsx
class Animal {
  String name;
  Animal(this.name);

  void sound() {
    print('$name membuat suara...');
  }
}

class Dog extends Animal {
  Dog(super.name);

  @override
  void sound() => print("$name: Guk Guk!");
}

class Cat extends Animal {
  Cat(super.name);

  @override
  void sound() => print("$name: Meong!");
}

void main() {
  Dog("Bobi").sound();
  Cat("Mimi").sound();
}
```

**Penjelasan:**

* `sound()` → method dasar milik class induk.
* `@override` → menandakan method diganti pada class anak.
* `Dog(super.name)` → meneruskan nilai ke constructor induk.

---

## OOP Dasar Lengkap

```jsx
class Person {
  String name;
  int age;

  Person(this.name, this.age);

  void sayHello() => print("Halo, saya $name.");
}

class Animal {
  String name;
  Animal(this.name);

  void sound() => print("$name membuat suara...");
}

class Dog extends Animal {
  Dog(super.name);

  @override
  void sound() => print("$name: guk guk!");
}

class Cat extends Animal {
  Cat(super.name);

  @override
  void sound() => print("$name: meong!");
}

void main() {
  var p = Person("Wildan", 20);
  p.sayHello();

  Dog("Bobi").sound();
  Cat("Mimi").sound();
}
```

**Penjelasan Singkat:**

**Person**

* Memiliki property `name`, `age`.
* Constructor untuk mengisi data.
* Method `sayHello()`.

**Animal (Induk)**

* Property `name`.
* Method dasar `sound()`.

**Dog & Cat (Anak)**

* `extends Animal` → mewarisi class induk.
* Menggunakan `@override` untuk membuat suara berbeda.

**main()**

* Membuat objek Person, Dog, Cat.
* Memanggil method masing-masing objek.

---

# 🔥 OOP LANJUTAN — WAJIB UNTUK FLUTTER

Pada bagian ini kamu akan mempelajari konsep OOP lanjutan di Dart.

---

## Encapsulation

Encapsulation adalah konsep dalam OOP yang digunakan untuk melindungi data agar tidak bisa diakses, diubah, atau rusak oleh bagian program lain yang tidak seharusnya menyentuh data itu.  
Tujuan utamanya adalah menjaga keamanan data, terutama ketika data itu memiliki sifat penting seperti saldo bank, password, token login, dan sebagainya.

Dalam Dart, encapsulation dilakukan menggunakan underscore `_` di depan nama variabel atau method.  
Saat sebuah property diawali `_`, property itu menjadi private, artinya hanya bisa diakses dari dalam file yang sama.

---

📌 Tanpa Encapsulation

**File: `bank_bri.dart`**

```jsx
class BankBri {
  double balance = 0; // public → bisa diakses dari file lain

  void deposit(double amount) {
    balance += amount;
  }
}
```

---

📌 Dengan Encapsulation

**File: `bank_bca.dart`**

```jsx
class BankBca {
  double _balance = 0; // private → hanya bisa diakses dalam file ini

  void deposit(double amount) {
    _balance += amount;
  }

  double getBalance() => _balance;
}
```

---

📌 Main Program

```jsx
import 'bank_bri.dart';
import 'bank_bca.dart';

void main() {
  var bri = BankBri();
  bri.deposit(100);
  bri.balance = -999; // bebas mengubah data (tidak aman)
  print("BRI (tanpa encapsulation): ${bri.balance}");

  var bca = BankBca();
  bca.deposit(100);
  // bca._balance = -999; ❌ error (karena private)
  print("BCA (dengan encapsulation): ${bca.getBalance()}");
}
```

---

🔍 Penjelasan

1. **double balance = 0;** → Public, bebas diakses luar.
2. **double _balance = 0;** → Private, aman.
3. **deposit(double amount)** → Menambah saldo.
4. **getBalance()** → Mengembalikan saldo safely.
5. **bri.balance = -999;** → Contoh bahaya tanpa encapsulation.
6. **bca._balance** → Tidak bisa diakses, aman.

---

## Getter & Setter

Getter adalah cara untuk mengambil atau membaca nilai dari variabel yang dibuat private.
Setter adalah cara untuk mengubah nilai variabel private dengan aturan tertentu (validasi).

---

```jsx
class BankAccount {
  double _balance = 0; // private (encapsulation)

  // Getter → ambil saldo
  double get balance => _balance;

  // Setter → ubah saldo dengan validasi
  set balance(double value) {
    if (value >= 0) {
      _balance = value;
    }
  }

  // Deposit
  void deposit(double amount) {
    if (amount > 0) {
      _balance += amount;
      print("Deposit berhasil: +$amount");
    }
  }
}

void main() {
  var acc = BankAccount();

  acc.balance = 0; // setter
  print("Saldo awal: ${acc.balance}"); // getter

  acc.deposit(50);
  print("Saldo setelah deposit: ${acc.balance}");
}
```

---

🔍 Penjelasan

1. `_balance` → private
2. `get balance =>` → Getter
3. `set balance()` → Setter + validasi
4. `acc.balance = 0` → memanggil setter
5. `acc.balance` → memanggil getter

---

## this & super

`this` digunakan untuk menunjuk variabel milik objek itu sendiri.
`super` digunakan untuk mengakses class induk dari class anak.

---

```jsx
class Notifikasi {
  final String? id;

  Notifikasi({this.id});

  void kirim() {
    print("Mengirim notifikasi umum...");
  }
}

class NotifikasiEmail extends Notifikasi {
  NotifikasiEmail({super.id});

  @override
  void kirim() {
    super.kirim();
    print("Mengirim notifikasi lewat EMAIL");
  }
}

void main() {
  var n = NotifikasiEmail(id: "notif_001");
  n.kirim();
}
```

---

## Penjelasan

1. `{this.id}` → memberikan nilai ke property
2. `extends Notifikasi` → class anak
3. `{super.id}` → meneruskan parameter ke parent
4. `@override` → override method
5. `super.kirim()` → jalankan method parent

---