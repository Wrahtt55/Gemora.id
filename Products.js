// Product Management
let currentPage = 1;
const productsPerPage = 10;
let allProducts = [];
let filteredProducts = [];

// Load products from JSON
function loadProducts() {
    fetch('data/products.json')
        .then(response => response.json())
        .then(products => {
            allProducts = products;
            filterAndSortProducts();
            
            // Load popular products
            loadPopularProducts();
        })
        .catch(error => {
            console.error('Error loading products:', error);
            document.getElementById('popular-products').innerHTML = '<p class="error-message">Gagal memuat produk populer.</p>';
            document.getElementById('regular-products').innerHTML = '<p class="error-message">Gagal memuat produk.</p>';
        });
}

// Load popular products
function loadPopularProducts() {
    const popularContainer = document.getElementById('popular-products');
    const popularProducts = allProducts.filter(product => product.populer).slice(0, 5);
    
    if (popularProducts.length === 0) {
        popularContainer.innerHTML = '<p class="no-products">Tidak ada produk populer saat ini.</p>';
        return;
    }
    
    popularContainer.innerHTML = '';
    popularProducts.forEach(product => {
        const productEl = createProductElement(product, true);
        popularContainer.appendChild(productEl);
    });
}

// Filter and sort products
function filterAndSortProducts() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const category = document.getElementById('game-category').value;
    const priceRange = document.getElementById('price-range').value;
    const sortBy = document.getElementById('sort-by').value;
    
    // Filter products
    filteredProducts = allProducts.filter(product => {
        // Skip popular products for regular listing
        if (product.populer) return false;
        
        // Search term
        if (searchTerm && !product.judul.toLowerCase().includes(searchTerm)) {
            return false;
        }
        
        // Category
        if (category && product.kategori !== category) {
            return false;
        }
        
        // Price range
        if (priceRange) {
            const [min, max] = priceRange.split('-').map(Number);
            if (max && (product.harga < min || product.harga > max)) {
                return false;
            }
            if (!max && product.harga < min) {
                return false;
            }
        }
        
        return true;
    });
    
    // Sort products
    switch (sortBy) {
        case 'termurah':
            filteredProducts.sort((a, b) => a.harga - b.harga);
            break;
        case 'termahal':
            filteredProducts.sort((a, b) => b.harga - a.harga);
            break;
        case 'terbaru':
        default:
            filteredProducts.sort((a, b) => b.id - a.id);
            break;
    }
    
    // Display products
    displayProducts();
}

// Display products with pagination
function displayProducts() {
    const regularContainer = document.getElementById('regular-products');
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    
    if (paginatedProducts.length === 0) {
        regularContainer.innerHTML = '<p class="no-products">Tidak ada produk yang sesuai dengan filter.</p>';
        document.getElementById('prev-page').disabled = true;
        document.getElementById('next-page').disabled = true;
        return;
    }
    
    regularContainer.innerHTML = '';
    paginatedProducts.forEach(product => {
        const productEl = createProductElement(product);
        regularContainer.appendChild(productEl);
    });
    
    // Update pagination buttons
    document.getElementById('prev-page').disabled = currentPage === 1;
    document.getElementById('next-page').disabled = endIndex >= filteredProducts.length;
    document.getElementById('page-info').textContent = `Halaman ${currentPage}`;
}

// Create product element
function createProductElement(product, isPopular = false) {
    const productEl = document.createElement('div');
    productEl.className = `product-card ${isPopular ? 'popular' : ''}`;
    productEl.innerHTML = `
        <div class="product-image" style="background-image: url('${product.gambar || 'images/default-product.jpg'}')"></div>
        <div class="product-content">
            <h3 class="product-title">${product.judul}</h3>
            <div class="product-price">Rp${parseInt(product.harga).toLocaleString('id-ID')}</div>
            <p class="product-desc">${product.deskripsi.substring(0, 100)}...</p>
            <div class="product-actions">
                <button class="btn-detail btn-detail-${product.id}">Detail</button>
            </div>
        </div>
    `;
    
    // Add click event to detail button
    productEl.querySelector(`.btn-detail-${product.id}`).addEventListener('click', function() {
        showProductDetail(product);
    });
    
    return productEl;
}

// Event listeners for filter controls
document.getElementById('search-input').addEventListener('input', filterAndSortProducts);
document.getElementById('search-btn').addEventListener('click', filterAndSortProducts);
document.getElementById('game-category').addEventListener('change', filterAndSortProducts);
document.getElementById('price-range').addEventListener('change', filterAndSortProducts);
document.getElementById('sort-by').addEventListener('change', filterAndSortProducts);

// Pagination controls
document.getElementById('prev-page')?.addEventListener('click', function() {
    if (currentPage > 1) {
        currentPage--;
        displayProducts();
    }
});

document.getElementById('next-page')?.addEventListener('click', function() {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        displayProducts();
    }
});

// Initialize products when page loads
if (document.getElementById('regular-products')) {
    document.addEventListener('DOMContentLoaded', loadProducts);
}
