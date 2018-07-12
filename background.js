

chrome.runtime.onInstalled.addListener(() => {
     
    // Store API Keys
    chrome.storage.sync.set({
        weatherAPIKey: weatherAPIKey,
        unsplashAPIKey: unsplashAPIKey,
        collectionURL: collectionURL,
        googleAPIKey: googleAPIKey
    }, function () {});
    
    // Set random background
    fetch(collectionURL, {headers: {Authorization: `Client-ID ${unsplashAPIKey}`}})
        .then((response) => response.json())
        .then((data) => {
            const init_date = new Date().toDateString();
            chrome.storage.sync.set({
                wallpaper: `${data.urls.full}`,
                photographer: `${data.user.name}`,
                photographer_url: `${data.user.links.html}`,
                photo_location: `${data.location.name}`,
                photo_url: `${data.links.html}`,
                init_date: `${init_date}`
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
    } else {console.log('no geolocation');}

});