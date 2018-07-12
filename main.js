import { bookmarkElement } from './htmlVars.js';

let unsplashAPIKey;
let collectionUrl;
let locked = true;
let bookmarks_list;
let curr_bookmark_edit;

const storage = chrome.storage.sync;

// Get API Keys
storage.get(['unsplashAPIKey', 'collectionUrl'], ({unsplashAPIKey,collectionUrl}) => {
    unsplashAPIKey = unsplashAPIKey;
    collectionUrl = collectionUrl;
});

chrome.bookmarks.onCreated.addListener((id, bookmark) => {
    bookmarks_list.push(bookmark);
    addBookmark(bookmark);
});

// Set all current bookmarks
function populateBookmarks() {
    chrome.bookmarks.getTree((data) => {
        bookmarks_list = data[0].children[0].children;
        getAllBookmarks();
    });
};

// Get wallpaper and set it to background
function getNewBackground() {
    storage.get(['wallpaper', 'photographer', 'photographer_url', 'photo_location', 'photo_url'], ({
        wallpaper,
        photographer,
        photographer_url,
        photo_location,
        photo_url
    }) => {
        document.body.style.backgroundImage = `url('${wallpaper}')`;
        let container = document.getElementById('container');
        container.style.opacity = 0;
        setTimeout(() => {
            container.style.zIndex = -1;
        }, 700);
        const artist = document.getElementById('photographer');
        artist.innerHTML = `<a href=${photographer_url}>${photographer}</a>`;
        photo_location != undefined ? (document.getElementById('photo_loc').innerHTML = `<a href=${photo_url}>${photo_location}</a>`) : null;
    });
};

// Get location and weather details
function getWeather() {
    storage.get(['temprature', 'weather'], ({temprature,weather}) => {
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
    storage.get('init_date', ({init_date}) => {
        new_date !== init_date ? setNewBackground(new_date) : null;
    });
};

function setNewBackground(new_date) {
    fetch(collectionUrl, {
            headers: {
                Authorization: `Client-ID ${unsplashAPIKey}`
            }
        })
        .then((response) => response.json())
        .then((data) => {
            storage.set({
                wallpaper: `${data.urls.full}`,
                photographer: `${data.user.name}`,
                photographer_url: `${data.user.links.html}`,
                photo_location: `${data.location.name}`,
                photo_url: `${data.links.html}`,
                init_date: new_date
            }, () => {
                getNewBackground();
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

function getFavicon(url, id) {
    storage.get([id], (value) => {
        if (value[id]) {
            document.getElementById(id).querySelector('img').src = value[id];
        };
    });
    const svgs = ['facebook', 'github', 'google', 'invision', 'linkedin', 'twitter', 'youtube', 'spotify', 'medium'];
    const names = url.split('.');
    const found = names.find((name) => {
        return svgs.includes(name);
    });
    return (found ? `./img/${found}.svg` : './img/placehold.svg');
};

function addBookmark(bookmark) {
    let bookmarksElement = document.getElementById('bookmarks');
    const title = bookmark.title;
    const url = bookmark.url ? bookmark.url.split('/')[2] : null;
    const favicon = url != null ? getFavicon(url, bookmark.id) : './img/folder-2.svg';
    const bookmarkElem = bookmarkElement(bookmark.id, bookmark.url, favicon, title);
    bookmarksElement.appendChild(bookmarkElem);
};

function getAllBookmarks() {
    bookmarks_list.forEach((bookmark) => {
        addBookmark(bookmark);
    });
};

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

const lock_icon = document.getElementById('l-icon');
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
    const id = curr_bookmark_edit.id;
    const title = this.querySelector('input[name=title]').value;
    const img_url = this.querySelector('input[name=img-url]').value;
    title != '' ? curr_bookmark_edit.querySelector('.bookmark-title').innerHTML = title : null;
    img_url != '' ? curr_bookmark_edit.querySelector('img').src = `${img_url}` : null;
    if (title != '') {chrome.bookmarks.update(id, {title: `${title}`});};
    storage.set({[id]: img_url});
    this.reset();
    hideForm();
};

const edit_form = document.getElementById('edit-form');
edit_form.addEventListener('submit', handleSubmit);




var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-112154592-3']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();



populateBookmarks();
getNewBackground();
getWeather();
getNewDate();
checkNewDate();