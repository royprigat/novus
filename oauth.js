
window.onload = function() {
      chrome.identity.getAuthToken({interactive: true}, function(token) {
        let init = {
          method: 'GET',
          async: true,
          headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json'
          },
          'contentType': 'json'
        };

        // Fetch and store all contacts information
        fetch(`https://people.googleapis.com/v1/contactGroups/all?maxMembers=20&key=${googleAPIKey}`,init)
            .then((response) => response.json())
            .then((data) => {
                chrome.storage.sync.set({
                    contacts: `${data.memberResourceNames}`
                }, function () {});
              data.memberResourceNames.forEach((member) => {
                fetch('https://people.googleapis.com/v1/' + member + `?personFields=names,phoneNumbers,emailAddresses&key=${googleAPIKey}`, init)
                .then((response) => response.json())
                .then((data) => {
                    // console.log(data);
                });
        })});

        // Fetch gmail unread messages count
        fetch(`https://www.googleapis.com/gmail/v1/users/me/messages?q=is:unread`,init)
            .then((response) => response.json())
            .then((data) => {
                let mail_icon = document.getElementById("m-icon");
                let notifs = document.getElementById("notifs");
                // data.resultSizeEstimate > 0 ? (mail_icon.src = './img/mail-alert.svg') : mail_icon.src = './img/mail.svg';
                data.resultSizeEstimate > 0 ? (notifs.innerHTML = data.resultSizeEstimate) : null;
            });

      });
  };