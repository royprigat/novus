
// Get wallpaper and set it to background
function getNewBackground () {
    chrome.storage.sync.get(['wallpaper', 'photographer', 'photo_location'], ({wallpaper, photographer, photo_location}) => {
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
    chrome.storage.sync.get(['temprature', 'weather'], ({temprature, weather}) => {
        document.getElementById('temp').innerHTML = Math.round(temprature) + " &#8451";
        let w_icon = document.getElementById('w-icon');
        if ( weather === 'Clear' ) {
            w_icon.src = './img/sun.svg';
        } else if( weather === 'Clouds' ) {
            w_icon.src = './img/clouds.svg';
        } else if( weather === 'Rain' ) {
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
}

// Check if date changed and set new background if it did
function checkNewDate() {
    const new_date = new Date().toDateString();
    chrome.storage.sync.get('init_date', ({init_date}) => {
        new_date !== init_date ? setNewBackground() : null;
    });
};

function setNewBackground() {
    fetch(collectionUrl, {headers: {Authorization: `Client-ID ${unsplashAPIKey}`}})
        .then((response) => response.json())
        .then((data) => {
            chrome.storage.sync.set({
                wallpaper: `${data.urls.full}`,
                photographer: `${data.user.name}`,
                photo_location: `${data.location.name}`,
                init_date: new_date
            }, () => {getNewBackground()});
        })
        .catch((err) => {
            console.log(err);
        });
};

function getAllBookmarks() {
    chrome.storage.sync.get('bookmarks', ({bookmarks}) => {
        let bookmarksElement = document.getElementById('bookmarks');
        bookmarks[0].children.forEach((bookmark) => {
            const title = bookmark.title;
            const url = bookmark.url;
            const favicon = `https://icons.duckduckgo.com/ip2/${url.split('/')[2]}.ico`;
            const bookmarkUI = document.createElement("a");
            bookmarkUI.classList.add("bookmark");
            bookmarkUI.href = `${url}`;
            bookmarkUI.innerHTML = `<div class="bookmark-content"><img src="${favicon}"/><div class="bookmark-title">${title}</div></div>`;
            bookmarksElement.appendChild(bookmarkUI);
        });
    });
};


getNewBackground();
getWeather();
getNewDate();

checkNewDate();

getAllBookmarks();

// chrome.bookmarks.onCreated.addListener((id, bookmark) => {
//     const title = bookmark.title; 
//     const url = bookmark.url;
//     alert(url);
// });