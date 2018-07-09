export function bookmarkElement(id, url, favicon, title) {
    const bookmarkUI = document.createElement("div");
    bookmarkUI.setAttribute('id', id);
    bookmarkUI.classList.add("bookmark");
    bookmarkUI.innerHTML = 
    `<a class="bookmark-link" href=${url}>
        <div class="bookmark-content">
            <img src="${favicon}"/>
            <div class="bookmark-title">${title}</div>
        </div>
    </a>
    <div class="actions">
        <img src='./img/edit.svg' class="edit-btn">
        <img src='./img/delete.svg' class="delete-btn">
    </div>
    `;
    return bookmarkUI;
};