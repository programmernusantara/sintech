---
sidebar_position: 3
---

# Auth

Dalam pengembangan aplikasi, keamanan akses dan perlindungan data pengguna merupakan prioritas utama. Aplikasi tidak boleh dapat diakses secara bebas tanpa verifikasi, terutama jika menyimpan data pribadi pengguna.

Pada tutorial sebelumnya, kita telah membangun aplikasi sederhana dengan fitur CRUD Notes menggunakan Flutter dan PocketBase. Namun, aplikasi tersebut belum aman karena pengguna dapat mengakses aplikasi tanpa login, sehingga data setiap pengguna berpotensi diakses oleh pihak lain.

Oleh karena itu, autentikasi diperlukan agar setiap pengguna melakukan verifikasi identitas terlebih dahulu sebelum menggunakan aplikasi. Dengan autentikasi, data pribadi pengguna akan terlindungi dan hanya dapat diakses oleh pemiliknya.

Pada tutorial ini, kita akan mengimplementasikan fitur autentikasi sederhana menggunakan **Google Authentication** sebagai layanan pihak ketiga. Metode ini tergolong aman karena kredensial pengguna (seperti kata sandi) dikelola langsung oleh Google. Server aplikasi hanya menyimpan identitas dasar pengguna, seperti nama akun dan foto profil.

Selain aman, autentikasi berbasis **OAuth 2.0** juga mudah diimplementasikan dan memberikan pengalaman pengguna yang lebih nyaman.

Mmembuat fitur authenticasi dan crud notes dengan dengan flutter dan pocetbase dengan google 

## 1. Setup Server

Buat koleksi baru dengan nama notes
tambahakan field title dan relatasi ke user
set api rules nya ke user = @request.auth.id
konfirugasi google auth
buat layann authentikasi di google clound console
buat project baru bebebas dengan nama apa saja contoh "Note App"
membuat kredesial (client id & screent) masuk ke api & services kemudian credentials lalau buat creaditals baru pilih yang jenis web aplicatiions di Authorized redirect URIs kita tambahkan alamat ini untuk test local http://127.0.0.1:8090/api/oauth2-redirect 

kemudian create dan simpan atau downloade client id dan client screet untuk kita gunakan di pocketbase nanti

selanjutnya kita seting autheticasi di pocketbase dengna masuk ke pengaturan user klik autheticasi lalu polih outprifeder goolge lalu aktifkan dan masuk client id dan client screet yang sudah kita buat sebelumnya dan save


## 2. Setup Client
