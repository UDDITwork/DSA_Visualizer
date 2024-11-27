const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');
const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

registerForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;

    const users = JSON.parse(localStorage.getItem('users')) || {};
    if (users[email]) {
        alert('User already exists');
    } else {
        users[email] = { name, password };
        localStorage.setItem('users', JSON.stringify(users));
        alert('Account created successfully');
        container.classList.remove("active");
    }
});

loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const users = JSON.parse(localStorage.getItem('users')) || {};
    if (users[email] && users[email].password === password) {
        localStorage.setItem('currentUser', JSON.stringify(users[email]));
        // alert('Login successful');
        window.location.href = 'index.html';
    } else {
        alert('Invalid email or password');
    }
});
