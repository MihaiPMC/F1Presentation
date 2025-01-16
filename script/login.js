document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const showRegister = document.getElementById('showRegister');
    const showLogin = document.getElementById('showLogin');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    showRegister.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    });

    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
    });

    async function hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hash = await crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(hash))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('registerUsername').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        hideError('registerUsernameError');
        hideError('registerEmailError');
        hideError('registerPasswordError');
        hideError('confirmPasswordError');

        if (username.length < 3) {
            showError('registerUsernameError');
            return;
        }

        if (!emailRegex.test(email)) {
            showError('registerEmailError');
            return;
        }

        if (password.length < 6) {
            showError('registerPasswordError');
            return;
        }

        if (password !== confirmPassword) {
            showError('confirmPasswordError');
            return;
        }

        const hashedPassword = await hashPassword(password);

        const users = JSON.parse(localStorage.getItem('users') || '[]');
        if (users.some(user => user.email === email || user.username === username)) {
            alert('Username or email already registered');
            return;
        }

        users.push({ username, email, password: hashedPassword });
        localStorage.setItem('users', JSON.stringify(users));
        alert('Registration successful! Please login.');
        
        registerForm.reset();
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const loginId = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        hideError('loginEmailError');
        hideError('loginPasswordError');

        const hashedPassword = await hashPassword(password);

        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => 
            (u.email === loginId || u.username === loginId) && u.password === hashedPassword
        );

        if (user) {
            localStorage.setItem('currentUser', user.username);
            window.location.href = 'index.html';
        } else {
            alert('Invalid credentials');
        }
    });

    function showError(elementId) {
        document.getElementById(elementId).style.display = 'block';
    }

    function hideError(elementId) {
        document.getElementById(elementId).style.display = 'none';
    }
});
