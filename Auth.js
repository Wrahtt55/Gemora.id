// Authentication Handling
document.getElementById('login-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Simple validation (in a real app, this would be server-side)
    if (username === 'reseller' && password === 'gemora123') {
        localStorage.setItem('isLoggedIn', 'true');
        document.getElementById('login-modal').style.display = 'none';
        checkAuthStatus();
        
        // If on jual-akun page, show the form
        if (window.location.pathname.includes('jual-akun')) {
            document.getElementById('auth-required').style.display = 'none';
            document.getElementById('upload-form').style.display = 'block';
        }
        
        alert('Login berhasil!');
    } else {
        alert('Username atau password salah!');
    }
});

// Check auth status on page load
function checkAuthStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    
    if (loginBtn && logoutBtn) {
        if (isLoggedIn) {
            loginBtn.style.display = 'none';
            logoutBtn.style.display = 'block';
        } else {
            loginBtn.style.display = 'block';
            logoutBtn.style.display = 'none';
        }
    }
}

// Initialize auth status check
document.addEventListener('DOMContentLoaded', checkAuthStatus);
