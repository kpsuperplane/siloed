chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({name: 'Kevin Cong Pei'}, function() {
        console.log("daddy <3");
    });
});
