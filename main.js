let changeColor = document.getElementById('changeColor');

chrome.storage.sync.get('color', function (data) {
    changeColor.style.backgroundColor = data.color;
    changeColor.setAttribute('value', data.color);
    console.log(data.color);
});

changeColor.onclick = function (element) {
    let color = element.target.value;
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {
        chrome.tabs.executeScript(
            tabs[0].id, {
                code: 'document.body.style.backgroundColor = "' + color + '";'
            });
    });
};

// const getLocation = () => {
//     if ("geolocation" in navigator) {
//         return navigator.geolocation.getCurrentPosition((position) => {
//             console.log(position);
//         });
//     } else {
//         console.log('no geolocation');
//         return;
//     }
// }

// getLocation();