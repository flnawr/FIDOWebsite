const crypto    = require('crypto');
const base64url = require('base64url');


/**
 * Returns base64url encoded buffer of the given length
 * @param  {Number} len - length of the buffer
 * @return {String}     - base64url random buffer
 */
let randomBase64URLBuffer = (len) => {
    len = len || 32;

    let buff = crypto.randomBytes(len);

    return base64url(buff);
}

function coerceToArrayBuffer(buf, name) { if (!name) { throw new TypeError("name not specified in coerceToArrayBuffer");
	}

	if (typeof buf === "string") {
		// base64url to base64
		buf = buf.replace(/-/g, "+").replace(/_/g, "/");
		// base64 to Buffer
		buf = Buffer.from(buf, "base64");
	}
	// Buffer or Array to Uint8Array
	if (buf instanceof Buffer || Array.isArray(buf)) { buf = new Uint8Array(buf);
	}
	// Uint8Array to ArrayBuffer
	if (buf instanceof Uint8Array) { buf = buf.buffer;
	}
	// error if none of the above worked
	if (!(buf instanceof ArrayBuffer)) { throw new TypeError(`could not coerce '${name}' to ArrayBuffer`);
	}
	return buf;
}

module.exports = { randomBase64URLBuffer, coerceToArrayBuffer
}

