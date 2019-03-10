chrome.storage.sync.get('name', function(data) {
    if (data.name == "Kevin Cong Pei") {
        alert(data.name);
        var allImages = document.getElementsByTagName('img');
        for (var i = 0; i < allImages.length; i++) {  
            replaceOne(allImages[i]);
        }
    } else {
        alert("WRONG PERSON ABORT ABORT");
    }
});

function replaceOne(image) {
    if(image.src != undefined && image.src.indexOf('placedog') != -1)
        return;

    if(image instanceof HTMLImageElement){
        var thisImageHeight = image.clientHeight;
        var thisImageWidth = image.clientWidth;
        console.log("reached replace one insideinside");
        if(thisImageHeight != 0 && thisImageHeight != 0){
            image.setAttribute('src', 'https://placedog.net/' + thisImageHeight + '/' + thisImageWidth)
            image.setAttribute('srcset', 'https://placedog.net/' + thisImageHeight + '/' + thisImageWidth)
        }
    }
}

// Select the node that will be observed for mutations
var targetNode = document.querySelector('body');

// Options for the observer (which mutations to observe)
var config = { attributes: true, childList: true, subtree: true };

// Callback function to execute when mutations are observed
var callback = function(mutationsList, observer) {
    //replace(mutationsList);
    for(var mutation of mutationsList) {
        if (mutation.type == 'attributes') {
            //console.log('The ' + mutation.attributeName + ' attribute was modified.');
            if (mutation.attributeName == 'src') {
                replaceOne(mutation.target);
            }
        }
        
        replaceOne(mutation.target);
    }
};

// Create an observer instance linked to the callback function
var observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(targetNode, config);