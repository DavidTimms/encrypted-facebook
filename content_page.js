//stuff here that will be injected into the page
console.log("This is facebook messages!");

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
	addEncryptedReplyButton: function () {
		// Add "Encrypted Reply" button to the page
		console.log('Adding encrypted reply button');
		var reply_label = document.querySelector("#js_2");
		var enc_reply_label = reply_label.cloneNode(true);
		enc_reply_label.id = 'enc_reply_label';
		var enc_reply_button = enc_reply_label.children[0];
		enc_reply_button.value = 'Encrypted Reply';
		enc_reply_button.type = 'button';
		enc_reply_button.onclick = this.sendEncryptedMessage;

		parent_element = document.querySelector('._1r-');
		parent_element.insertBefore(enc_reply_label, reply_label);

	},
	sendEncryptedMessage: function () {
		var msg_box = facebookOpenPGP.getMessageBox();
	},
	init: function () {
		// initialise the extension in the page
		var fb_id = this.getFacebookID();
		console.log(fb_id);
		this.addEncryptedReplyButton();
		return this;
	}
}).init();