// JS/board.js
document.addEventListener('DOMContentLoaded', () => {
    loadPosts();
    const currentId = localStorage.getItem('userId');
    if (currentId) {
        const authorInput = document.getElementById('post-author');
        authorInput.value = currentId;
        authorInput.readOnly = true; // 로그인 시 본인 아이디 고정
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
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        alert("로그인을 먼저 해야 글을 쓸 수 있어!"); return;
    }
    const titleInput = document.getElementById('post-title');
    const authorInput = document.getElementById('post-author');

    if (!titleInput.value || !authorInput.value) {
        alert("빈칸을 다 채워줘! Very un-brat of you."); return;
    }
    if (titleInput.value.length > 100) {
        alert("100자 이하로만 적어줘! 너무 말이 많으면 un-brat 해."); return;
    }

    let posts = JSON.parse(localStorage.getItem('bratPosts')) || [];
    const today = new Date().toISOString().split('T')[0];
    posts.unshift({ id: 0, title: titleInput.value, author: authorInput.value, date: today });

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
    boardBody.innerHTML = '';

    posts.forEach((post, index) => {
        const isDefault = (post.id === 1 || post.id === 2);
        const isMyPost = post.author === currentUserId && !isDefault;
        const titleStyle = isMyPost ? "text-align: left; cursor: pointer; text-decoration: underline;" : "text-align: left;";
        const clickEvent = isMyPost ? `onclick="editPost(${index})"` : "";
        const editIcon = isMyPost ? " ✏️" : "";

        boardBody.innerHTML += `<tr><td>${post.id}</td><td style="${titleStyle}" ${clickEvent}>${post.title}${editIcon}</td><td>${post.author}</td><td>${post.date}</td></tr>`;
    });
}

function editPost(index) {
    let posts = JSON.parse(localStorage.getItem('bratPosts')) || [];
    const currentUserId = localStorage.getItem('userId');
    if (posts[index].author !== currentUserId) { alert("네 글이 아니면 고칠 수 없어!"); return; }

    const newTitle = prompt("뭐라고 고칠 거야? (100자 이내)", posts[index].title);
    if (newTitle === null) return;
    if (newTitle.trim() === "") { alert("내용을 비워둘 순 없어!"); return; }
    if (newTitle.length > 100) { alert("수정할 내용이 너무 길어! 100자까지만 가능해."); return; }

    posts[index].title = newTitle;
    localStorage.setItem('bratPosts', JSON.stringify(posts));
    renderTable(posts);
}

function deleteLastPost() {
    let posts = JSON.parse(localStorage.getItem('bratPosts')) || [];
    const currentUserId = localStorage.getItem('userId');
    const myLastPostIndex = posts.findIndex(post => post.author === currentUserId && post.id > 2);

    if (myLastPostIndex === -1) { alert("삭제할 수 있는 네 글이 없어! (기본 공지사항은 제외)"); return; }

    if (confirm("네가 쓴 최신 글을 지울 거야?")) {
        posts.splice(myLastPostIndex, 1);
        posts = reorderPosts(posts);
        localStorage.setItem('bratPosts', JSON.stringify(posts));
        renderTable(posts);
    }
}

function clearBoard() {
    const currentUserId = localStorage.getItem('userId');
    if (!currentUserId) return alert("로그인부터 해!");
    if (confirm("내가 쓴 글만 전부 지울 거야? (기본글은 유지돼!)")) {
        let posts = JSON.parse(localStorage.getItem('bratPosts')) || [];
        const filteredPosts = posts.filter(post => post.author !== currentUserId || post.id <= 2);
        const finalPosts = reorderPosts(filteredPosts);
        localStorage.setItem('bratPosts', JSON.stringify(finalPosts));
        renderTable(finalPosts);
    }
}