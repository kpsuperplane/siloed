chrome.storage.sync.get('name', function(data) {
    if (data.name == "Kevin Cong Pei") {
        alert(data.name);
        replace();
    } else {
        alert("WRONG PERSON ABORT ABORT");
    }
});

function replace() {
    var allImages = document.getElementsByTagName('img');

    for (var i = 0; i < allImages.length; i++) {
        var thisImageHeight = allImages[i].clientHeight;
        var thisImageWidth = allImages[i].clientWidth;
        allImages[i].setAttribute('src', 'https://placedog.net/' + thisImageHeight + '/' + thisImageWidth)
    }
}

 // Select the node that will be observed for mutations
 var targetNode = document.querySelector('body');

 // Options for the observer (which mutations to observe)
 var config = { attributes: true, childList: true, subtree: true };

 // Callback function to execute when mutations are observed
 var callback = function(mutationsList, observer) {
     for(var mutation of mutationsList) {
        //  if (mutation.type == 'childList') {
        //      console.log('A child node has been added or removed.');
        //      let changed_values = [].slice.call(targetNode.children)
        //         .map( function(node) { return node.attribute; })
        //         .filter( function(s) {
        //         if (s === '<br />') {
        //             return false;
        //         }
        //     });
        //     console.log('mutations are: ' + changed_values);
        //  }
        //  else 
        if (mutation.type == 'attributes') {
            console.log('The ' + mutation.attributeName + ' attribute was modified.');
            let changed_values = [].slice.call(targetNode.children)
                .map( function(node) { return node.attribute; })
                .filter( function(s) {
                if (s === '<br />') {
                    return false;
                }
            });
            console.log('modifications are: ' + changed_values);  
        }
    }
 };

 // Create an observer instance linked to the callback function
 var observer = new MutationObserver(callback);

 // Start observing the target node for configured mutations
 observer.observe(targetNode, config);