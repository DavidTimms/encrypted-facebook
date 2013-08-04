var facebookOpenPGPOptions = ({
	processkey: function () {
		var key = document.getElementById("publickey").value;
		console.log("key: "+ key);
		if (key == null || key =="") {
		// do nothing
		}

		// Update status to show whether key import succesfull
		var keyImportStatus = document.getElementById("keyImportStatus");

		try {
			openpgp.keyring.importPublicKey(key);
		}
		catch (exception) {
			throw exception;
			keyImportStatus.innerHTML="Key import failed";
			return;
		}
		keyImportStatus.innerHTML="Key imported.";

		try {
			openpgp.keyring.store();
		}
		catch (exception) {
			console.log("keyring.store failed");
			throw exception;
		}
	},
	generateKey: function() {
		var username = document.getElementById('userFacebookId').value;
		var keyId;
		if (username.length < 1)
		{
			document.getElementById("keyGenerateStatus").innerHTML =
			 "<p>Key generation failed - username at least 1 character</p>";
			 return;
		} 
		else if (username.length > 8) {
			keyId = username.substring(0,  7);
		}
		else
			keyId = username;
		// store username in chrome sync storage
		chrome.storage.sync.set({"facebookUsername" : username}, function(result) {
			if (chrome.runtime.lastError)
				console.log("Username storage error");
		})

		var newKey;
		try {
			newKey = openpgp.generate_key_pair(1, 1024, keyId);
		}
		catch (exception) {
			throw exception;
		}
		openpgp.keyring.importPrivateKey(newKey.privateKeyArmored);
		openpgp.keyring.importPublicKey(newKey.publicKeyArmored);
		document.getElementById("userPublicKey").innerHTML = "<p>" + newKey.publicKeyArmored + "</p>";
		facebookOpenPGPOptions.checkSetUp();
	},
	deletekey: function() {
		chrome.storage.sync.remove("facebookUsername", function(result) {
			if (chrome.runtime.lastError)
				console.log("Key delete error");
		});
		facebookOpenPGPOptions.checkSetUp();
	},
	createNewKeyring: function() {
		//var keyring = new openpgp_keyring;
	},
	checkSetUp: function() {
		chrome.storage.sync.get('facebookUsername', function(result) {
			if (result.facebookUsername)
			{
				document.getElementById('generateKey').style.display = 'none';
				document.getElementById('userKeys').style.display = 'inline';
				document.getElementById('keyInfoText').innerHTML =
				 "<p> You have a key set up for username " + result.facebookUsername + ": </p>";
				 //document.getElementById("userPublicKey").innerHTML = "";
				 console.log(openpgp.keyring.getPublicKeysForKeyId(result.facebookUsername.substring(0,7)));
			} 
			else {
				document.getElementById('userKeys').style.display = 'none';
				document.getElementById('generateKey').style.display = 'inline';
			}
			console.log(result);
			//console.log(chrome.runtime.lastError);
		});
	},
	init: function() {
		this.checkSetUp();
		openpgp.init();
		//keyring = new openpgp_keyring();
		console.log("Initialising options js");
		document.querySelector('#saveKey').addEventListener('click', this.processkey);
		document.querySelector('#generateKeyButton').addEventListener('click', this.generateKey);
		document.querySelector('#deleteUserKey').addEventListener('click', this.deletekey);
		return this;
	}
}).init();