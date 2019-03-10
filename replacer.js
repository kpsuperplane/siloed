function replaceAllInitial() {
    var allImages = document.getElementsByTagName('img');
    chrome.storage.sync.get('scale', function(data) {
        for (var i = 0; i < allImages.length; i++) {  
            replaceOne(allImages[i], data.scale);
        }
    });
}

// changes image edits according to slider info here
function replaceImage(image, scale, thisImageHeight, thisImageWidth) {
    if (scale == '100') {
        image.setAttribute('src', 'https://placedog.net/' + thisImageWidth + '/' + thisImageHeight);
        image.setAttribute('srcset', 'https://placedog.net/' + thisImageWidth + '/' + thisImageHeight);
    }
}

function replaceUPDATE(image, scale) {
    if (image.src != undefined && image.src.indexOf('placedog') != -1) 
    return;
    
    if (image instanceof HTMLImageElement){
        var thisImageHeight = image.clientHeight;
        var thisImageWidth = image.clientWidth;
        console.log("reached replace one insideinside");
        replaceImage(image, scale, thisImageHeight, thisImageWidth);
    }
}

function replaceOne(image, scale) {
    if (image.src != undefined && image.src.indexOf('placedog') != -1) 
    return;
    
    if (image instanceof HTMLImageElement){
        var thisImageHeight = image.clientHeight;
        var thisImageWidth = image.clientWidth;
        console.log("reached replace one insideinside");
        if (thisImageHeight != 0 && thisImageHeight != 0) {
            replaceImage(image, scale, thisImageHeight, thisImageWidth);
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
    chrome.storage.sync.get('scale', function(data) {
        let scale = data.scale;
        //alert(scale);
        //replace(mutationsList);
        for (var mutation of mutationsList) {
            if (mutation.type == 'attributes') {
                //console.log('The ' + mutation.attributeName + ' attribute was modified.');
                if (mutation.attributeName == 'src') {
                    replaceUPDATE(mutation.target, scale);
                }
            }
            
            replaceOne(mutation.target, scale);
        }
    });
};

// Create an observer instance linked to the callback function
var observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(targetNode, config);