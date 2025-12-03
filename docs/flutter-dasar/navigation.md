---
sidebar_position: 4
---

# 🧭 Navigation

Navigasi dalam Flutter digunakan untuk **berpindah antar halaman (screen)** di dalam aplikasi.  
Flutter menggunakan sistem navigasi berbasis **stack**, di mana setiap halaman baru akan ditumpuk di atas halaman sebelumnya — seperti menumpuk kartu.

---

## Navigator

`Navigator.push` digunakan untuk **pindah ke halaman lain**, sedangkan `Navigator.pop` digunakan untuk **kembali ke halaman sebelumnya**.

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
      debugShowCheckedModeBanner: false,
      home: const HomePage(),
    );
  }
}

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Home Page")),
      body: Center(
        child: ElevatedButton.icon(
          icon: const Icon(Icons.person),
          label: const Text("Profil"),
          onPressed: () {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => const ProfilPage()),
            );
          },
        ),
      ),
    );
  }
}

class ProfilPage extends StatelessWidget {
  const ProfilPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Profil Page")),
      body: Center(
        child: ElevatedButton(
          onPressed: () => Navigator.pop(context),
          child: const Text("Kembali ke Home"),
        ),
      ),
    );
  }
}
```

**Penjelasan**

* `Navigator.push()` → Membuka halaman baru.
* `MaterialPageRoute()` → Membuat rute ke halaman tujuan.
* `Navigator.pop()` → Menutup halaman dan kembali ke halaman sebelumnya.
* `ElevatedButton.icon` → Tombol dengan ikon dan teks.

---

## TabBar

`TabBar` tidak berpindah halaman, tetapi **mengganti konten pada halaman yang sama**.
Cocok untuk fitur seperti Home, Settings, dan Profile.

```jsx
import 'package:flutter/material.dart';

void main() {
  runApp(const App());
}

class App extends StatelessWidget {
  const App({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: DefaultTabController(
        length: 3,
        child: Scaffold(
          appBar: AppBar(
            title: const Text("TabBar Navigation"),
            bottom: const TabBar(
              tabs: [
                Tab(icon: Icon(Icons.home), text: 'Home'),
                Tab(icon: Icon(Icons.settings), text: 'Settings'),
                Tab(icon: Icon(Icons.person), text: 'Profile'),
              ],
            ),
          ),
          body: const TabBarView(
            children: [
              Center(child: Text('Home Page')),
              Center(child: Text('Settings Page')),
              Center(child: Text('Profile Page')),
            ],
          ),
        ),
      ),
    );
  }
}
```

**Penjelasan**

* `DefaultTabController` → Mengatur jumlah tab.
* `TabBar` → Daftar tab di bagian atas.
* `TabBarView` → Konten yang ditampilkan sesuai tab.
* `Tab` → Widget dari setiap tab (icon + text).

---

## Drawer

`Drawer` adalah menu samping yang muncul dari kiri layar.
Navigasi dilakukan menggunakan `Navigator`, sama seperti push & pop.

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
      debugShowCheckedModeBanner: false,
      home: const HomePage(),
    );
  }
}

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Home Page")),

      drawer: Drawer(
        child: ListView(
          padding: EdgeInsets.zero,
          children: [
            const DrawerHeader(
              decoration: BoxDecoration(color: Colors.blue),
              child: Center(
                child: Text(
                  'Menu',
                  style: TextStyle(color: Colors.white, fontSize: 20),
                ),
              ),
            ),

            ListTile(
              leading: const Icon(Icons.home),
              title: const Text("Home"),
              onTap: () => Navigator.pop(context),
            ),

            ListTile(
              leading: const Icon(Icons.person),
              title: const Text("Profil"),
              onTap: () {
                Navigator.pop(context);
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const ProfilPage()),
                );
              },
            ),

            ListTile(
              leading: const Icon(Icons.video_collection),
              title: const Text("Video"),
              onTap: () {
                Navigator.pop(context);
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const VideoPage()),
                );
              },
            ),
          ],
        ),
      ),

      body: const Center(
        child: Text(
          "Selamat datang di Home Page!",
          style: TextStyle(fontSize: 20),
        ),
      ),
    );
  }
}

class ProfilPage extends StatelessWidget {
  const ProfilPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Profil Page")),
      body: const Center(child: Text("Ini adalah Profil Page")),
    );
  }
}

class VideoPage extends StatelessWidget {
  const VideoPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Video Page")),
      body: const Center(child: Text("Ini adalah Video Page")),
    );
  }
}
```

**Penjelasan**

* `Drawer` → Membuat menu samping.
* `DrawerHeader` → Bagian header pada drawer.
* `ListTile` → Item menu yang dapat ditekan.
* `Navigator.push()` → Membuka halaman baru saat menu dipilih.
* `Navigator.pop()` → Menutup drawer setelah dipilih.

---
