
var users = new Array();
users[0] = {id: "phil.mcmahon"};
users[1] = {id: "david.timms.395"};


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
		var encrypted = 'Fuck off GCHQ! ' + request.message_text;
		return {encrypted_text: encrypted};
	}
};

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		var requested_method = facebookOpenPGPBackground[request.type];
		if (typeof requested_method === 'function') {
			var response = requested_method(request);
			console.log(JSON.stringify(response));
			sendResponse(response);
		}
		else {
			console.log('ERROR: requested method is not a valid function of facebookOpenPGPBackground');
		}
	}
);

/*
users.forEach(function (user) {
				if (user.id === request.id)
				*/