var facebookOpenPGP = ({
	getNumericFacebookID: function (human_fb_id) {
		// traverse page to find matching numeric facebook ID 
		// for the given human-readable facebook ID
	},
	getFacebookID: function () {
		// get facebook ID from the URL
		var fb_id = window.location.pathname.substring(10);

		if (fb_id === 'a human readable facebook id') {
			fb_id = this.getNumericFacebookID(fb_id);
		}
		return fb_id;
	},
	replaceEncryptedMessages: function () {
		// find encrypted messages in the page and replace them
		// with the decrypted contents
	},
	getMessageBox: function () {
		if (!this.message_box) {
			this.message_box = document.querySelector('._1rv');
		}
		return this.message_box;
	},
	getReplyLabel: function () {
		if (!this.reply_label) {
			this.reply_label = document.querySelector('#js_2');
			this.reply_label.innerButton = this.reply_label.children[0];
		}
		return this.reply_label;
	},
	addEncryptedReplyButton: function () {
		// Add "Encrypted Reply" button to the page
		console.log('Adding encrypted reply button');
		var reply_label = document.querySelector('#enc_reply_label');
		if (reply_label) {
			reply_label.style.display = '';
		}
		else {
			reply_label = this.getReplyLabel();
			var enc_reply_label = reply_label.cloneNode(true);
			enc_reply_label.id = 'enc_reply_label';
			var enc_reply_button = enc_reply_label.children[0];
			enc_reply_button.id = 'enc_reply_button';
			enc_reply_button.value = 'Encrypted Reply';
			enc_reply_button.type = 'button';
			enc_reply_button.onclick = this.sendEncryptedMessage;

			parent_element = document.querySelector('._1r-');
			parent_element.insertBefore(enc_reply_label, reply_label);
		}

	},
	sendEncryptedMessage: function () {
		console.log('sending encrypted');
		var msg_box = facebookOpenPGP.getMessageBox();
		var enc = 'Encrypted Message: ' + msg_box.value;
		msg_box.value = enc;

		/*
		chrome.runtime.sendMessage(
			{type: 'encryptMessage', message_text: msg_box.value},  
			function (response) { // Callback function once encryption complete
				if (!response.error) {
					msg_box.value = response.encrypted_text;
				}
			}
		);
		*/
		//facebookOpenPGP.reply_label.innerButton.click();
	},
	hideEncryptedReplyButton: function () {
		document.querySelector('#enc_reply_label').style.display = 'none';
	},
	init: function () {
		// initialise the extension in the page
		var fb_id = this.getFacebookID();
		console.log(fb_id);
		this.addEncryptedReplyButton();
		return this;
	}
});

// check if recipient has the extension
chrome.runtime.sendMessage({type: "hasExtension", id: facebookOpenPGP.getFacebookID()}, function(response) {
	if (response.hasExtension)
	{
		// inject buttons etc, get messages
		facebookOpenPGP.init()
		console.log("yay! they have the extension");
	}
	else
	{
		// do nothing
		console.log("Boo they don't have the extension");
	}
});

console.log("This is facebook messages!" + facebookOpenPGP.getFacebookID());

