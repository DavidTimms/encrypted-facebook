
var users = new Array();
users[0] = {id: "phil.mcmahon"};
users[1] = {id: "david.timms.395"};


function updatePageAction(tabId)
{
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