
chrome.runtime.onInstalled.addListener(function () {
    // Set random background
    (() => {
        fetch('https://api.unsplash.com/photos/random?collections=2301297', {
                headers: {
                    Authorization: `Client-ID ${unsplashAPIKey}`
                }
            })
            .then((response) => response.json())
            .then((data) => {
                chrome.storage.sync.set({wallpaper: `${data.urls.full}`}, function () {})
            })
            .catch((err) => {
                console.log(err);
            })
    })();

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


    // https://source.unsplash.com/collection/1163637/1400x1000
    // https://api.unsplash.com/photos/random?collections=1922729?width=1400
    // { headers: {Authorization: `Client-ID ${unsplashAPIKey}`}}
    // const updateBackground = (weather) => {
    //     fetch('https://api.unsplash.com/photos/random?collections=1922729?width=1400?height=800', {
    //             headers: {
    //                 Authorization: `Client-ID ${unsplashAPIKey}`
    //             }
    //         })
    //         .then((response) => response.json())
    //         .then((data) => {
    //             document.body.style.backgroundImage = `url(${data.urls.full})`;
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //             // setDefaultBackground(weather);
    //         })
    // };

    // const getLocalWeather = (latitude, longitude) => {
    //     fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${weatherAPIKey}&units=imperial`)
    //         .then((response) => response.json())
    //         .then((data) => {
    //             console.log(data);
    //             mainText.innerText = `Weather in ${data.name} be like...`;
    //             updateBackground(data.weather[0].main);
    //         });
    // };

    // const getLocation = () => {
    //     if ("geolocation" in navigator) {
    //         navigator.geolocation.getCurrentPosition((position) => {
    //             getLocalWeather(position.coords.latitude, position.coords.longitude);
    //         });
    //     } else {
    //         console.log('no geolocation');
    //     }
    // };

    // getLocation();
});