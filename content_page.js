//stuff here that will be injected into the page

chrome.extension.sendMessage({type: "hasExtension", id: getFacebookId()}, function(response) {
	if (response.hasExtension === true)
	{
		// inject buttons etc, get messages
		console.log("yay! they have the extension");
	}
	else
	{
		// do nothing
		console.log("Boo they don't have the extension");
	}
})