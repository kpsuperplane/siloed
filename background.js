chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({scale: '100'}, function() {
        console.log("daddy <3");
    });
});
