chrome.storage.sync.get('name', function(data) {
    if (data.name == "Kevin Cong Pei") {
        alert(data.name);
        var allImages = document.getElementsByTagName('img');

        for (var i = 0; i < allImages.length; i++) {
            allImages[i].addEventListener('mouseover', function() {
                var thisImageHeight = this.clientHeight;
                var thisImageWidth = this.clientWidth;

                this.setAttribute('src', 'https://placedog.net/' + thisImageHeight + '/' + thisImageWidth)
            })
        }
    } else {
        alert("WRONG PERSON ABORT ABORT");
    }
});

 // Select the node that will be observed for mutations
 var targetNode = document.getElementsByTagName('img');

 // Options for the observer (which mutations to observe)
 var config = { attributes: true, childList: true, subtree: true };

 // Callback function to execute when mutations are observed
 var callback = function(mutationsList, observer) {
     for(var mutation of mutationsList) {
         if (mutation.type == 'childList') {
             console.log('A child node has been added or removed.');
         }
         else if (mutation.type == 'attributes') {
             console.log('The ' + mutation.attributeName + ' attribute was modified.');
         }
     }
 };

 // Create an observer instance linked to the callback function
 var observer = new MutationObserver(callback);

 // Start observing the target node for configured mutations
 observer.observe(targetNode, config);