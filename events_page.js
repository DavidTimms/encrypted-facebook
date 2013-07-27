
var users = new Array();
users[0] = {id: "phil.mcmahon"};
users[1] = {id: "david.timms.395"};

var dummy_keyring = {
	private_key: 	"-----BEGIN PGP PRIVATE KEY BLOCK-----\
						Version: OpenPGP.js v.1.20130420\
						Comment: http://openpgpjs.org\
	\
						xcEYBFHzx2oBA/9lkREN2TW5DChQSSi/TYVagWprqZKgjlSU7dZJ454nFbjS\
						HZ0OwIVyRitY9tNiIRZiZbq7FfFoOH9NNTiQ47+c73fqd/6qV0KTrae2XVNZ\
						PQUxWsZc0m1sHmvV5awaP3YuhqsrH4FRC0Hs9dZqb0bA8a/jMw6EdoypPB4M\
						VGN47QARAQABAAP+Le4lXTLeFZnG3U/ISoK/DIe73YYo1cynuVW4818o1RoA\
						o5xauyIa9ut+jNPKEfVOjx7cC+DHc88g2oR32SX1L2oKFaW1nH2MOV7HKN9p\
						EmN9o0+dNq8xDGeZ8Ef/5OUg56L68TjahB+rO7+qCSsMhQBCl0IjUXWo094E\
						eL9pJG0CAMBaohqu8Q9gjpCqJMv6MrHgJwqrlUCF5EMfp5JYUh7TqnHf1YLD\
						JWtTJRFv8ArMZDip61wPndBzxInP9KW7PEcCAIcsR9tNBuqa7mDe7K78NYIQ\
						6nIZQbkSHDKN33H21uF3y495AVxFrmQ9+klK0jZ5uPoWTnQzGl0jtBEV09ve\
						XysB/iqGCdRBvMze0EOsIv3CWqZJmXemC1nbrK66DveluHB0WgDU9xQ5lmdX\
						Rz28Wdk1NwPfKzCoj3yqYD9pdfvuTo+hXs0IVGVzdCBLZXnCnAQQAQgAEAUC\
						UfPHawkQfPbv2v2kxncAALm1A/0c/0hgwLCTMZk3kakNUhkaPxUM8IxfSOAX\
						oWvr9HcTE0Ii3ZCQ9Z9zyojoHWJR7ZMiGlq9t2iTSepOQ+T/tAp92MO8g1PW\
						jbtBUUrmJNIo0FT23krX44aWI7MKcRLvj4D6vkAUlEqPB3+/mOwbtttcyemt\
						usHSaxvzn4y7aJbF4g==\
						=VQpc\
						-----END PGP PRIVATE KEY BLOCK-----",
	public_key: 	"-----BEGIN PGP PUBLIC KEY BLOCK-----\
						Version: OpenPGP.js v.1.20130420\
						Comment: http://openpgpjs.org\
	\
						xo0EUfPHagED/2WREQ3ZNbkMKFBJKL9NhVqBamupkqCOVJTt1knjnicVuNId\
						nQ7AhXJGK1j202IhFmJlursV8Wg4f001OJDjv5zvd+p3/qpXQpOtp7ZdU1k9\
						BTFaxlzSbWwea9XlrBo/di6GqysfgVELQez11mpvRsDxr+MzDoR2jKk8HgxU\
						Y3jtABEBAAHNCFRlc3QgS2V5wpwEEAEIABAFAlHzx2sJEHz279r9pMZ3AAC5\
						tQP9HP9IYMCwkzGZN5GpDVIZGj8VDPCMX0jgF6Fr6/R3ExNCIt2QkPWfc8qI\
						6B1iUe2TIhpavbdok0nqTkPk/7QKfdjDvINT1o27QVFK5iTSKNBU9t5K1+OG\
						liOzCnES74+A+r5AFJRKjwd/v5jsG7bbXMnprbrB0msb85+Mu2iWxeI=\
						=Em+U\
						-----END PGP PUBLIC KEY BLOCK-----"
};

console.log('background script started');


function updatePageAction(tabId) {
	chrome.tabs.sendMessage(tabId, {is_content_script: true}, function(response) {
	if (response.is_content_script)
		chrome.pageAction.show(tabId);
	});
};

chrome.tabs.onUpdated.addListener(function(tabId, change, tab) {
	if (change.status == "complete") {
		updatePageAction(tabId);
	}
});

var facebookOpenPGPBackground = {
	hasExtension: function (request) {
		console.log(request.id)
		for (var i = 0; i < users.length; i++)
		{
			console.log(users[i].id);
			if (users[i].id === request.id)
			{
				return {hasExtension: true};
			}
		}
		return {hasExtension: false};
	},
	encryptMessage: function (request) {
		var public_key = this.getPublicKey(request.fb_id);
		var encrypted = openpgp.write_encrypted_message([public_key], request.message_text);
		return {encrypted_text: encrypted};
	},
	decryptMessage: function (request) {
		var decrypted = 'Decrypted: ' + request.enc_text;
		return {decrypted_text: decrypted};
	},
	getPublicKey: function (fb_id) {
		// Query keyring to get public key associated 
		// with the other user's facebook ID
		var key_string = dummy_keyring.public_key;
		return openpgp.read_publicKey(key_string)[0];
	},
	getMyPrivateKey: function () {
		// Read my private key from local file
		var key_string = dummy_keyring.private_key;
		return openpgp.read_privateKey(key_string)[0];
	},
};

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		var requested_method = facebookOpenPGPBackground[request.type];
		if (typeof requested_method === 'function') {
			var response = facebookOpenPGPBackground[request.type];
			console.log(JSON.stringify(response));
			sendResponse(response);
		}
		else {
			console.log('ERROR: requested method is not a valid function of facebookOpenPGPBackground');
		}
	}
);