// JS/board.js
document.addEventListener('DOMContentLoaded', () => {
    loadPosts();
    // 로그인 체크 및 readOnly 기능 잠시 제거
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
    // 로그인 체크 기능 제거
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
    authorInput.value = ''; // 작성자 칸도 비워줌
    renderTable(posts);
}

function reorderPosts(posts) {
    const reversed = posts.slice().reverse();
    const reordered = reversed.map((post, index) => ({ ...post, id: index + 1 }));
    return reordered.reverse();
}

function renderTable(posts) {
    const boardBody = document.getElementById('board-body');
    boardBody.innerHTML = '';

    posts.forEach((post, index) => {
        const isDefault = (post.id === 1 || post.id === 2) && (post.author === "정지훈" || post.author === "익명");
        
        // 누구나 수정할 수 있도록 조건 변경
        const titleStyle = isDefault ? "text-align: left;" : "text-align: left; cursor: pointer; text-decoration: underline;";
        const clickEvent = isDefault ? "" : `onclick="editPost(${index})"`;
        const editIcon = isDefault ? "" : " ✏️";

        boardBody.innerHTML += `<tr><td>${post.id}</td><td style="${titleStyle}" ${clickEvent}>${post.title}${editIcon}</td><td>${post.author}</td><td>${post.date}</td></tr>`;
    });
}

function editPost(index) {
    let posts = JSON.parse(localStorage.getItem('bratPosts')) || [];
    // 본인 확인 로직 제거
    
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
    // 내 글 찾기 로직 대신, 단순히 '맨 위의 일반 글'을 삭제함
    const lastPostIndex = posts.findIndex(post => post.id > 2);

    if (lastPostIndex === -1) { alert("삭제할 수 있는 글이 없어! (기본 공지사항은 제외)"); return; }

    if (confirm("가장 최근에 작성된 글을 지울 거야?")) {
        posts.splice(lastPostIndex, 1);
        posts = reorderPosts(posts);
        localStorage.setItem('bratPosts', JSON.stringify(posts));
        renderTable(posts);
    }
}

function clearBoard() {
    if (confirm("일반 글을 전부 지울 거야? (기본글은 유지돼!)")) {
        let posts = JSON.parse(localStorage.getItem('bratPosts')) || [];
        const filteredPosts = posts.filter(post => post.id <= 2);
        const finalPosts = reorderPosts(filteredPosts);
        localStorage.setItem('bratPosts', JSON.stringify(finalPosts));
        renderTable(finalPosts);
    }
}