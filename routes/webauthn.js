const express      = require('express');
const utils        = require('../utils');
const config       = require('../config.json');
const { Fido2Lib } = require("fido2-library");
const base64url    = require('base64url');
const host         = config.origin;
const router       = express.Router();

var f2lp = new Fido2Lib({
    timeout: 42,
    rpId: host,
    rpName: "ACME",
    rpIcon: 'https://' + host + '/img/favicon.ico',
    challengeSize: 128,
    attestation: "none",
    cryptoParams: [-7, -8, -35, -36, -37, -38, -39, -257, -258, -259],
    authenticatorAttachment: "platform",
    authenticatorRequireResidentKey: false,
    authenticatorUserVerification: "preferred"
});

var f2lcp = new Fido2Lib({
    timeout: 42,
    rpId: host,
    rpName: "ACME",
    rpIcon: 'https://' + host + '/img/favicon.ico',
    challengeSize: 128,
    attestation: "none",
    cryptoParams: [-7, -8, -35, -36, -37, -38, -39, -257, -258, -259],
    authenticatorAttachment: "cross-platform",
    authenticatorRequireResidentKey: false,
    authenticatorUserVerification: "preferred"
});

router.post('/register', async (request, response) => {
    // Validate if all parameters were set
    if (! request.body || ! request.body.username || ! request.body.attestationType) {
        response.json({
            'status': 'failed',
            'message': 'Response missing one or more fields!'
        });
        return;
    }

    let username = request.body.username;
    let attestationType = request.body.attestationType;
    
    // Get options
    if (attestationType === 'platform') {
        var registrationOptions = await f2lp.attestationOptions();
    } else if (attestationType === 'cross-platform') {
        var registrationOptions = await f2lcp.attestationOptions();
    } else {
        response.json({
            'status': 'failed',
            'message': 'Could not verify response!'
        });
        return;
    }
    registrationOptions.user.id = utils.randomBase64URLBuffer(32);
    registrationOptions.user.name = username;
    registrationOptions.user.displayName = username;
    registrationOptions.challenge = utils.randomBase64URLBuffer(32),
    registrationOptions.status = "ok";

    // Save options in session
    request.session.userId = registrationOptions.user.id;
    request.session.username = registrationOptions.user.name;
    request.session.registerChallenge = registrationOptions.challenge;
    request.session.registerChallengeTime = Date.now();
    //console.error(registrationOptions);
    // Send response
    response.json(registrationOptions);
})

router.post('/registerResponse', async (request, response) => {
    // Validate if parameters are set
    if (! request.body ) { //|| ! request.body.attestationType) {
        response.json({
            'status': 'failed',
            'message': 'Response missing one or more fields!'
        })
        return
    }
    let clientData = request.body; //JSON.parse(base64url.decode(request.body.response.clientDataJSON));
    let attestationType = "platform"; //request.body.attestationType;
    //console.error(request.body);
    // Expected parameters
    var attestationExpectations = {
        challenge: request.session.registerChallenge,
        origin: 'https://' + host,
        factor: "either"
    };
    //console.error(attestationExpectations);
    //console.error(typeof attestationExpectations.challenge);
    //console.error(typeof clientData.id);
	try {
	//console.error(JSON.parse(base64url.decode(request.body.response.clientDataJSON)));
	//console.error(clientData);
        // Try to register
        clientData.id = utils.coerceToArrayBuffer(clientData.id, 'id');
	clientData.rawId = utils.coerceToArrayBuffer(clientData.rawId, 'rawId');
        clientData.response.clientDataJSON = utils.coerceToArrayBuffer(clientData.response.clientDataJSON, 'clientDataJSON');
	clientData.response.attestationObject = utils.coerceToArrayBuffer(clientData.response.attestationObject, 'attestationObject');
	//clientData.challenge = base64url.decode(clientData.challenge);


	if (attestationType === 'platform') {
            var regResult = await f2lp.attestationResult(clientData, attestationExpectations);
        } else if (attestationType === 'cross-platform') {
            var regResult = await f2lcp.attestationResult(clientData, attestationExpectations);
        } else {
            response.json({
                'status': 'failed',
                'message': 'Could not verify response!'
            });
            return;
        }
    } catch (err) {
        response.json({
            'status': 'failed',
            'message': 'Could not verify response!' + err
        })
    }
    
    // Send response if successful
    response.json({ 'status': 'ok' });
})

module.exports = router;

