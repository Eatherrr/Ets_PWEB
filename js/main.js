var cart = [];

function addToCart(nama, harga) {
  var sudahAda = false;

  for (var i = 0; i < cart.length; i++) {
    if (cart[i].nama === nama) {
      cart[i].qty += 1;
      sudahAda = true;
      break;
    }
  }

  if (!sudahAda) {
    cart.push({ nama: nama, harga: harga, qty: 1 });
  }

  renderCart();
  tampilkanToast(nama + ' ditambahkan ke keranjang! 🛒');
}

function hapusItem(index) {
  cart.splice(index, 1);
  renderCart();
}

function renderCart() {
  var container = document.getElementById('cartItems');
  var badge = document.getElementById('cartCount');
  var totalEl = document.getElementById('totalHarga');

  var totalItem = 0;
  for (var i = 0; i < cart.length; i++) {
    totalItem += cart[i].qty;
  }
  badge.textContent = totalItem;

  if (cart.length === 0) {
    container.innerHTML = '<p class="text-center text-muted mt-4">Keranjang masih kosong 🛒</p>';
    totalEl.textContent = 'Rp 0';
    return;
  }

  var html = '';
  var total = 0;

  for (var i = 0; i < cart.length; i++) {
    var item = cart[i];
    var subtotal = item.harga * item.qty;
    total += subtotal;

    html += '<div class="d-flex justify-content-between align-items-center mb-3">';
    html += '  <div>';
    html += '    <p class="mb-0 fw-semibold">' + item.nama + '</p>';
    html += '    <small class="text-muted">Rp ' + item.harga.toLocaleString('id-ID') + ' x ' + item.qty + '</small>';
    html += '  </div>';
    html += '  <div class="d-flex align-items-center gap-2">';
    html += '    <span class="fw-bold text-danger">Rp ' + subtotal.toLocaleString('id-ID') + '</span>';
    html += '    <button class="btn btn-sm btn-outline-danger" onclick="hapusItem(' + i + ')">';
    html += '      <i class="bi bi-trash"></i>';
    html += '    </button>';
    html += '  </div>';
    html += '</div>';
  }

  container.innerHTML = html;
  totalEl.textContent = 'Rp ' + total.toLocaleString('id-ID');
}

function checkout() {
  var nama = document.getElementById('nama').value.trim();
  var hp = document.getElementById('nomorHP').value.trim();
  var alamat = document.getElementById('alamat').value.trim();
  var pembayaran = document.getElementById('pembayaran').value;

  if (cart.length === 0) {
    alert('Keranjang kamu masih kosong!');
    return;
  }

  if (nama === '' || hp === '' || alamat === '' || pembayaran === '') {
    alert('Mohon isi semua form yang wajib diisi!');
    return;
  }

  var total = 0;
  for (var i = 0; i < cart.length; i++) {
    total += cart[i].harga * cart[i].qty;
  }

  alert(
    'Pesanan Berhasil!\n\n' +
    'Nama: ' + nama + '\n' +
    'HP: +62' + hp + '\n' +
    'Alamat: ' + alamat + '\n' +
    'Pembayaran: ' + pembayaran + '\n' +
    'Total: Rp ' + total.toLocaleString('id-ID') + '\n\n' +
    'Pesanan akan segera diproses. Terima kasih!'
  );

  cart = [];
  renderCart();

  // reset form
  document.getElementById('nama').value = '';
  document.getElementById('nomorHP').value = '';
  document.getElementById('alamat').value = '';
  document.getElementById('catatan').value = '';
  document.getElementById('pembayaran').value = '';
}

function tampilkanToast(pesan) {
  var toastEl = document.getElementById('toastKeranjang');
  var pesanEl = document.getElementById('toastPesan');
  pesanEl.textContent = pesan;
  var toast = new bootstrap.Toast(toastEl, { delay: 2500 });
  toast.show();
}


function daftarAkun() {
  var nama = document.getElementById('daftarNama').value.trim();
  var username = document.getElementById('daftarUsername').value.trim();
  var password = document.getElementById('daftarPassword').value.trim();
  var pesan = document.getElementById('pesanDaftar');

  if (nama === '' || username === '' || password === '') {
    pesan.style.display = '';
    pesan.className = 'small text-danger';
    pesan.textContent = 'Semua kolom wajib diisi!';
    return;
  }

  var users = JSON.parse(localStorage.getItem('mapeUsers') || '[]');

  for (var i = 0; i < users.length; i++) {
    if (users[i].username === username) {
      pesan.style.display = '';
      pesan.className = 'small text-danger';
      pesan.textContent = 'Username sudah dipakai, coba yang lain.';
      return;
    }
  }

  users.push({ nama: nama, username: username, password: password });
  localStorage.setItem('mapeUsers', JSON.stringify(users));

  pesan.style.display = '';
  pesan.className = 'small text-success';
  pesan.textContent = 'Akun berhasil dibuat! Silakan login.';

  document.getElementById('daftarNama').value = '';
  document.getElementById('daftarUsername').value = '';
  document.getElementById('daftarPassword').value = '';
}

function loginAkun() {
  var username = document.getElementById('loginUsername').value.trim();
  var password = document.getElementById('loginPassword').value.trim();
  var pesan = document.getElementById('pesanLogin');

  if (username === '' || password === '') {
    pesan.style.display = '';
    pesan.textContent = 'Username dan password tidak boleh kosong!';
    return;
  }

  var users = JSON.parse(localStorage.getItem('mapeUsers') || '[]');
  var ketemu = null;

  for (var i = 0; i < users.length; i++) {
    if (users[i].username === username && users[i].password === password) {
      ketemu = users[i];
      break;
    }
  }

  if (!ketemu) {
    pesan.style.display = '';
    pesan.textContent = 'Username atau password salah!';
    return;
  }

  localStorage.setItem('mapeUserLogin', JSON.stringify(ketemu));
  bootstrap.Modal.getInstance(document.getElementById('modalLogin')).hide();

  document.getElementById('loginUsername').value = '';
  document.getElementById('loginPassword').value = '';
  pesan.style.display = 'none';

  updateNavLogin();
  tampilkanToast('Halo, ' + ketemu.nama + '! Selamat datang.');
}

function logoutAkun() {
  localStorage.removeItem('mapeUserLogin');
  updateNavLogin();
}

function updateNavLogin() {
  var userLogin = JSON.parse(localStorage.getItem('mapeUserLogin') || 'null');

  if (userLogin) {
    document.getElementById('navLogin').style.display = 'none';
    document.getElementById('navUser').style.display = '';
    document.getElementById('namaUserNav').textContent = userLogin.nama;
  } else {
    document.getElementById('navLogin').style.display = '';
    document.getElementById('navUser').style.display = 'none';
  }
}

updateNavLogin();

function filterMenu(kategori, tombol) {
  var semuaItem = document.querySelectorAll('.menu-item');
  for (var i = 0; i < semuaItem.length; i++) {
    var item = semuaItem[i];
    if (kategori === 'semua' || item.getAttribute('data-kategori') === kategori) {
      item.style.display = '';
    } else {
      item.style.display = 'none';
    }
  }

  // reset semua tombol filter
  var semuaTombol = document.querySelectorAll('.filter-btn');
  for (var j = 0; j < semuaTombol.length; j++) {
    semuaTombol[j].classList.remove('btn-danger', 'active');
    semuaTombol[j].classList.add('btn-outline-danger');
  }

  if (tombol) {
    tombol.classList.add('btn-danger', 'active');
    tombol.classList.remove('btn-outline-danger');
  }
}
