const express       = require('express');
const bodyParser    = require('body-parser');
const cookieSession = require('cookie-session');
const cookieParser  = require('cookie-parser');
const urllib        = require('url');
const path          = require('path');
const crypto        = require('crypto');
const config        = require('./config.json');
const auth          = require('./routes/webauthn.js');
const app           = express();
const port          = config.port;
const host          = config.origin;
const domainName    = 'fido2-thesis.cispa.saarland';
const { Fido2Lib }         = require('fido2-library');

//var f2l = new Fido2Lib();

app.use(bodyParser.json());
app.set('trust proxy',1); //, ['loopback', 'linklocal', 'uniquelocal', '134.96.225.178']);

/* ----- Cookie/Session options ----- */
app.use(cookieSession({
  name: 'session',
  keys: [crypto.randomBytes(32).toString('hex')],
  maxAge: 1 * 60 * 60 * 1000, // 1 hour
  domain: domainName,
  secure: true,
  sameSite: 'Lax',
  httpOnly: false
}))
app.use(cookieParser())

/* ----- Serve static files (css,js,..) ----- */
app.use(express.static(path.join(__dirname, 'static')));
app.use('/auth', auth)


/* ----- Run server ----- */
app.listen(port);
console.log(`Started app at ${host}`);

module.exports = app;
