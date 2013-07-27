
var users = new Array();
users[0] = {id: "phil.mcmahon"}
users[1] = {id: "david.timms.395"}

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		console.log(request);
		if (request.type === "hasExtension")
		{
			for (x in users)
				if x.id === request.id
					sendResponse({hasExtension: true})
		}
		else if (request.type === "encryptedmessage")
		{
			//sendResponse({decryptedmessage: "message"})
		}
		else if (request.type === "messageToEncrypt")
		{
			//encrypt message!
		}
	})