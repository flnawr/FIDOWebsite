"use strict;"

/**
 * Return a string containing the current browser's name and version.
 */
function getBrowser()  {
    return navigator.appName.concat('/', navigator.appCodeName, ' ', navigator.appVersion);
}

/**
 * Send the needed data to the logger.
 */
window.isFingerprintClicked       = false;
window.isSuccessfulFingerprint    = false;
window.isSecurityDeviceClicked    = false;
window.isSuccessfulSecurityDevice = false;
function sendLog() {
    const logUrl = 'https://DOMAIN';
    const secret = 'uXEOtrrFboy4BLaQ9c12a9wCNac8EfhU';
    const workerID = document.getElementById('username').value;
    
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            document.getElementById('thankyou').className += ' show';
            var resultElem = document.createTextNode(xhr.responseText);
            document.getElementById('thankyou').appendChild(resultElem);
        }
    }
    xhr.open("POST", logUrl, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    const params = JSON.stringify({
        worker_id:                    workerID,
        is_fingerprint_clicked:       window.isFingerprintClicked.toString(),
        is_successful_fingerprint:    window.isSuccessfulFingerprint.toString(),
        is_securityDevice_clicked:    window.isSecurityDeviceClicked.toString(),
        is_successful_securitydevice: window.isSuccessfulSecurityDevice.toString(),
        platform:                     getBrowser(),
        secret:                       secret
    });
    xhr.send(params);
}
