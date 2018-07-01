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
    document.getElementById('container').style.opacity = 0;
    document.getElementById('container').style.zIndex = -1;
});

// Get location and weather details
chrome.storage.sync.get(['location', 'temprature', 'weather'], ({location, temprature, weather}) => {
    document.getElementById('location').innerHTML = location;
    document.getElementById('temp').innerHTML = Math.round(temprature) + "&#8451";
    document.getElementById('w-icon').src = './img/sun.svg';
    console.log(weather);
});

let date = new Date().toDateString();
document.getElementById('date').innerHTML = `${date}`;