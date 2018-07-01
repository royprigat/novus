import {weatherAPIKey, unsplashAPIKey, collectionUrl} from './apiKeys';

chrome.runtime.onStartup.addListener(function () {

    // Set random background
    fetch(collectionUrl, {headers: {Authorization: `Client-ID ${unsplashAPIKey}`}})
        .then((response) => response.json())
        .then((data) => {
            chrome.storage.sync.set({
                wallpaper: `${data.urls.full}`
            }, function () {});
        })
        .catch((err) => {
            console.log(err);
        })

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

    // chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    //     chrome.declarativeContent.onPageChanged.addRules([{
    //         conditions: [new chrome.declarativeContent.PageStateMatcher({
    //             pageUrl: {
    //                 hostEquals: 'developer.chrome.com'
    //             },
    //         })],
    //         actions: [new chrome.declarativeContent.ShowPageAction()]
    //     }]);
    // })
});