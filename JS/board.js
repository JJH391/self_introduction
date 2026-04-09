// JS/board.js
document.addEventListener('DOMContentLoaded', () => {
    // 보안: 비정상적인 접근 차단 (예시: 로그인 없이 글쓰기 시도 방지 로직 보강)
    loadPosts();
    const currentId = localStorage.getItem('userId');
    if (currentId) {
        const authorInput = document.getElementById('post-author');
        if (authorInput) {
            authorInput.value = currentId;
            authorInput.readOnly = true;
        }
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

    // 보안: HTML 태그 주입 방지 (간이 Sanitizer)
    const sanitizedTitle = titleInput.value.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    if (sanitizedTitle.length > 100) return alert("100자 이내!");

    let posts = JSON.parse(localStorage.getItem('bratPosts')) || [];
    const authorName = localStorage.getItem('userId');
    const finalAuthor = (localStorage.getItem('isAdmin') === 'true') ? `${authorName}(ADMIN)` : authorName;

    posts.unshift({ id: 0, title: sanitizedTitle, author: finalAuthor, date: new Date().toISOString().split('T')[0] });
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
    if (!boardBody) return;
    boardBody.innerHTML = '';

    posts.forEach((post, index) => {
        const isDefault = (post.id === 1 || post.id === 2);
        const pureAuthor = post.author.replace("(ADMIN)", "");
        const isMyPost = pureAuthor === currentUserId && !isDefault;

        const titleStyle = isMyPost ? "text-align: left; cursor: pointer; text-decoration: underline;" : "text-align: left;";
        const clickEvent = isMyPost ? `onclick="editPost(${index})"` : "";
        const editIcon = isMyPost ? " ✏️" : "";
        const adminBtn = (isAdmin && !isDefault) ? `<button onclick="adminDel(${index})" style="background:red; color:white; border:none; margin-left:10px; cursor:pointer; padding: 2px 6px; border-radius:3px;">X</button>` : "";

        // 보안: 관리자 사칭 방지를 위한 색상 처리 유지
        const authorDisplay = post.author.includes("(ADMIN)") ? `<span style="color:red;">${post.author}</span>` : post.author;

        boardBody.innerHTML += `<tr><td>${post.id}</td><td style="${titleStyle}" ${clickEvent}>${post.title}${editIcon}${adminBtn}</td><td>${authorDisplay}</td><td>${post.date}</td></tr>`;
    });
}

// 나머지 기능 (adminDel, editPost, deleteLastPost, clearBoard)은 기존 로직을 완벽히 유지합니다.
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
        posts[index].title = nt.replace(/</g, "&lt;").replace(/>/g, "&gt;");
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