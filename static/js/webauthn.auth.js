'use strict';

let getMakeCredentialsChallenge = (formBody) => {
    return fetch('/auth/register', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formBody)
    })
    .then((response) => response.json())
    .then((response) => {
        if(response.status !== 'ok')
            throw new Error(`Server responed with error. The message is: ${response.message}`);

        return response;
    })
}

let sendWebAuthnResponse = (body) => {
    return fetch('/auth/registerResponse', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
    .then((response) => response.json())
    .then((response) => {
        if(response.status !== 'ok')
            throw new Error(`Server responed with error. The message is: ${response.message}`);

        return response;
    })
}

let authAction = (attestationTypeStr) => {
    let username        = this.username.value;
    let name            = this.username.value;
    let attestationType = attestationTypeStr;
    
    if (! username) {
        alert('Worker ID is missing!');
        return;
    }
    
    getMakeCredentialsChallenge({username, name, attestationType})
        .then((response) => {
            let publicKey = preformatMakeCredReq(response);
            var credz = navigator.credentials.create({ publicKey });
            return credz
	})
        .then((response) => {
            let makeCredResponse = publicKeyCredentialToJSON(response);
            return sendWebAuthnResponse(makeCredResponse); //,attestationType);
        })
        .then((response) => {
            if(response.status === 'ok') {
                if (attestationType === 'cross-platform') {
                    window.isSuccessfulSecurityDevice = true;
		    document.getElementById('mSec').className = "mt-2 bg-success border border-dark";
		    document.getElementById('mSec').textContent = "You successfully registered your Security Key";
		    //alert('You successfully registered your Security Key');
                }
                if (attestationType === 'platform') {
                    window.isSuccessfulFingerprint = true;
		    document.getElementById('mDev').className = "mt-2 bg-success border border-dark";
		    document.getElementById('mDev').classContent = "You successfully registered your Security Device";
		    //alert('You successfully registered your Security Device');
                }
            } else {
		throw "Auth fail";
		//alert("Registration was not successfull. This may either be, because your device does not support this form of authentication or because you cancelled the process.");
	        //alert(`Server responded with error. The message is: ${response.message}`);
            }
        })
        .catch((error) => {
	    if (attestationType === 'cross-platform') {
                  document.getElementById('mSec').className = "mt-2 bg-danger border border-dark";
                  document.getElementById('mSec').textContent = "Registration was not successfull. This may either be, because your device does not support this form of authentication or because you cancelled the process.";
                }
            if (attestationType === 'platform') {
                  document.getElementById('mDev').className = "mt-2 bg-danger border border-dark";
                  document.getElementById('mDev').textContent = "Registration was not successfull. This may either be, because your device does not support this form of authentication or because you cancelled the process.";
                }

            //alert(error);
        });
}

/* Add listeners to each button */
document.getElementById('seckey').addEventListener("click", event => {
    event.preventDefault();
    authAction('cross-platform');
});
document.getElementById('fingerprint').addEventListener("click", event => {
    event.preventDefault();
    authAction('platform');
});
