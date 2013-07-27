var facebookOpenPGP = ({
	getPublicKey: function (fb_id) {
		// Query database to get public key associated 
		// with the other user's facebook ID
	},
	getMyPrivateKey: function () {
		// Read my private key from local file
	},
	encryptMessage: function (message) {
		if (!this.public_key) {
			this.getPublicKey();
		}
		// call openPGP.js to encrypt message here
		return 'encrypted message';
	},
	decryptMessage: function (enc_message) {
		if (!this.private_key) {
			this.getMyPrivateKey();
		}
		// call openPGP.js to decrypt message here
		return 'decrypted message';
	},
	getNumericFacebookID: function (human_fb_id) {
		// traverse page to find matching numeric facebook ID 
		// for the given human-readable facebook ID
	},
	getFacebookID: function () {
		// get facebook ID from the URL
		var fb_id = console.log(window.location.pathname.substring(10));

		if (fb_id === 'a human readable facebook id') {
			fb_id = this.getNumericFacebookID(fb_id);
		}
		return fb_id;
	},
	replaceEncryptedMessages: function () {
		// find encrypted messages in the page and replace them
		// with the decrypted contents
	},
	addEncryptedReplyButton: function () {
		// Add "Encrypted Reply" button to the page
	},
	init: function () {
		// initialise the extension in the page
		return this;
	}
}).init();

console.log('Hello World!');