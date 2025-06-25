// Main JavaScript for Gemora.id

// DOM Elements
const sidebarToggle = document.querySelector('.sidebar-toggle');
const sidebar = document.querySelector('.sidebar');
const sidebarOverlay = document.querySelector('.sidebar-overlay');
const closeBtn = document.querySelector('.close-btn');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const loginModal = document.getElementById('login-modal');
const closeModalButtons = document.querySelectorAll('.close-modal');
const productModal = document.getElementById('product-modal');
const rekberModal = document.getElementById('rekber-modal');

// Current product for checkout
let currentProduct = null;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Check auth status
    checkAuthStatus();
    
    // Initialize sidebar toggle
    sidebarToggle.addEventListener('click', function() {
        sidebar.classList.add('show');
        sidebarOverlay.classList.add('show');
    });
    
    // Close sidebar
    closeBtn.addEventListener('click', function() {
        sidebar.classList.remove('show');
        sidebarOverlay.classList.remove('show');
    });
    
    // Close sidebar when clicking overlay
    sidebarOverlay.addEventListener('click', function() {
        sidebar.classList.remove('show');
        sidebarOverlay.classList.remove('show');
    });
    
    // Login button
    loginBtn.addEventListener('click', function() {
        loginModal.style.display = 'flex';
    });
    
    // Logout button
    logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('isLoggedIn');
        checkAuthStatus();
    });
    
    // Close modals
    closeModalButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.modal-overlay').style.display = 'none';
        });
    });
    
    // Close modals when clicking outside
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.style.display = 'none';
            }
        });
    });
    
    // Banner slider
    if (document.querySelector('.banner-slider')) {
        const slides = document.querySelectorAll('.slide');
        let currentSlide = 0;
        
        function showSlide(n) {
            slides.forEach(slide => slide.classList.remove('active'));
            slides[n].classList.add('active');
        }
        
        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }
        
        showSlide(0);
        setInterval(nextSlide, 5000);
    }
});

// Check authentication status
function checkAuthStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (isLoggedIn) {
        loginBtn.style.display = 'none';
        logoutBtn.style.display = 'block';
    } else {
        loginBtn.style.display = 'block';
        logoutBtn.style.display = 'none';
    }
}

// Show product detail
function showProductDetail(product) {
    const modalBody = document.getElementById('modal-body');
    
    modalBody.innerHTML = `
        <div class="product-detail">
            <div class="product-detail-image" style="background-image: url('${product.gambar || 'images/default-product.jpg'}')"></div>
            <div class="product-detail-content">
                <h2>${product.judul}</h2>
                ${product.slogan ? `<p class="product-slogan">${product.slogan}</p>` : ''}
                <div class="product-detail-price">Rp${parseInt(product.harga).toLocaleString('id-ID')}</div>
                <div class="product-detail-desc">${product.deskripsi}</div>
                <div class="product-detail-spec">
                    <h3>Spesifikasi Akun:</h3>
                    <ul>
                        ${product.spek.split('\n').map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
                <div class="product-detail-actions">
                    <button class="btn btn-checkout" style="flex:1;">Checkout</button>
                </div>
            </div>
        </div>
    `;
    
    // Set current product for checkout
    currentProduct = product;
    
    // Add event listener to checkout button
    modalBody.querySelector('.btn-checkout').addEventListener('click', function() {
        productModal.style.display = 'none';
        rekberModal.style.display = 'flex';
    });
    
    productModal.style.display = 'flex';
}

// Handle rekber options
document.getElementById('use-rekber')?.addEventListener('click', function() {
    if (currentProduct) {
        const message = `Halo admin Gemora, saya ingin membeli produk:\n\n*${currentProduct.judul}*\nHarga: Rp${parseInt(currentProduct.harga).toLocaleString('id-ID')}\n\nSaya ingin menggunakan rekening bersama (Rekber) untuk transaksi ini.`;
        const whatsappUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    }
    rekberModal.style.display = 'none';
});

document.getElementById('no-rekber')?.addEventListener('click', function() {
    if (currentProduct) {
        const message = `Halo, saya tertarik dengan produk *${currentProduct.judul}* yang dijual di Gemora.id. Apakah masih tersedia?`;
        const whatsappUrl = `https://wa.me/${currentProduct.nomorPenjual}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    }
    rekberModal.style.display = 'none';
});
