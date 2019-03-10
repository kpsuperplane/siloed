
function siloed__loadAssets() {
  const assets = [
    {url: 'leftpod.png', name: 'leftpod'},
    {url: 'rightpod.png', name: 'rightpod'},
    {url: 'rayban.png', name: 'sunglasses'},
    {url: 'boba.png', name: 'boba'},
    {url: 'goose.png', name: 'goose'}
  ];
  const promises = [];
  for (const {url, name} of assets) {
    promises.push(new Promise((resolve, reject) => {
      var image = new Image();
      image.onload = function(){
        resolve({ url, name, image });
      }
      image.src = chrome.runtime.getURL('/assets/img/' + url);
    }));
  }
  return Promise.all(promises).then((results) => {
    const output = {};
    for (const result of results) {
      output[result.name] = result;
    }
    return output;
  });
};
const siloed__ResourcePromise = Promise.all([
  siloed__loadAssets(),
  faceapi.nets.tinyFaceDetector.loadFromUri('/assets/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/assets/models')
]);
function siloed__replaceImage(img) {
  return siloed__ResourcePromise.then(([assets]) => {
    function getBoundingBox(points) {
      let top = Number.MAX_SAFE_INTEGER, left = Number.MAX_SAFE_INTEGER, bottom = 0, right = 0;
      for (const {x, y} of points) {
        top = Math.min(top, y);
        left = Math.min(left, x);
        bottom = Math.max(bottom, y);
        right = Math.max(right, x);
      }
      return {top, left, width: right - left, height: bottom - top};
    }
    function getCenter(pos) {
      return {
        x: pos.left + pos.width/2,
        y: pos.top + pos.height/2
      }
    }
    function getLineThroughPoint(m, p) {
      const b = p.y - m * p.x;
      return {m, b};
    }
    function getLine(p1, p2) {
      const m = (p1.y - p2.y)/(p1.x - p2.x);
      return getLineThroughPoint(m, p1);
    }
    function getIntersection(line1, line2) {
      const x = (line2.b - line1.b)/(line1.m - line2.m);
      const y = (line1.m) * x + line1.b;
      return {x, y};
    }
    function getMidPoint(a, b) {
      return {x: (a.x + b.x)/2, y: (a.y + b.y)/2};
    }
    function pointDist(p1, p2) {
      return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
    }
    function lineOffsetLeft(line, point, distance) {
      const x = point.x - (distance/Math.sqrt(Math.pow(line.m, 2) + 1));
      const y = line.m * x + line.b;
      return {x, y};
    }
    function rotateAndPaintImage ( context, image, angleInRad , positionX, positionY, axisX, axisY, width, height ) {
      context.save();
      context.translate( positionX, positionY );
      context.rotate( angleInRad );
      context.drawImage( image, -axisX, -axisY, width, height );
      context.rotate( -angleInRad );
      context.translate( -positionX, -positionY );
      context.restore();
    }

    function decorateGoose(ctx, jawOutline) {
      const width = jawOutline.width * 4;
      const goose = assets.goose.image;
      const height = width * (goose.height/goose.width);
      rotateAndPaintImage(
        ctx, 
        goose, 
        0,
        jawOutline.left + jawOutline.width/2, 
        jawOutline.top + jawOutline.height / 1.5, 
        width/2, 
        0,
        width, 
        height
      );

    }

    function decorateAirpod(ctx, leftEyeSrc, rightEyeSrc, nose, jawOutline) {
      const leftEye = getCenter(leftEyeSrc);
      const rightEye = getCenter(rightEyeSrc);
      nose = getCenter(nose);

      const eyeLine = getLine(leftEye, rightEye);
      const eyeDist = pointDist(leftEye, rightEye);
      const pLine = getLineThroughPoint(-1/eyeLine.m, nose);
      const centerI = getIntersection(eyeLine, pLine);

      const mid = getMidPoint(centerI, nose);

      const earLine = getLineThroughPoint(eyeLine.m, mid);

      const rightX = mid.x + eyeDist;
      const right = {
        x: rightX,
        y: earLine.m * rightX + earLine.b
      };
      const rightpod = assets.rightpod.image;
      rotateAndPaintImage(
        ctx, 
        rightpod, 
        Math.atan(earLine.m), 
        Math.min(right.x, jawOutline.left + jawOutline.width + eyeDist), 
        right.y, 
        rightEyeSrc.width/2, 
        0, 
        rightEyeSrc.width, 
        rightEyeSrc.width * (rightpod.height/rightpod.width)
      );

      const leftX = mid.x - eyeDist;
      const left = {
        x: leftX,
        y: earLine.m * leftX + earLine.b
      };
      const leftpod = assets.leftpod.image;
      rotateAndPaintImage(
        ctx, 
        leftpod, 
        Math.atan(earLine.m), 
        Math.max(left.x, jawOutline.left - eyeDist), 
        left.y, 
        leftEyeSrc.width/2, 
        0, 
        leftEyeSrc.width, 
        leftEyeSrc.width * (leftpod.height/leftpod.width)
      );

    }
    function decorateSunglasses(ctx, leftEyeSrc, rightEyeSrc) {
      const leftEye = getCenter(leftEyeSrc);
      const rightEye = getCenter(rightEyeSrc);
      const eyeLine = getLine(leftEye, rightEye);
      const eyeDist = pointDist(leftEye, rightEye);
      const leftPoint = lineOffsetLeft(eyeLine, leftEye, eyeDist/1.5);
      const width = eyeDist * (2/1.5 + 1);
      const sunglasses = assets.sunglasses.image;
      const height = width * (sunglasses.height/sunglasses.width);
      rotateAndPaintImage(
        ctx, 
        sunglasses, 
        Math.atan(eyeLine.m), 
        leftPoint.x, 
        leftPoint.y, 
        0, 
        height/2,
        width, 
        height
      );

    }
    function decorateBoba(ctx, leftEyeSrc, rightEyeSrc, mouthSrc) {
      const leftEye = getCenter(leftEyeSrc);
      const rightEye = getCenter(rightEyeSrc);
      const eyeLine = getLine(leftEye, rightEye);
      const eyeDist = pointDist(leftEye, rightEye);
      const mouth = getCenter(mouthSrc);
      const width = eyeDist * 2;
      const boba = assets.boba.image;
      const height = width * (boba.height/boba.width);

      rotateAndPaintImage(
        ctx, 
        boba, 
        Math.atan(eyeLine.m), 
        mouth.x, 
        mouth.y, 
        width/2, 
        0,
        width, 
        height
      );

    }
    function decorate(ctx, leftEye, rightEye, nose, jawOutline, mouth) {
      decorateGoose(ctx, jawOutline);
      decorateAirpod(ctx, leftEye, rightEye, nose, jawOutline);
      decorateSunglasses(ctx, leftEye, rightEye);
      decorateBoba(ctx, leftEye, rightEye, mouth);
    }
    return faceapi.detectAllFaces(
      img, 
      new faceapi.TinyFaceDetectorOptions({ 
        scoreThreshold: 0.3,
        inputSize: 608
      }))
    .withFaceLandmarks()
    .then((results) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      for (const result of results) {
        const { detection, landmarks } = result;
        const [leftEye, rightEye, nose, jawOutline, mouth] = [
          landmarks.getLeftEye(),
          landmarks.getRightEye(),
          landmarks.getNose(),
          landmarks.getJawOutline(),
          landmarks.getMouth()
        ].map(getBoundingBox);
        decorate(ctx, leftEye, rightEye, nose, jawOutline, mouth);
      } 
      return canvas;
    });
  }).then((canvas) => {
    return canvas.toDataURL('image/png');
  });
}
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  faceapi.fetchImage(request.url).then((image) => {
    siloed__replaceImage(image).then((url) => {
      sendResponse({url});
    });
  });
  return true;
});