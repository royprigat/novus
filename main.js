let unsplashAPIKey;
let collectionUrl;
let locked = true;
let bookmarks_list;
let curr_bookmark_edit;

// Get API Keys
chrome.storage.sync.get(['unsplashAPIKey', 'collectionUrl'], ({unsplashAPIKey,collectionUrl}) => {
    unsplashAPIKey = unsplashAPIKey;
    collectionUrl = collectionUrl;
});

// Set all current bookmarks
function populateBookmarks() {
    chrome.bookmarks.getTree((data) => {
        bookmarks_list = data[0].children[0].children;
        getAllBookmarks();
    });
};

populateBookmarks();

// Get wallpaper and set it to background
function getNewBackground() {
    chrome.storage.sync.get(['wallpaper', 'photographer', 'photo_location'], ({
        wallpaper,
        photographer,
        photo_location
    }) => {
        document.body.style.backgroundImage = `url('${wallpaper}')`;
        let container = document.getElementById('container');
        container.style.opacity = 0;
        setTimeout(() => {
            container.style.zIndex = -1;
        }, 700);
        document.getElementById('photographer').innerHTML = photographer;
        photo_location != undefined ? (document.getElementById('photo_loc').innerHTML = photo_location) : null;
    });
};

// Get location and weather details
function getWeather() {
    chrome.storage.sync.get(['temprature', 'weather'], ({
        temprature,
        weather
    }) => {
        document.getElementById('temp').innerHTML = Math.round(temprature) + " &#8451";
        let w_icon = document.getElementById('w-icon');
        if (weather === 'Clear') {
            w_icon.src = './img/sun.svg';
        } else if (weather === 'Clouds') {
            w_icon.src = './img/clouds.svg';
        } else if (weather === 'Rain') {
            w_icon.src = './img/rain.svg';
        } else {
            w_icon.src = './img/partial_clouds.svg';
        }
    });
};

// Get and set date
function getNewDate() {
    const curr_date = new Date().toDateString().split(' ');
    const day_name = curr_date[0];
    const month = curr_date[1];
    const day_num = curr_date[2];
    document.getElementById('date').innerHTML = `${day_name} ${day_num} ${month}`;
};

// Check if date changed and set new background if it did
function checkNewDate() {
    const new_date = new Date().toDateString();
    chrome.storage.sync.get('init_date', ({
        init_date
    }) => {
        new_date !== init_date ? setNewBackground() : null;
    });
};

function setNewBackground() {
    fetch(collectionUrl, {
            headers: {
                Authorization: `Client-ID ${unsplashAPIKey}`
            }
        })
        .then((response) => response.json())
        .then((data) => {
            chrome.storage.sync.set({
                wallpaper: `${data.urls.full}`,
                photographer: `${data.user.name}`,
                photo_location: `${data.location.name}`,
                init_date: new_date
            }, () => {
                getNewBackground()
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

function getFavicon(url) {
    const re = /www\./;
    const temp_name = url.replace(re, '');
    const final_name = temp_name.slice(0, temp_name.indexOf('.'));
    const svgs = ['facebook', 'github', 'google', 'invision', 'linkedin', 'twitter', 'youtube', 'spotify'];
    if (svgs.includes(final_name)) {
        return `./img/${final_name}.svg`;
    };
    return './img/placehold.svg';
};

function addBookmark(bookmark) {
    let bookmarksElement = document.getElementById('bookmarks');
    const title = bookmark.title;
    const url = bookmark.url ? bookmark.url.split('/')[2] : null;
    const favicon = url != null ? getFavicon(url) : './img/placehold.svg';
    const bookmarkUI = document.createElement("div");
    bookmarkUI.setAttribute('id', bookmark.id);
    bookmarkUI.classList.add("bookmark");
    bookmarkUI.innerHTML = 
    `<a class="bookmark-link" href=${bookmark.url}>
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
    bookmarksElement.appendChild(bookmarkUI);
};

function getAllBookmarks() {
    bookmarks_list.forEach((bookmark) => {
        addBookmark(bookmark);
    });
};

getNewBackground();
getWeather();
getNewDate();
checkNewDate();

chrome.bookmarks.onCreated.addListener((id, bookmark) => {
    bookmarks_list.push(bookmark);
    addBookmark(bookmark);
});

function lock(e) {
    e.src = './img/lock-solid.svg';
    e.style.width = '20px';
    const bookmarks = document.querySelectorAll('.bookmark-link');
    bookmarks.forEach((bookmark) => {
        bookmark.classList.remove('disabled');
    });
    const action_buttons = document.querySelectorAll('.actions');
    action_buttons.forEach((btn) => {
        btn.style.opacity = '0';
    });
    locked = true;
};

function unlock(e) {
    e.src = './img/lock-open-solid.svg';
    e.style.width = '26px';
    const bookmarks = document.querySelectorAll('.bookmark-link');
    bookmarks.forEach((bookmark) => {
        bookmark.classList.add('disabled');
    });
    const action_buttons = document.querySelectorAll('.actions');
    action_buttons.forEach((btn) => {
        btn.style.opacity = '1';
    });
    locked = false;
};

function toggleLock() {
    locked ? unlock(this) : lock(this);
};

const lock_icon = document.getElementById('lock');
lock_icon.addEventListener('click', toggleLock);

function handleDelete(target) {
    const bookmark = target.parentElement;
    const bookmark_id = bookmark.id;
    chrome.bookmarks.remove(bookmark_id);
    bookmark.remove();
};

function handleEdit(target) {
    const edit_modal = document.getElementById('id01');
    edit_modal.style.display = 'block';
    const edit_form = document.getElementById('edit-form');
    curr_bookmark_edit = target.parentElement.parentElement;
    console.log(curr_bookmark_edit);
};

function handleChange(e) {
    if (this !== e.target) {
        if (e.target.classList.value == 'delete-btn') {
            handleDelete(e.target.parentElement);
        };
        if (e.target.classList.value == 'edit-btn') {
            handleEdit(e.target);
        }; 
    };
};

const bookmarks = document.getElementById('bookmarks');
bookmarks.addEventListener('click', handleChange);

function hideForm() {
    const edit_form = document.getElementById('id01');
    edit_form.style.display = "none";
};

const cancel_btn = document.querySelector('.cancelbtn');
cancel_btn.addEventListener('click', hideForm);
window.onclick = function(event) {
    const edit_form = document.getElementById('id01');
    if (event.target == edit_form) {
        edit_form.style.display = "none";
    }
};

function handleSubmit(e) {
    e.preventDefault();
    const title = this.querySelector('input[name=title]').value;
    const url = this.querySelector('input[name=url]').value;
    const img_url = this.querySelector('input[name=img-url]').value;
    curr_bookmark_edit.querySelector('img').src = `${img_url}`;
    this.reset();
    hideForm();
};

const edit_form = document.getElementById('edit-form');
edit_form.addEventListener('submit', handleSubmit);
