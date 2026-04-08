// JS/navbar.js
document.addEventListener('DOMContentLoaded', () => {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    const navbarHTML = `
    <nav class="navbar">
        <div class="nav-grid">
            <div class="nav-left"></div> 
            <ul class="nav-links">
                <li><a href="./index.html">Home</a></li>
                <li><a href="./study.html">Study</a></li>
                <li><a href="./projects.html">Projects</a></li>
                <li><a href="./board.html">Board</a></li>
                ${isAdmin ? '<li><a href="./admin_users.html" style="color:#ff4d4d;">Users</a></li>' : ''}
            </ul>
            <div id="login-menu" class="nav-login"></div>
        </div>
    </nav>
    <style>
        .navbar { background-color: black; position: fixed; top: 0; left: 0; width: 100%; height: 60px; z-index: 1000; display: flex; align-items: center; }
        .nav-grid { width: 100%; display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; padding: 0 30px; }
        .nav-links { list-style: none; margin: 0; padding: 0; display: flex; }
        .nav-links li { margin: 0 25px; }
        .navbar a { color: white; text-decoration: none; font-size: 18px; transition: 0.3s; font-weight: bold; }
        .navbar a:hover { color: #8ace00; }
        .nav-login { display: flex; justify-content: flex-end; }
        .nav-login a { font-size: 16px; border: 1px solid #8ace00; padding: 5px 12px; border-radius: 4px; color: white; text-decoration: none; }
    </style>
    `;
    document.body.insertAdjacentHTML('afterbegin', navbarHTML);
    checkLoginStatus();
});

function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const loginMenu = document.getElementById('login-menu');
    if (isLoggedIn === 'true') {
        const userId = localStorage.getItem('userId');
        const isAdmin = localStorage.getItem('isAdmin') === 'true';
        const isSuper = localStorage.getItem('isSuperAdmin') === 'true';
        loginMenu.innerHTML = `<a href="#" onclick="logout()">${userId}${isSuper ? '(MASTER)' : (isAdmin ? '(ADMIN)' : '')} Logout</a>`;
    } else {
        loginMenu.innerHTML = `<a href="./login.html">Login</a>`;
    }
}

function logout() {
    if (confirm("로그아웃 할 거야?")) {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userId');
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('isSuperAdmin');
        location.href = "./index.html";
    }
}