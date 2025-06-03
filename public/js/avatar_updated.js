// avatar.js

// 他のユーザーの移動状態を管理するマップ
const userMovementStates = new Map();

// 移動検知の閾値と遅延設定
const MOVEMENT_THRESHOLD = 0.1;
const STOP_DELAY = 500; // ミリ秒

let isCameraActive = true; // カメラがアクティブかどうか
let lastCameraUpdateTime = Date.now(); // 最後にカメラで表情が更新された時間
const CAMERA_TIMEOUT = 5000; // カメラ無反応と判断する時間（ミリ秒）


// アームの位置設定
const ARM_POSITIONS = {
  default: {
    right: {
      rotation: "-67.2 83.16 15.56",
      position: "-0.11 -0.054 -0.28",
    },
    left: {
      rotation: "-65.0 -146.1 43.3",
      position: "0.096 -0.054 -0.27",
    },
  },
  moving: {
    right: {
      rotation: "-63.53 68.13 41.95",
      position: "-0.29439 0.04377 -0.09665",
    },
    left: {
      rotation: "-65.04 -146.10 43.31",
      position: "0.27278 0.04431 -0.13484",
    },
  },
};

// 表情変化の関数
function changeFace(emotion) {
  const avatar = document.querySelector("#mybody"); // 自分のアバターを取得
  if (!avatar) return;
  changeFaceForAvatar(avatar, emotion);
}


function changeFaceForAvatar(avatar, emotion) {
  const mouseElement = avatar.querySelector(".other_mouse");
  const eyebrow_L = avatar.querySelector(".other_eyebrow_L");
  const eyebrow_R = avatar.querySelector(".other_eyebrow_R");
  const eye_L = avatar.querySelector(".other_eye_L"); // 左目
  const eye_R = avatar.querySelector(".other_eye_R"); // 右目

  if (!mouseElement || !eyebrow_L || !eyebrow_R) return;

  switch (emotion) {
    case "neutral":
      mouseElement.setAttribute(
        "geometry",
        "primitive: torus; arc: 180; radiusTubular: 0.082"
      );
      mouseElement.setAttribute("rotation", "27.5 5.66 -177.38");
      mouseElement.setAttribute("scale", "0.016 0.008 0.016");
      mouseElement.setAttribute("position", "0 0.125 -0.29");
      mouseElement.setAttribute("material", "color: #230a05");
      eyebrow_L.setAttribute("visible", false);
      eyebrow_R.setAttribute("visible", false);
      eye_L.setAttribute("scale", "0.7 0.3 0.3");
      eye_R.setAttribute("scale", "0.7 0.3 0.3");
      break;

    case "happy":
      mouseElement.setAttribute(
        "geometry",
        "primitive: circle; thetaLength: 180"
      );
      mouseElement.setAttribute("rotation", "19.69 0 180");
      mouseElement.setAttribute("scale", "0.06 0.04 1");
      mouseElement.setAttribute("position", "0 0.122 -0.29");
      mouseElement.setAttribute("material", "side: double; color: #ff9999");
      eyebrow_L.setAttribute("visible", false);
      eyebrow_R.setAttribute("visible", false);
      eye_L.setAttribute("scale", "0.7 0.3 0.3");
      eye_R.setAttribute("scale", "0.7 0.3 0.3");
      break;

    case "sad":
      mouseElement.setAttribute(
        "geometry",
        "primitive: torus; arc: 180; radiusTubular: 0.082"
      );
      mouseElement.setAttribute("rotation", "27.5 5.66 -0");
      mouseElement.setAttribute("scale", "0.016 0.008 0.016");
      mouseElement.setAttribute("position", "0 0.125 -0.29");
      mouseElement.setAttribute("material", "color: #230a05");
      eyebrow_L.setAttribute("visible", false);
      eyebrow_R.setAttribute("visible", false);
      eye_L.setAttribute("scale", "0.7 0.3 0.3");
      eye_R.setAttribute("scale", "0.7 0.3 0.3");
      break;

    case "angry":
      mouseElement.setAttribute(
        "geometry",
        "primitive: torus; arc: 180; radiusTubular: 0.082"
      );
      mouseElement.setAttribute("rotation", "27.5 5.66 -0");
      mouseElement.setAttribute("scale", "0.016 0.008 0.016");
      mouseElement.setAttribute("position", "0 0.125 -0.29");
      mouseElement.setAttribute("material", "color: #230a05");
      eyebrow_L.setAttribute("visible", true);
      eyebrow_R.setAttribute("visible", true);
      eye_L.setAttribute("scale", "0.7 0.3 0.3");
      eye_R.setAttribute("scale", "0.7 0.3 0.3");
      break;

    case "fearful":
      mouseElement.setAttribute(
        "geometry",
        "primitive: torus; arc: 180; radiusTubular: 0.082"
      );
      mouseElement.setAttribute("rotation", "19.69 0 0");
      mouseElement.setAttribute("scale", "0.06 0.04 1");
      mouseElement.setAttribute("position", "0 0.112 -0.29");
      mouseElement.setAttribute("material", "side: double; color: #000000");
      eyebrow_L.setAttribute("visible", false);
      eyebrow_R.setAttribute("visible", false);
      eye_L.setAttribute("scale", "0.7 0.3 0.3");
      eye_R.setAttribute("scale", "0.7 0.3 0.3");
      break;

    case "disgusted":
      mouseElement.setAttribute("geometry", "primitive: box;");
      mouseElement.setAttribute(
        "rotation",
        "27.610263189559245 -1.1464885480567772 179.46871608441802"
      );
      mouseElement.setAttribute("scale", "0.0625 0.00578 0.01");
      mouseElement.setAttribute("position", "0 0.11326 -0.293");
      mouseElement.setAttribute("material", "side: double; color: #230a05");
      eyebrow_L.setAttribute("visible", false);
      eyebrow_R.setAttribute("visible", false);
      eye_L.setAttribute("scale", "0.7 0.15 0.3");
      eye_R.setAttribute("scale", "0.7 0.15 0.3");
      break;

    case "surprised":
      mouseElement.setAttribute(
        "geometry",
        "primitive: circle; thetaLength: 360"
      );
      mouseElement.setAttribute(
        "rotation",
        "19.694278292031786 0 179.9998479605043"
      );
      mouseElement.setAttribute("scale", "0.03146 0.02263 1.00821");
      mouseElement.setAttribute("position", "-0.00617 0.10388 -0.29645");
      mouseElement.setAttribute("material", "color: #ff9999");
      eyebrow_L.setAttribute("visible", false);
      eyebrow_R.setAttribute("visible", false);
      eye_L.setAttribute("scale", "0.7 0.6 0.3");
      eye_R.setAttribute("scale", "0.7 0.6 0.3");
      break;

    default:
      mouseElement.setAttribute(
        "geometry",
        "primitive: torus; arc: 180; radiusTubular: 0.082"
      );
      mouseElement.setAttribute("rotation", "27.5 5.66 -177.38");
      mouseElement.setAttribute("scale", "0.016 0.008 0.016");
      mouseElement.setAttribute("position", "0 0.125 -0.29");
      mouseElement.setAttribute("material", "color: #230a05");
      eyebrow_L.setAttribute("visible", false);
      eyebrow_R.setAttribute("visible", false);
      eye_L.setAttribute("scale", "0.7 0.3 0.3");
      eye_R.setAttribute("scale", "0.7 0.3 0.3");
      break;
  }
}

// 他のユーザーの表情を更新する関数
function updateOtherUserExpression(id, expression) {
  const avatar = document.getElementById(id);
  if (!avatar) return;
  changeFaceForAvatar(avatar, expression);
}

// 他のユーザーのアバターを作成
function createOtherUserAvatar(id, color, name, position) {
  const avatar = document.createElement("a-sphere");
  avatar.setAttribute("id", id);
  avatar.setAttribute("radius", "0.3");
  avatar.setAttribute("scale", "0.65 0.9 0.6");
  avatar.setAttribute("color", color);
  avatar.classList.add("otherUser");
  avatar.object3D.position.set(position.x, position.y - 1, position.z);

  // 初期移動状態を設定
  userMovementStates.set(id, {
    position: new THREE.Vector3(position.x, position.y, position.z),
    moving: false,
    lastMoveTime: Date.now(),
    moveTimeout: null,
  });

  // アバターの各部品を追加
  const parts = getOtherUserParts();

  parts.forEach((part) => {
    const element = document.createElement(part.tag);
    Object.entries(part.attrs).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
    avatar.appendChild(element);
  });

  // 名前プレートを追加
  const namePlate = document.createElement("a-text");
  namePlate.setAttribute("value", name);
  namePlate.setAttribute("align", "center");
  namePlate.setAttribute("color", "white");
  namePlate.setAttribute("width", "2.5");
  namePlate.setAttribute("rotation", "0 180 0");
  namePlate.setAttribute("position", "0 0.45 0");
  avatar.appendChild(namePlate);

  document.querySelector("a-scene").appendChild(avatar);
}

// 他のユーザーのアバターの部品を定義
function getOtherUserParts() {
  return [
    {
      tag: "a-sphere",
      attrs: {
        class: "other_face",
        radius: "0.28",
        rotation: "28.2 0 0",
        scale: "0.6 0.45 0.25",
        position: "0 0.1 -0.22",
        color: "#fffaf0",
      },
    },
    {
      tag: "a-sphere",
      attrs: {
        class: "other_arm_R",
        radius: "0.2",
        position: ARM_POSITIONS.default.right.position,
        rotation: ARM_POSITIONS.default.right.rotation,
        scale: "0.2 0.3 0.2",
        animation__rotation:
          "property: rotation; dur: 200; easing: easeOutQuad;",
        animation__position:
          "property: position; dur: 200; easing: easeOutQuad;",
      },
    },
    {
      tag: "a-sphere",
      attrs: {
        class: "other_arm_L",
        radius: "0.2",
        position: ARM_POSITIONS.default.left.position,
        rotation: ARM_POSITIONS.default.left.rotation,
        scale: "0.2 0.3 0.2",
        animation__rotation:
          "property: rotation; dur: 200; easing: easeOutQuad;",
        animation__position:
          "property: position; dur: 200; easing: easeOutQuad;",
      },
    },
    {
      tag: "a-sphere",
      attrs: {
        class: "other_leg_R",
        radius: "0.25",
        scale: "0.3 0.3 0.3",
        position: "-0.15 -0.25 0.01",
        color: "#13316c",
      },
    },
    {
      tag: "a-sphere",
      attrs: {
        class: "other_leg_L",
        radius: "0.25",
        scale: "0.3 0.3 0.3",
        position: "0.15 -0.25 0.01",
        color: "#13316c",
      },
    },
    {
      tag: "a-sphere",
      attrs: {
        class: "other_eye_R",
        radius: "0.02",
        scale: "0.7 0.3 0.3",
        position: "-0.1 0.1389 -0.26",
        color: "#230a05",
      },
    },
    {
      tag: "a-sphere",
      attrs: {
        class: "other_eye_L",
        radius: "0.02",
        scale: "0.7 0.3 0.3",
        position: "0.1 0.1398 -0.26",
        color: "#230a05",
      },
    },
    {
      tag: "a-sphere",
      attrs: {
        class: "other_right_cheek",
        radius: "0.02",
        rotation: "0 25.3 0",
        scale: "1.37 0.91 0.7",
        position: "-0.125 0.083 -0.265",
        material: "opacity: 0.1; color: #ff9985",
      },
    },
    {
      tag: "a-sphere",
      attrs: {
        class: "other_left_cheek",
        radius: "0.02",
        rotation: "0 -25.3 0",
        scale: "1.37 0.91 0.7",
        position: "0.125 0.083 -0.265",
        material: "opacity: 0.1; color: #ff9985",
      },
    },
    {
      tag: "a-entity",
      attrs: {
        class: "other_mouse",
        geometry: "primitive: circle; thetaLength: 180",
        material: "side: double; color: #ff9999",
        rotation: "19.694278292031786 0 179.9998479605043",
        scale: "0.06016 0.04 1",
        position: "-0.00098 0.12241 -0.28982",
      },
    },
    {
      tag: "a-entity",
      attrs: {
        class: "other_eyebrow_L",
        geometry: "primitive: torus; arc: 120; radiusTubular: 0.082",
        material: "side: double; color: #230a05",
        rotation: "30.174822280564804 -12.232648926043076 -151.82407542715094",
        scale: "0.02042 0.01278 0.016",
        position: "0.09978 0.15898 -0.2522",
        visible: false,
      },
    },
    {
      tag: "a-entity",
      attrs: {
        class: "other_eyebrow_R",
        geometry: "primitive: torus; arc: 120; radiusTubular: 0.082",
        material: "side: double; color: #230a05",
        rotation: "11.57202858825724 16.455920833952376 -169.09302337239393",
        scale: "0.02 0.01278 0.016",
        position: "-0.09538 0.15678 -0.25719",
        visible: false,
      },
    },
  ];
}

// 他のユーザーの位置と回転を更新
function updateOtherUserPosition(id, position, quaternionArray) {
  const avatar = document.getElementById(id);
  if (!avatar) return;

  const currentTime = Date.now();
  const newPosition = new THREE.Vector3(position.x, position.y, position.z);
  const newQuaternion = new THREE.Quaternion(
    quaternionArray[0],
    quaternionArray[1],
    quaternionArray[2],
    quaternionArray[3]
  );

  if (!userMovementStates.has(id)) {
    userMovementStates.set(id, {
      position: newPosition.clone(),
      moving: false,
      lastMoveTime: currentTime,
      moveTimeout: null,
    });
  }

  const state = userMovementStates.get(id);
  const distance = newPosition.distanceTo(state.position);

  // アバターの位置と回転を更新
  avatar.object3D.position.copy(newPosition);
  avatar.object3D.quaternion.copy(newQuaternion);

  // 移動が検知された場合
  if (distance > MOVEMENT_THRESHOLD) {
    if (!state.moving) {
      updateArmPositions(avatar, true);
      state.moving = true;
    }

    if (state.moveTimeout) {
      clearTimeout(state.moveTimeout);
    }

    state.moveTimeout = setTimeout(() => {
      updateArmPositions(avatar, false);
      state.moving = false;
      state.moveTimeout = null;
    }, STOP_DELAY);
  }

  state.position.copy(newPosition);
  state.lastMoveTime = currentTime;
  userMovementStates.set(id, state);
}

// アームの位置をアニメーションで更新
function updateArmPositions(avatar, isMoving) {
  const arms = ["other_arm_R", "other_arm_L"];
  const targetPositions = isMoving
    ? ARM_POSITIONS.moving
    : ARM_POSITIONS.default;

  arms.forEach((armId) => {
    const arm = avatar.querySelector(`#${armId}`);
    if (arm) {
      const side = armId.endsWith("_R") ? "right" : "left";
      const target = targetPositions[side];

      arm.setAttribute("animation__rotation", {
        property: "rotation",
        to: target.rotation,
        dur: 200,
        easing: "easeOutQuad",
      });
      arm.setAttribute("animation__position", {
        property: "position",
        to: target.position,
        dur: 200,
        easing: "easeOutQuad",
      });
    }
  });
}

// -----------------------------------------------------------------------------------
// ここからWeb Speech APIによる音声認識機能の追加コード
// 事前にHTML側で id="start-recognition" のボタンを用意してください
// 例: <button id="start-recognition">音声認識開始</button>

// アバターの表情を音声認識結果に基づいて更新する
function updateAvatarExpressionFromSpeech(transcript) {
  console.log("音声認識結果:", transcript);

  const expressionRules = [
    { keyword: "嬉しい", expression: "happy" },
    { keyword: "楽しい", expression: "happy" },
    { keyword: "悲しい", expression: "sad" },
    { keyword: "寂しい", expression: "sad" },
    { keyword: "怒っている", expression: "angry" },
    { keyword: "怖い", expression: "fearful" },
    { keyword: "驚いた", expression: "surprised" },
    { keyword: "びっくり", expression: "surprised" },
    { keyword: "やだ", expression: "disgusted" },
    { keyword: "嫌", expression: "disgusted" },
    { keyword: "普通", expression: "neutral" },
  ];

  let matchedExpression = "neutral";
  for (const rule of expressionRules) {
    if (transcript.includes(rule.keyword)) {
      matchedExpression = rule.expression;
      break;
    }
  }

  const avatar = document.querySelector("#mybody");
  if (avatar) {
    changeFace(matchedExpression); // 表情変更
    emitExpressionChange(matchedExpression, "language"); // 言語情報による表情変更
  }
}

// 表情変化を送信する関数
function emitExpressionChange(expression, source) {
  if (typeof socket !== 'undefined') {
    socket.emit('expressionChange', { expression, source });
    console.log(`表情変化送信 - 出所: ${source}, 表情: ${expression}`);
  } else {
    console.warn("socketが定義されていません。サーバーへの送信は行われません。");
  }
}

if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  // 言語設定（日本語）
  recognition.lang = 'ja-JP';
  recognition.interimResults = true; // 暫定結果も取得
  recognition.continuous = true;    // 常時認識モード

  const RECOGNITION_LOCK_KEY = 'speechRecognitionLock';
  const LOCK_EXPIRATION_TIME = 5000; // 5秒

  // 音声認識をロックする
  function acquireLock() {
    const currentTime = Date.now();
    const lockTime = localStorage.getItem(RECOGNITION_LOCK_KEY);

    // 他のタブがロックを保持していて、かつ有効期限内ならロックを取得できない
    if (lockTime && currentTime - lockTime < LOCK_EXPIRATION_TIME) {
      return false;
    }

    // ロックを取得または上書き
    localStorage.setItem(RECOGNITION_LOCK_KEY, currentTime);
    return true;
  }

  // ロックを解放する
  function releaseLock() {
    localStorage.removeItem(RECOGNITION_LOCK_KEY);
  }

  // 他のタブがロックを保持しているか確認
  function isLocked() {
    const lockTime = localStorage.getItem(RECOGNITION_LOCK_KEY);
    return lockTime && Date.now() - lockTime < LOCK_EXPIRATION_TIME;
  }

  // 音声認識のイベントハンドラ設定
  recognition.onstart = () => {
    console.log("音声認識が開始されました");
  };

  recognition.onresult = (event) => {
    let transcript = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }
    console.log("認識結果:", transcript);

    // アバターの表情更新
    updateAvatarExpressionFromSpeech(transcript);

    // サーバーに認識結果を送信
    if (typeof socket !== 'undefined') {
      socket.emit('languageData', { text: transcript });
    } else {
      console.warn("socketが定義されていません。サーバーへの送信は行われません。");
    }
  };

  recognition.onerror = (event) => {
    console.error("音声認識エラー:", event.error);

    if (event.error === 'no-speech' || event.error === 'network') {
      setTimeout(() => {
        if (!isLocked()) {
          console.log("音声認識を再起動します...");
          recognition.start();
        }
      }, 3000);
    }
  };

  recognition.onend = () => {
    console.log("音声認識が終了しました。");
    if (!isLocked()) {
      console.log("ロックを確認中...");
      recognition.start(); // 他のタブがロックしていない場合のみ再起動
    }
  };

  // ページロード時に自動で音声認識を開始
  window.addEventListener('load', () => {
    if (acquireLock()) {
      console.log("ロックを取得しました。このタブで音声認識を実行します。");
      try {
        recognition.start();
      } catch (err) {
        console.error("音声認識の開始に失敗しました:", err);
      }
    } else {
      console.warn("ロックが取得されているため、このタブでは音声認識を開始しません。");
    }
  });

  // タブを閉じた際にロックを解放
  window.addEventListener('beforeunload', () => {
    releaseLock();
    recognition.stop();
  });

  // 手動で停止する場合のイベントリスナー
  const stopButton = document.getElementById('stop-recognition');
  if (stopButton) {
    stopButton.addEventListener('click', () => {
      releaseLock();
      recognition.stop();
      console.log("音声認識を手動で停止しました");
    });
  }
} else {
  console.error("このブラウザはWeb Speech APIをサポートしていません");
}

function updateAvatarExpression(expression, source) {
  const currentTime = Date.now();

  if (source === "camera") {
    // カメラの表情を更新し、タイムスタンプを記録
    isCameraActive = true;
    lastCameraUpdateTime = currentTime;
    console.log("カメラで表情を更新:", expression);
    changeFace(expression);
  } else if (source === "voice") {
    // カメラが無反応の場合のみ音声による更新を許可
    if (!isCameraActive || currentTime - lastCameraUpdateTime > CAMERA_TIMEOUT) {
      console.log("カメラが無反応のため、音声で表情を更新:", expression);
      changeFace(expression);
    } else {
      console.log("カメラがアクティブなため、音声による更新をスキップ");
    }
  }
}

function handleCameraExpression(detectedExpression) {
  if (detectedExpression) {
    updateAvatarExpression(detectedExpression, "camera");
  } else {
    console.log("カメラで表情が認識されませんでした");
  }
}

// カメラの表情認識がトリガーされた場合の例
setInterval(() => {
  getExpressionFromCamera().then((detectedExpression) => {
    console.log("Detected Expression:", detectedExpression);
    handleCameraExpression(detectedExpression); // 表情をアバターに反映
  });
}, 1000);



try {
  // カメラデータ処理
  const detectedExpression = getExpressionFromCamera();
  handleCameraExpression(detectedExpression);
} catch (error) {
  console.error("カメラデータ処理中にエラーが発生しました:", error);
}

recognition.onerror = (event) => {
  console.error("音声認識エラー:", event.error);
  if (event.error === 'no-speech') {
    alert("音声が認識されませんでした。もう一度お試しください。");
  } else if (event.error === 'network') {
    alert("ネットワークエラーが発生しました。接続を確認してください。");
  }
};

async function getExpressionFromCamera() {
  const video = document.getElementById("camera-video"); // カメラ映像
  if (!video) return null;

  const detections = await faceapi.detectSingleFace(video).withFaceExpressions();
  if (detections && detections.expressions) {
    const expressions = detections.expressions;
    const maxExpression = Object.keys(expressions).reduce((a, b) => (expressions[a] > expressions[b] ? a : b));
    return mapExpressionToAvatarEmotion(maxExpression); // 表情をアバター用の感情に変換
  }
  return null;
}

function mapExpressionToAvatarEmotion(expression) {
  const expressionMap = {
    happy: "happy",
    sad: "sad",
    angry: "angry",
    surprised: "surprised",
    fearful: "fearful",
    disgusted: "disgusted",
    neutral: "neutral",
  };
  return expressionMap[expression] || "neutral";
}

// -----------------------------------------------------------------------------------





// ChatGPTの有効/無効を管理するフラグ
let useChatGPT = false;

// モード切り替え関数
function toggleChatGPTMode() {
  useChatGPT = !useChatGPT;
  console.log(`ChatGPTモード: ${useChatGPT ? "有効" : "無効"}`);
}

// UIのモード切り替えボタンに関連付け
document.getElementById("toggle-mode").addEventListener("click", () => {
  toggleChatGPTMode();
  const modeText = useChatGPT ? "OpenAI API" : "ルールベース";
  document.getElementById("toggle-mode").textContent = `モード切替 (${modeText})`;
});

// 音声認識の結果に基づいて表情を更新
function updateAvatarExpressionFromSpeech(transcript) {
  console.log("音声認識結果:", transcript);

  if (useChatGPT) {
    // ChatGPT APIで表情を判定
    fetch("/chatgpt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transcript }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.emotion) {
          console.log("ChatGPT判定結果:", data.emotion);
          changeFace(data.emotion);
        } else {
          console.warn("ChatGPT判定が失敗しました。");
        }
      })
      .catch((error) => {
        console.error("ChatGPT APIの呼び出し中にエラーが発生しました:", error);
      });
  } else {
    // ルールベースで判定
    const expressionRules = [
      { keyword: "嬉しい", emotion: "happy" },
      { keyword: "楽しい", emotion: "happy" },
      { keyword: "悲しい", emotion: "sad" },
      { keyword: "怒っている", emotion: "angry" },
      { keyword: "驚いた", emotion: "surprised" },
      { keyword: "怖い", emotion: "fearful" },
      { keyword: "嫌", emotion: "disgusted" },
      { keyword: "普通", emotion: "neutral" },
    ];

    let matchedEmotion = "neutral";
    for (const rule of expressionRules) {
      if (transcript.includes(rule.keyword)) {
        matchedEmotion = rule.emotion;
        break;
      }
    }
    console.log("ルールベース判定結果:", matchedEmotion);
    changeFace(matchedEmotion);
  }
}
