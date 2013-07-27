
var users = new Array();
users[0] = {id: "phil.mcmahon"};
users[1] = {id: "david.timms.395"};


console.log("POOH POOH POOH");

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.type === "hasExtension")
		{
			console.log(request.id)
			for (var i = 0; i < users.length; i++)
			{
				console.log(users[i].id);
				if (users[i].id === request.id)
				{
					sendResponse({hasExtension: true});
					return;
				}
			}
			sendResponse({hasExtension: false});
		}
		else if (request.type === "encryptedmessage")
		{
			event_obj[request.type]();
			//sendResponse({decryptedmessage: "message"})
		}
		else if (request.type === "messageToEncrypt")
		{
			//encrypt message!
		}
	})

/*
users.forEach(function (user) {
				if (user.id === request.id)
				*/