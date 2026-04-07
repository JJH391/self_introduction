// JS/navbar.js
document.addEventListener('DOMContentLoaded', () => {
    const navbarHTML = `
    <nav class="navbar">
        <div class="nav-grid">
            <div class="nav-left"></div> 
            <ul class="nav-links">
                <li><a href="./index.html">Home</a></li>
                <li><a href="#">Study</a></li>
                <li><a href="./projects.html">Projects</a></li>
                <li><a href="./board.html">Board</a></li>
            </ul>
            <div class="nav-right"></div> </div>
    </nav>
    <style>
        .navbar { background-color: black; position: fixed; top: 0; left: 0; width: 100%; height: 60px; z-index: 1000; display: flex; align-items: center; }
        .nav-grid { width: 100%; display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; padding: 0 30px; }
        .nav-links { list-style: none; margin: 0; padding: 0; display: flex; }
        .nav-links li { margin: 0 25px; }
        .navbar a { color: white; text-decoration: none; font-size: 18px; transition: 0.3s; font-weight: bold; }
        .navbar a:hover { color: #8ace00; }
    </style>
    `;
    document.body.insertAdjacentHTML('afterbegin', navbarHTML);
});