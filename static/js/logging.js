"use strict;"

/**
 * Return a string containing the current browser's name,version and the platform.
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
    const logUrl = 'https://fido2-thesis.cispa.saarland/logger.php';
    const secret = 'uXEOtrrFboy4BLaQ9c12a9wCNac8Efhu';
    const workerID = document.getElementById('username').value;
    
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            document.getElementById('thankyou').className += ' show';
            var resultElem = document.createTextNode(xhr.responseText);
	    //resultElem.innerHtml = xhr.responseText;
            document.getElementById('code').appendChild(resultElem);
	    if (xhr.responseText.includes('Error:')){
            document.getElementById('thankyou').className = 'alert alert-danger fade show';
	    var elemtmp = document.getElementById('surveylink');
	    elemtmp.parentNode.removeChild(elemtmp);
	    }
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
        secret:                       secret,
	hitId:			      findGetParameter('hitId')
    });
    xhr.send(params);
    var element = document.getElementById('fin');
    element.parentNode.removeChild(element);
   //document.getElementById('fin').disable=true;
}

function showfinish() {
    let name            = this.username.value;

   if (window.isFingerprintClicked && window.isSecurityDeviceClicked && name) { 
	document.getElementById('finish').style.visibility = 'visible';
  }
}


function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    var items = location.search.substr(1).split("&");
    for (var index = 0; index < items.length; index++) {
        tmp = items[index].split("=");
        if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    }
    return result;
}
