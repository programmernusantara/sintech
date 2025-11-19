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

### **Person**

* Memiliki property `name`, `age`.
* Constructor untuk mengisi data.
* Method `sayHello()`.

### **Animal (Induk)**

* Property `name`.
* Method dasar `sound()`.

### **Dog & Cat (Anak)**

* `extends Animal` → mewarisi class induk.
* Menggunakan `@override` untuk membuat suara berbeda.

### **main()**

* Membuat objek Person, Dog, Cat.
* Memanggil method masing-masing objek.

---