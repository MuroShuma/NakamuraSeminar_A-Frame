// face_reco.js

const EXPRESSION_THRESHOLD = 0.7; // 確率の閾値

// 表情認識のコード
const video = document.getElementById("video");
const emotionLabels = document.getElementById("emotion-labels");

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("./models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("./models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("./models"),
  faceapi.nets.faceExpressionNet.loadFromUri("./models"),
]).then(startVideo);

function startVideo() {
  navigator.mediaDevices
    .getUserMedia({ video: {} })
    .then((stream) => {
      video.srcObject = stream;
      console.log("ビデオストリームを取得しました");
    })
    .catch((err) =>
      console.error("ビデオストリームの取得に失敗しました:", err)
    );
}

video.addEventListener("loadedmetadata", () => {
  video.play();
  console.log("ビデオの再生が開始されました");
  startFaceDetection();
});

function startFaceDetection() {
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);

  const displaySize = { width: video.videoWidth, height: video.videoHeight };
  faceapi.matchDimensions(canvas, displaySize);

  // 'willReadFrequently'属性を設定してコンテキストを取得
  const canvasCtx = canvas.getContext("2d", { willReadFrequently: true });

  setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();

    const resizedDetections = faceapi.resizeResults(detections, displaySize);

    // キャンバスをクリア
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    // 必要に応じて描画（コメントアウト）
    // faceapi.draw.drawDetections(canvas, resizedDetections);
    // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    // faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

    if (detections.length > 0) {
      const expressions = detections[0].expressions;
      let emotionText = "検出された表情:\n";
      let maxExpression = null;
      let maxProbability = 0;

      Object.entries(expressions).forEach(([expression, probability]) => {
        if (typeof probability === "number") {
          const percentage = (probability * 100).toFixed(1);
          emotionText += `${translateEmotion(expression)}: ${percentage}%\n`;

          if (probability > maxProbability) {
            maxProbability = probability;
            maxExpression = expression;
          }
        }
      });

      emotionLabels.innerText = emotionText;

      // 確率が閾値を超えた場合のみ更新
      if (maxProbability > EXPRESSION_THRESHOLD) {
        // 表情を更新（`updateAvatarExpression`は`socket.js`で定義）
        updateAvatarExpression(maxExpression);
      }
    } else {
      emotionLabels.innerText = "顔が検出されませんでした";
    }
  }, 100);
}

function translateEmotion(emotion) {
  const translations = {
    neutral: "無表情",
    happy: "笑顔",
    sad: "悲しみ",
    angry: "怒り",
    fearful: "恐れ",
    disgusted: "嫌悪",
    surprised: "驚き",
  };
  return translations[emotion] || emotion;
}
