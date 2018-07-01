// let changeColor = document.getElementById('changeColor');

// chrome.storage.sync.get('color', function (data) {
//     changeColor.style.backgroundColor = data.color;
//     changeColor.setAttribute('value', data.color);
//     console.log(data.color);
// });

// changeColor.onclick = function (element) {
//     let color = element.target.value;
//     chrome.tabs.query({
//         active: true,
//         currentWindow: true
//     }, function (tabs) {
//         chrome.tabs.executeScript(
//             tabs[0].id, {
//                 code: 'document.body.style.backgroundColor = "' + color + '";'
//             });
//     });
// };

// Get wallpaper and set it to background
chrome.storage.sync.get('wallpaper', ({wallpaper}) => {
    document.body.style.backgroundImage = `url('${wallpaper}')`;
    let container = document.getElementById('container');
    container.style.opacity = 0;
    setTimeout(() => {
        container.style.zIndex = -1;
    }, 700);
});

// Get location and weather details
chrome.storage.sync.get(['temprature', 'weather'], ({temprature, weather}) => {
    document.getElementById('temp').innerHTML = Math.round(temprature) + "&#8451";
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

    console.log(weather);
});

let date = new Date().toDateString();
document.getElementById('date').innerHTML = `${date}`;