var facebookOpenPGPOptions = ({
	userKeySet : false,
	userFacebookEmail : "",
	getUserPublicKey: function() {
		if (userKeySet)
			return openpgp.keyring.getPublicKeyForAddress(userFacebookEmail);
		else
			return "Key not set";
	},
	getUserPrivateKey: function() {
		if (userKeySet)
			return openpgp.keyring.getPrivateKeyForAddress(userFacebookEmail);
		else
			return "Key not set";
	},
	// this can be used with just the first parameter - checkIfUsernameInKeyList(username)
	checkIfUsernameInKeyList: function(username, storageChecked, returnValue) {
		if (storageChecked)
			return returnValue;
		chrome.storage.sync.get('friendList', function (result) {
			if (result.friendList)
			{
				var friendList = result.friendList;
				for (var i = 0; i < friendList.length; i++)
					if (username === friendList[i].id)
						facebookOpenPGPOptions.checkIfUser(username, true, true);
				return facebookOpenPGPOptions.checkIfUser(username, true, false);
			}
		}					
	},
	getPublicKeyFromUserName: function(username) {
		return openpgp.keyring.getPublicKeyForAddress(username + "@facebook.com");
	},
	addKey: function () {
		var friendId = document.getElementById("friendFacebookId").value;
		if (friendId == null || friendId.length < 1) {
			// error!
		}
		var key = document.getElementById("publickey").value;
		if (key == null || key =="") {
			// do nothing
		}

		// Update status to show whether key import succesful
		var keyImportStatus = document.getElementById("keyImportStatus");
		console.log(openpgp.keyring.publicKeys.length);
		try {
			openpgp.keyring.importPublicKey(key);
		}
		catch (exception) {
			throw exception;
			keyImportStatus.innerHTML="Key import failed";
			return;
		}
		keyImportStatus.innerHTML="Key imported.";

		var keyIndex = openpgp.keyring.publicKeys.length;
		// Store keyring
		try {
			openpgp.keyring.store();
		}
		catch (exception) {
			console.log("keyring.store failed");
			throw exception;
		}
		console.log(openpgp.keyring);
		chrome.storage.sync.get('friendList', function(result) {
			result.friendList.push({"id" : friendId, "index" : keyIndex});
			chrome.storage.sync.set({'friendList' : result.friendList}, function(result) {
			 	if (chrome.runtime.lastError)
			 		console.log("Friend id storage error");
			 	else
			 		facebookOpenPGPOptions.updateFriendList();
		  	});
		});
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
		else
			keyId = username + "@facebook.com";
		console.log(keyId);
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
		openpgp.keyring.store();
		console.log(openpgp.keyring);
		document.getElementById("userPublicKey").innerHTML = "<p>" + newKey.publicKeyArmored + "</p>";
		facebookOpenPGPOptions.loadUserDetailsAndInitFriendList();
	},
	deleteAllKeysInKeyring: function() {
		console.log(openpgp.keyring.publicKeys.length);
		while (openpgp.keyring.publicKeys.length > 0)
			openpgp.keyring.removePublicKey(0);
		while (openpgp.keyring.privateKeys.length > 0)
			openpgp.keyring.removePrivateKey(0);
		console.log(openpgp.keyring.publicKeys.length);
		console.log(openpgp.keyring);
		chrome.storage.sync.remove("friendList", function(result) {
			if (chrome.runtime.lastError)
				console.log("Key list delete error");
			else
			{
				openpgp.keyring.store();
				chrome.storage.sync.remove("facebookUsername", function(result) {
				if (chrome.runtime.lastError)
					console.log("Key delete error");
				else
				{
					facebookOpenPGPOptions.updateFriendList();
					facebookOpenPGPOptions.loadUserDetailsAndInitFriendList();
				}
				});
			}
		});
	},
	deleteFriend: function(e) {
		console.log(openpgp.keyring.publicKeys.length)
		var indexToDelete = e.srcElement.friendListIndex
		chrome.storage.sync.get('friendList', function(result) {
			var removeAt = result.friendList[indexToDelete].index -1;
			console.log(removeAt);
			openpgp.keyring.removePublicKey(removeAt);
			for (var i = indexToDelete + 1; i < result.friendList.length; i++)
				result.friendList[i].index--;
			console.log(openpgp.keyring.publicKeys.length)
			result.friendList.splice(indexToDelete, 1);
			chrome.storage.sync.set({'friendList' : result.friendList}, function(result) {
				if (chrome.runtime.lastError)
					console.log("Friend delete error");
				else
					facebookOpenPGPOptions.updateFriendList();
			});
		});
	},
	updateFriendList: function() {
		chrome.storage.sync.get('friendList', function(result) {
			if (result.friendList)
			{
				var friendList = result.friendList;
				document.getElementById("friendListElements").innerHTML = "";
				for (var i = 0; i < friendList.length; i++)
				{
					var li = document.createElement("li");
					console.log(friendList[i].id);
					li.appendChild(document.createTextNode(friendList[i].id + friendList[i].index))
					var deleteFriendButton = document.createElement("button");
					deleteFriendButton.id = "deleteFriendButton";
					deleteFriendButton.type = "submit";
					deleteFriendButton.value = "Delete Friend";
					deleteFriendButton.friendListIndex = i;
					deleteFriendButton.appendChild(document.createTextNode("Delete Friend"));
					deleteFriendButton.addEventListener('click', facebookOpenPGPOptions.deleteFriend);
					li.appendChild(deleteFriendButton);
					document.getElementById("friendListElements").appendChild(li);
				}
			}
		});
	},
	loadUserDetailsAndInitFriendList: function() {
		chrome.storage.sync.get('facebookUsername', function(result) {
			if (result.facebookUsername)
			{
				loadUserDetailsAndInitFriendList = true;
				userFacebookEmail = result.facebookUsername + "@facebook.com";
				document.getElementById('generateKey').style.display = 'none';
				document.getElementById('userKeys').style.display = 'inline';
				document.getElementById('keyInfoText').innerHTML =
				 "<p> You have a key set up for username " + result.facebookUsername + ": </p>";
				document.getElementById("userPublicKey").innerHTML = "<p>" +
				 openpgp.keyring.getPublicKeyForAddress(userFacebookEmail)[0].armored + "</p>";
			} 
			else {
				document.getElementById('userKeys').style.display = 'none';
				document.getElementById('generateKey').style.display = 'inline';
			}
			if(chrome.runtime.lastError)
				console.log("Username check error");
		});
		chrome.storage.sync.get('friendList', function(result) {
			if (result.friendList)
				console.log("Friend list exists:" + result);
			else
			{
				console.log("Creating friend list");
				chrome.storage.sync.set({"friendList" : new Array()});
			}
		});
	},
	init: function() {
		this.loadUserDetailsAndInitFriendList();
		openpgp.init();
		
		// Setup buttons
		document.querySelector('#saveKey').addEventListener('click', this.addKey);
		document.querySelector('#generateKeyButton').addEventListener('click', this.generateKey);
		document.querySelector('#deleteUserKey').addEventListener('click', this.deletekey);
		document.querySelector('#deleteAllKeys').addEventListener('click', this.deleteAllKeysInKeyring);
		
		this.updateFriendList();
		return this;
	}
}).init();