// JS/board.js
document.addEventListener('DOMContentLoaded', () => {
    loadPosts();
    const currentId = localStorage.getItem('userId');
    if (currentId) {
        const authorInput = document.getElementById('post-author');
        authorInput.value = currentId;
        authorInput.readOnly = true;
    }
});

function loadPosts() {
    const savedPosts = JSON.parse(localStorage.getItem('bratPosts')) || [];
    if (savedPosts.length === 0) {
        const defaultPosts = [
            { id: 2, title: "brat 스타일 너무 힙하네요.", author: "익명", date: "2026-03-27" },
            { id: 1, title: "지훈이의 웹사이트에 오신 것을 환영합니다!", author: "정지훈", date: "2026-03-27" }
        ];
        localStorage.setItem('bratPosts', JSON.stringify(defaultPosts));
        renderTable(defaultPosts);
    } else { renderTable(savedPosts); }
}

function addPost() {
    if (localStorage.getItem('isLoggedIn') !== 'true') return alert("로그인 해!");
    const titleInput = document.getElementById('post-title');
    if (!titleInput.value) return alert("제목을 써줘!");
    if (titleInput.value.length > 100) return alert("100자 이내!");

    let posts = JSON.parse(localStorage.getItem('bratPosts')) || [];
    const authorName = localStorage.getItem('userId');
    const finalAuthor = (localStorage.getItem('isAdmin') === 'true') ? `${authorName}(ADMIN)` : authorName;

    posts.unshift({ id: 0, title: titleInput.value, author: finalAuthor, date: new Date().toISOString().split('T')[0] });
    posts = reorderPosts(posts);
    localStorage.setItem('bratPosts', JSON.stringify(posts));
    titleInput.value = '';
    renderTable(posts);
}

function reorderPosts(posts) {
    const reversed = posts.slice().reverse();
    const reordered = reversed.map((post, index) => ({ ...post, id: index + 1 }));
    return reordered.reverse();
}

function renderTable(posts) {
    const boardBody = document.getElementById('board-body');
    const currentUserId = localStorage.getItem('userId');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    boardBody.innerHTML = '';

    posts.forEach((post, index) => {
        const isDefault = (post.id === 1 || post.id === 2);
        const pureAuthor = post.author.replace("(ADMIN)", "");
        const isMyPost = pureAuthor === currentUserId && !isDefault;

        const titleStyle = isMyPost ? "text-align: left; cursor: pointer; text-decoration: underline;" : "text-align: left;";
        const clickEvent = isMyPost ? `onclick="editPost(${index})"` : "";
        const editIcon = isMyPost ? " ✏️" : "";
        const adminBtn = (isAdmin && !isDefault) ? `<button onclick="adminDel(${index})" style="background:red; color:white; border:none; margin-left:10px; cursor:pointer; padding: 2px 6px;">X</button>` : "";
        const authorDisplay = post.author.includes("(ADMIN)") ? `<span style="color:red;">${post.author}</span>` : post.author;

        boardBody.innerHTML += `<tr><td>${post.id}</td><td style="${titleStyle}" ${clickEvent}>${post.title}${editIcon}${adminBtn}</td><td>${authorDisplay}</td><td>${post.date}</td></tr>`;
    });
}

function adminDel(index) {
    if (confirm("강제 삭제할 거야?")) {
        let posts = JSON.parse(localStorage.getItem('bratPosts')) || [];
        posts.splice(index, 1);
        const newPosts = reorderPosts(posts);
        localStorage.setItem('bratPosts', JSON.stringify(newPosts));
        renderTable(newPosts);
    }
}

function editPost(index) {
    let posts = JSON.parse(localStorage.getItem('bratPosts')) || [];
    const pureAuthor = posts[index].author.replace("(ADMIN)", "");
    if (pureAuthor !== localStorage.getItem('userId')) return alert("네 글 아니야!");
    const nt = prompt("수정 내용", posts[index].title);
    if (nt && nt.length <= 100) {
        posts[index].title = nt;
        localStorage.setItem('bratPosts', JSON.stringify(posts));
        renderTable(posts);
    }
}

function deleteLastPost() {
    let posts = JSON.parse(localStorage.getItem('bratPosts')) || [];
    const myIdx = posts.findIndex(p => p.author.replace("(ADMIN)", "") === localStorage.getItem('userId') && p.id > 2);
    if (myIdx !== -1 && confirm("삭제?")) {
        posts.splice(myIdx, 1);
        const newPosts = reorderPosts(posts);
        localStorage.setItem('bratPosts', JSON.stringify(newPosts));
        renderTable(newPosts);
    }
}

function clearBoard() {
    if (confirm("내 글 전부 삭제?")) {
        let posts = JSON.parse(localStorage.getItem('bratPosts')) || [];
        const currentUserId = localStorage.getItem('userId');
        const filtered = posts.filter(p => p.author.replace("(ADMIN)", "") !== currentUserId || p.id <= 2);
        const newPosts = reorderPosts(filtered);
        localStorage.setItem('bratPosts', JSON.stringify(newPosts));
        renderTable(newPosts);
    }
}