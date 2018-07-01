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

chrome.storage.sync.get('wallpaper', ({wallpaper}) => {
    document.body.style.backgroundImage = `url('${wallpaper}')`;
    document.getElementById('main-overlay').style.opacity = 0;
    document.getElementById('main-overlay').style.zIndex = -1;
});