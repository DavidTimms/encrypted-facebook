var facebookOpenPGP = ({
	getNumericFacebookID: function (human_fb_id) {
		// traverse page to find matching numeric facebook ID 
		// for the given human-readable facebook ID
	},
	getFacebookID: function () {
		// get facebook ID from the URL
		if (!this.fb_id) {
			this.fb_id = window.location.pathname.substring(10);

			if (this.fb_id === 'a human readable facebook id') {
				this.fb_id = this.getNumericFacebookID(fb_id);
			}
		}
		return this.fb_id;
	},
	replaceEncryptedMessages: function () {
		// find encrypted messages in the page and replace them
		// with the decrypted contents
		console.log('replacing encrypted messages');
		this.searchInNode('-----BEGIN PGP MESSAGE')
			.forEach(function (node) {
				var message = node.textContent.replace('.org','.org\n\n');
				console.log(message);
				chrome.runtime.sendMessage({
					type: 'decryptMessage', 
					enc_text: message
				}, 
				function (response) { // Callback function once encryption complete
					if (!response.error) {
						var decrypted = response.decrypted_text;
						console.log(decrypted);

						// Replace encrypted message in page
						node.textContent = decrypted;
					}
				});
			});

	},
	searchInNode: function (query, node) {
		var TEXT_NODE = 3;
		var ELEMENT_NODE = 1;
		if (!node) {
			node = document.querySelector('._2nj');
			this.searchInNode.enc_message_nodes = [];
		}
		if (node.hasChildNodes()) {
			var child = node.firstChild;
			while (child) {
				if (child.nodeType === TEXT_NODE) {
					var text = child.nodeValue;
					if (text.indexOf(query) >= 0) {
						this.searchInNode.enc_message_nodes.push(node.parentNode);
					}
				}
				else if (child.nodeType === ELEMENT_NODE) {
					this.searchInNode(query, child);
				}
				child = child.nextSibling;
			}
		}
		return this.searchInNode.enc_message_nodes;
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
	sendEncryptedMessage: function (click_event) {

		// Stop automatic submission
		if (click_event) {
			click_event.preventDefault();
		}

		var msg_box = facebookOpenPGP.getMessageBox();
		//var enc = 'Encrypted Message: ' + msg_box.value;
		//msg_box.value = enc;
		
		chrome.runtime.sendMessage({
			type: 'encryptMessage', 
			message_text: msg_box.value,
			fb_id: facebookOpenPGP.getFacebookID()
		}, 
		function (response) { // Callback function once encryption complete
			if (!response.error) {
				var encrypted = response.enc_text;//split('\n').join('\n\n');
				console.log(encrypted);
				msg_box.value = encrypted;

				// Click standard reply button to send
				facebookOpenPGP.reply_label.innerButton.click();
			}
		});

	},
	checkIfRecipientHasExtension: function() {
		chrome.runtime.sendMessage({type: "hasExtension", id: facebookOpenPGP.getFacebookID()}, function(response) {
		if (response.hasExtension) {
			facebookOpenPGP.init()
			console.log("yay! they have the extension");
		} else {
			console.log("Boo they don't have the extension");
			if (document.querySelector('#enc_reply_label'))
			facebookOpenPGP.hideEncryptedReplyButton();
		}
		})
	},
	hideEncryptedReplyButton: function () {
		var encButton = document.querySelector('#enc_reply_label')
		if(encButton)
			encButton.style.display = 'none';
	},
	init: function () {
		// initialise the extension in the page
		var fb_id = this.getFacebookID();
		console.log(fb_id);
		this.addEncryptedReplyButton();
		setTimeout(function () {
			facebookOpenPGP.replaceEncryptedMessages();
		}, 2000);
		//this.replaceEncryptedMessages();
		return this;
	}
});


// listeners
if (window == top) {
	chrome.runtime.onMessage.addListener(function(req, sender) {
		if (req.is_content_script)
			facebookOpenPGP.checkIfRecipientHasExtension();
	});
};


// check if recipient has the extension
facebookOpenPGP.checkIfRecipientHasExtension();
