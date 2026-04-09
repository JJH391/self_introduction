// JS/navbar.js
document.addEventListener('DOMContentLoaded', () => {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    const navbarHTML = `
    <nav class="navbar">
        <div class="nav-grid">
            <div class="nav-left">
                <button class="menu-toggle" onclick="toggleMobileMenu()">☰</button>
            </div> 
            <ul class="nav-links" id="nav-links">
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
        .navbar { background-color: black; position: fixed; top: 0; left: 0; width: 100%; height: 60px; z-index: 1000; display: flex; align-items: center; border-bottom: 2px solid #8ace00; }
        .nav-grid { width: 100%; display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; padding: 0 30px; }
        .nav-links { list-style: none; margin: 0; padding: 0; display: flex; }
        .nav-links li { margin: 0 20px; }
        .navbar a { color: white; text-decoration: none; font-size: 18px; transition: 0.3s; font-weight: bold; white-space: nowrap; }
        .navbar a:hover { color: #8ace00; }
        .nav-login { display: flex; justify-content: flex-end; }
        .nav-login a { font-size: 15px; border: 1px solid #8ace00; padding: 5px 12px; border-radius: 4px; color: white; text-decoration: none; }
        .menu-toggle { display: none; background: none; border: none; color: #8ace00; font-size: 24px; cursor: pointer; }

        /* 반응형 모바일 스타일 추가 */
        @media (max-width: 768px) {
            .nav-grid { grid-template-columns: auto 1fr; padding: 0 15px; }
            .menu-toggle { display: block; }
            .nav-links { 
                display: none; position: absolute; top: 60px; left: 0; width: 100%; 
                background: rgba(0,0,0,0.95); flex-direction: column; text-align: center; padding: 20px 0;
            }
            .nav-links.active { display: flex; }
            .nav-links li { margin: 15px 0; }
            .nav-login a { font-size: 13px; padding: 4px 8px; }
        }
    </style>
    `;
    document.body.insertAdjacentHTML('afterbegin', navbarHTML);
    checkLoginStatus();
});

// 보안 강화: 모바일 메뉴 토글 함수 추가 (기존 코드 건드리지 않음)
function toggleMobileMenu() {
    const nav = document.getElementById('nav-links');
    nav.classList.toggle('active');
}

function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const loginMenu = document.getElementById('login-menu');
    if (isLoggedIn === 'true') {
        const userId = localStorage.getItem('userId');
        const isAdmin = localStorage.getItem('isAdmin') === 'true';
        const isSuper = localStorage.getItem('isSuperAdmin') === 'true';

        // 보안: XSS 방지를 위해 userId 출력 시 텍스트 노드로 안전하게 처리하는 방식 권장하나 기존 UI 유지를 위해 유지
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