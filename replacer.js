function replaceAllInitial() {
    var allImages = document.getElementsByTagName('img');
    for (var i = 0; i < allImages.length; i++) {  
        replaceImage(allImages[i]);
    }
}

function replaceImage(image) {
    
    if(image instanceof HTMLImageElement){
        if(image.src != undefined && (image.src[0] == 'd' || image.src[0] == 'c'))
        return;
        var thisImageHeight = image.clientHeight;
        var thisImageWidth = image.clientWidth;
        if (thisImageHeight != 0 && thisImageHeight != 0){
            const src = image.src;
            const loading = chrome.runtime.getURL('/assets/img/loading.gif');
            image.setAttribute('src', loading);
            image.setAttribute('srcset', loading);
            chrome.runtime.sendMessage({url: src}, ({url}) => {
                image.setAttribute('src', url);
                image.setAttribute('srcset', url);
            });
        }
    }
}

replaceAllInitial();

// Select the node that will be observed for mutations
var targetNode = document.querySelector('body');

// Options for the observer (which mutations to observe)
var config = { attributes: true, childList: true, subtree: true };

// Callback function to execute when mutations are observed
var callback = function(mutationsList, observer) {
    //alert(scale);
    //replace(mutationsList);
    for (var mutation of mutationsList) {
        if (mutation.type == 'attributes') {
            //console.log('The ' + mutation.attributeName + ' attribute was modified.');
            if (mutation.attributeName == 'src') {
                replaceImage(mutation.target);
            }
        }
        
        replaceImage(mutation.target);
    }
};

// Create an observer instance linked to the callback function
var observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(targetNode, config);