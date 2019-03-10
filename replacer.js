chrome.storage.sync.get('name', function(data) {
    if (data.name == "Kevin Cong Pei") {
        alert(data.name);
        replace(document);
    } else {
        alert("WRONG PERSON ABORT ABORT");
    }
});

function replace(e) {
    var allImages = e.getElementsByTagName('img');
    
    for (var i = 0; i < allImages.length; i++) {
        var thisImageHeight = allImages[i].clientHeight;
        var thisImageWidth = allImages[i].clientWidth;
        if(thisImageHeight != 0 && thisImageHeight != 0){
            allImages[i].setAttribute('src', 'https://placedog.net/' + thisImageHeight + '/' + thisImageWidth)
        }
    }
}

function replaceOne(image) {
    image = image.target;

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

function replaceUPDATED(image) {
    //console.log("will mutate: " + image.src);   

    var thisImageHeight = image.clientHeight;
    var thisImageWidth = image.clientWidth;
    //if (!(thisImageHeight == 0 || thisImageWidth == 0)) {  
        image.classList.add('we-already-changed-this');
        image.setAttribute('src', 'https://placedog.net/' + thisImageHeight + '/' + thisImageWidth);
        image.setAttribute('srcset', 'https://placedog.net/' + thisImageHeight + '/' + thisImageWidth);
    //}

    //console.log("done changing: " + image.src);
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
                if (!mutation.target.classList.contains('we-already-changed-this')) {
                    replaceUPDATED(mutation.target);
                }
            }
        }
        else{
            replaceOne(mutation);
        }
    }
};

// Create an observer instance linked to the callback function
var observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(targetNode, config);