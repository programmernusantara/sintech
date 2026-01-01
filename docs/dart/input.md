---
sidebar_position: 10
---

# User Input

Handling User Input adalah proses ketika aplikasi menerima, membaca, dan mengolah data yang dimasukkan pengguna melalui komponen antarmuka (UI).  

---

## Button

`ElevatedButton` digunakan untuk membuat tombol standar yang bisa ditekan oleh pengguna.

```jsx
import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      home: Scaffold(
        appBar: AppBar(title: const Text('ElevatedButton Example')),
        body: Center(
          child: ElevatedButton(
            onPressed: () {
              print("Login button pressed");
            },
            child: const Text('Login'),
          ),
        ),
      ),
    );
  }
}
```

**Algoritma:**

* `ElevatedButton` → Membuat tombol interaktif.
* `onPressed` → Fungsi yang dijalankan saat tombol ditekan.
* `child: Text('Login')` → Menampilkan teks pada tombol.

---

`ElevatedButton.icon` digunakan untuk tombol yang memiliki **ikon dan teks** sekaligus.

```jsx
import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Icon Button Example',
      home: Scaffold(
        appBar: AppBar(title: const Text('ElevatedButton with Icon')),
        body: Center(
          child: ElevatedButton.icon(
            onPressed: () {
              print("Like button pressed");
            },
            icon: const Icon(Icons.thumb_up),
            label: const Text('Like'),
          ),
        ),
      ),
    );
  }
}
```

**Algoritma:**

* `ElevatedButton.icon` → Tombol dengan ikon dan teks.
* `icon: Icon()` → Menampilkan ikon di tombol.
* `label: Text()` → Menampilkan teks di tombol.
* `onPressed` → Fungsi dijalankan saat tombol ditekan.

---

`FloatingActionButton` adalah tombol mengambang yang biasanya digunakan untuk aksi utama aplikasi.

```jsx
import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'FloatingActionButton Example',
      home: Scaffold(
        appBar: AppBar(title: const Text('FAB Example')),
        body: const Center(
          child: Text('Hello World'),
        ),
        floatingActionButton: FloatingActionButton(
          onPressed: () {
            print("FAB pressed");
          },
          backgroundColor: Colors.blueAccent,
          mini: true,
          child: const Icon(Icons.add),
        ),
      ),
    );
  }
}
```

**Algoritma:**

* `FloatingActionButton` → Tombol mengambang di atas konten.
* `onPressed` → Fungsi dijalankan saat FAB ditekan.
* `backgroundColor` → Warna latar belakang tombol.
* `mini: true` → Ukuran FAB lebih kecil.
* `child: Icon(Icons.add)` → Ikon di dalam tombol.

---

## SnackBar

`SnackBar` menampilkan pesan sementara di bawah layar sebagai notifikasi.

```jsx
import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Snackbar Example',
      home: Scaffold(
        appBar: AppBar(title: const Text('SnackBar Example')),
        body: Center(
          child: Builder(
            builder: (BuildContext context) {
              return ElevatedButton.icon(
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('You liked this! 👍'),
                      duration: Duration(seconds: 2),
                    ),
                  );
                },
                icon: const Icon(Icons.thumb_up),
                label: const Text('Like'),
              );
            },
          ),
        ),
      ),
    );
  }
}
```

**Algoritma:**

* `SnackBar` → Widget pesan sementara.
* `ScaffoldMessenger.of(context).showSnackBar()` → Menampilkan SnackBar.
* `content: Text()` → Isi pesan SnackBar.
* `duration` → Lama pesan ditampilkan.

---

## Form

`Form` digunakan untuk mengelola input data yang memerlukan validasi, seperti login atau registrasi.

```jsx
import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Form Example',
      home: Scaffold(
        appBar: AppBar(title: const Text('Login Form Example')),
        body: Padding(
          padding: const EdgeInsets.all(20.0),
          child: Builder(
            builder: (BuildContext context) {
              return Form(
                key: _formKey,
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    // Input Nama
                    TextFormField(
                      controller: _nameController,
                      decoration: const InputDecoration(
                        labelText: 'Name',
                        hintText: 'Enter your name',
                        border: OutlineInputBorder(),
                      ),
                      validator: (value) {
                        if (value == null || value.trim().isEmpty) {
                          return 'Please enter your name';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 20),

                    // Input Password
                    TextFormField(
                      controller: _passwordController,
                      obscureText: true,
                      decoration: const InputDecoration(
                        labelText: 'Password',
                        hintText: 'Enter your password',
                        border: OutlineInputBorder(),
                      ),
                      validator: (value) {
                        if (value == null || value.trim().isEmpty) {
                          return 'Please enter your password';
                        } else if (value.trim().length < 6) {
                          return 'Password must be at least 6 characters';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 20),

                    // Submit Button
                    ElevatedButton(
                      onPressed: () {
                        if (_formKey.currentState!.validate()) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text(
                                'Welcome, ${_nameController.text.trim()}!',
                              ),
                            ),
                          );
                        }
                      },
                      child: const Text('Login'),
                    ),
                  ],
                ),
              );
            },
          ),
        ),
      ),
    );
  }
}
```

**Algoritma:**

* `Form` → Membungkus input agar bisa divalidasi.
* `GlobalKey<FormState>` → Mengontrol state form.
* `TextEditingController` → Mengelola teks input.
* `TextFormField` → Input teks dengan validasi.
* `validator` → Fungsi untuk validasi input.
* `ElevatedButton` → Tombol submit form.
* `ScaffoldMessenger.of(context).showSnackBar()` → Menampilkan pesan setelah submit.

---
