
chrome.runtime.onInstalled.addListener(() => {
    // Set random background
    fetch(collectionUrl, {headers: {Authorization: `Client-ID ${unsplashAPIKey}`}})
        .then((response) => response.json())
        .then((data) => {
            chrome.storage.sync.set({
                wallpaper: `${data.urls.full}`,
                photographer: `${data.user.name}`,
                photo_location: `${data.location.name}`
            }, function () {});
        })
        .catch((err) => {
            console.log(err);
        });

    // Set location
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(({coords}) => {
            fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&appid=${weatherAPIKey}&units=metric`)
                .then((response) => response.json())
                .then((data) => {
                    chrome.storage.sync.set({
                        location: `${data.name}`,
                        temprature: `${data.main.temp}`,
                        weather: `${data.weather[0].main}`
                    }, function () {});
                });
        });
    } else {
        console.log('no geolocation');
    }
});

chrome.browserAction.onClicked.addListener((tab) => {
    // Set random background on action click, and open a new tab
    fetch(collectionUrl, {headers: {Authorization: `Client-ID ${unsplashAPIKey}`}})
        .then((response) => response.json())
        .then((data) => {
            chrome.storage.sync.set({
                wallpaper: `${data.urls.full}`,
                photographer: `${data.user.name}`,
                photo_location: `${data.location.name}`
            }, () => {chrome.tabs.create({url: 'newtab.html'});});
        })
        .catch((err) => {
            console.log(err);
        });
});