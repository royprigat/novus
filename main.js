
// Get wallpaper and set it to background
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

// Get location and weather details
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

// Get and set date
let date_info = new Date().toDateString().split(' ');
const day_name = date_info[0];
const month = date_info[1];
const day_num = date_info[2];
document.getElementById('date').innerHTML = `${day_name} ${day_num} ${month}`;

// chrome.bookmarks.onCreated.addListener((id, bookmark) => {
//     const title = bookmark.title; 
//     const url = bookmark.url;
//     alert(url);
// });