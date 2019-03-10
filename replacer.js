// replaces all images at start
chrome.storage.sync.get('name', function(data) {
    if (data.name == "Kevin Cong Pei") {
        alert(data.name);
        var allImages = document.getElementsByTagName('img');
        for (var i = 0; i < allImages.length; i++) {  
            replace(allImages[i]);
        }
    } else {
        alert("WRONG PERSON ABORT ABORT");
    }
});

// used to replace all images at start
function replace(image) {
    console.log("will mutate: " + image.src);   

    var thisImageHeight = image.clientHeight;
    var thisImageWidth = image.clientWidth; 
    
    // image.classList.add('we-already-changed-this');
    image.setAttribute('src', 'https://placedog.net/' + thisImageHeight + '/' + thisImageWidth);
    image.setAttribute('srcset', 'https://placedog.net/' + thisImageHeight + '/' + thisImageWidth);

    console.log("done changing: " + image.src);
}

// used to replace updated images
function replaceOne(image) {
    image = image.target;

    if(image.src != undefined && image.src.indexOf('placedog') != -1)
        return;

    if(image instanceof HTMLImageElement){
        var thisImageHeight = image.clientHeight;
        var thisImageWidth = image.clientWidth;
        console.log("reached replace one insideinside");
        if(thisImageHeight != 0 && thisImageHeight != 0){
            // image.classList.add('we-already-changed-this');
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
        //if (!mutation.target.classList.contains('we-already-changed-this')) {
            replaceOne(mutation);
        //}
    }
};

// Create an observer instance linked to the callback function
var observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(targetNode, config);