var facebookOpenPGP = ({
	getPublicKey: function (fb_id) {
		// Query database to get public key associated 
		// with the other user's facebook ID
		var key_string = dummy_keychain.public_key;
		return openpgp.read_publicKey(key_string)[0];
	},
	getMyPrivateKey: function () {
		// Read my private key from local file
		var key_string = dummy_keychain.private_key;
		return openpgp.read_privateKey(key_string)[0];
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

var dummy_keychain = {
	private_key: 	'-----BEGIN PGP PRIVATE KEY BLOCK-----
					Version: OpenPGP.js v.1.20130420
					Comment: http://openpgpjs.org

					xcEYBFHzx2oBA/9lkREN2TW5DChQSSi/TYVagWprqZKgjlSU7dZJ454nFbjS
					HZ0OwIVyRitY9tNiIRZiZbq7FfFoOH9NNTiQ47+c73fqd/6qV0KTrae2XVNZ
					PQUxWsZc0m1sHmvV5awaP3YuhqsrH4FRC0Hs9dZqb0bA8a/jMw6EdoypPB4M
					VGN47QARAQABAAP+Le4lXTLeFZnG3U/ISoK/DIe73YYo1cynuVW4818o1RoA
					o5xauyIa9ut+jNPKEfVOjx7cC+DHc88g2oR32SX1L2oKFaW1nH2MOV7HKN9p
					EmN9o0+dNq8xDGeZ8Ef/5OUg56L68TjahB+rO7+qCSsMhQBCl0IjUXWo094E
					eL9pJG0CAMBaohqu8Q9gjpCqJMv6MrHgJwqrlUCF5EMfp5JYUh7TqnHf1YLD
					JWtTJRFv8ArMZDip61wPndBzxInP9KW7PEcCAIcsR9tNBuqa7mDe7K78NYIQ
					6nIZQbkSHDKN33H21uF3y495AVxFrmQ9+klK0jZ5uPoWTnQzGl0jtBEV09ve
					XysB/iqGCdRBvMze0EOsIv3CWqZJmXemC1nbrK66DveluHB0WgDU9xQ5lmdX
					Rz28Wdk1NwPfKzCoj3yqYD9pdfvuTo+hXs0IVGVzdCBLZXnCnAQQAQgAEAUC
					UfPHawkQfPbv2v2kxncAALm1A/0c/0hgwLCTMZk3kakNUhkaPxUM8IxfSOAX
					oWvr9HcTE0Ii3ZCQ9Z9zyojoHWJR7ZMiGlq9t2iTSepOQ+T/tAp92MO8g1PW
					jbtBUUrmJNIo0FT23krX44aWI7MKcRLvj4D6vkAUlEqPB3+/mOwbtttcyemt
					usHSaxvzn4y7aJbF4g==
					=VQpc
					-----END PGP PRIVATE KEY BLOCK-----',
	public_key: 	'-----BEGIN PGP PUBLIC KEY BLOCK-----
					Version: OpenPGP.js v.1.20130420
					Comment: http://openpgpjs.org

					xo0EUfPHagED/2WREQ3ZNbkMKFBJKL9NhVqBamupkqCOVJTt1knjnicVuNId
					nQ7AhXJGK1j202IhFmJlursV8Wg4f001OJDjv5zvd+p3/qpXQpOtp7ZdU1k9
					BTFaxlzSbWwea9XlrBo/di6GqysfgVELQez11mpvRsDxr+MzDoR2jKk8HgxU
					Y3jtABEBAAHNCFRlc3QgS2V5wpwEEAEIABAFAlHzx2sJEHz279r9pMZ3AAC5
					tQP9HP9IYMCwkzGZN5GpDVIZGj8VDPCMX0jgF6Fr6/R3ExNCIt2QkPWfc8qI
					6B1iUe2TIhpavbdok0nqTkPk/7QKfdjDvINT1o27QVFK5iTSKNBU9t5K1+OG
					liOzCnES74+A+r5AFJRKjwd/v5jsG7bbXMnprbrB0msb85+Mu2iWxeI=
					=Em+U
					-----END PGP PUBLIC KEY BLOCK-----'
};

/*
// Create new key pair
(function () {
	openpgp.init();
	var type_RSA = 1;
	var numBits = 1024;
	var userId = 'Test Key';
	var new_key = openpgp.generate_key_pair(type_RSA, numBits, userId);
	console.log('private key: \n' + new_key.privateKeyArmored);
	console.log('public key: \n' + new_key.publicKeyArmored);
})();
*/