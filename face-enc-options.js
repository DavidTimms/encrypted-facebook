var facebookOpenPGPOptions = ({
	processkey: function () {
		var key = document.getElementById("publickey").value;
		console.log("key: "+ key);
		if (key == null || key =="") {
		// do nothing
		}
		keyring = new openpgp_keyring;
		keyring.init();

		try {
			keyring.importPublicKey(key);
		}
		catch (exception) {
			console.log("Import failed");
			throw exception;
		}
		//keyring.store();
	},
	createNewKeyring: function() {
		//var keyring = new openpgp_keyring;
	},
	init: function() {
		console.log("Initialising options js");
		document.querySelector('#saveKey').addEventListener('click', this.processkey);
		return this;
	}
}).init();