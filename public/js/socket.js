// socket.js

// Socket.IOの初期化
const socket = io();
const myName = prompt("ニックネームを入力してください");

let lastExpression = null;

// A-Frameの'moving'コンポーネント
AFRAME.registerComponent("moving", {
  init: function () {
    this.sendInterval = 1000 / 60; // 60fps
    this.lastSentTime = 0;
    this.previousPosition = new THREE.Vector3();
    this.previousQuaternion = new THREE.Quaternion();

    // プレイヤーの色を設定
    this.setupPlayerBody();
  },

  setupPlayerBody: function () {
    const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
    this.myColor = randomColor;
    const myBody = document.getElementById("mybody");
    myBody.setAttribute("color", this.myColor);
  },

  tick: function (time) {
    if (time - this.lastSentTime < this.sendInterval) return;

    const player = this.el.object3D;
    const currentPosition = player.position;
    const currentQuaternion = player.quaternion.clone();

    const positionChange = currentPosition.distanceTo(this.previousPosition);
    const rotationChange = currentQuaternion.angleTo(this.previousQuaternion);

    if (positionChange > MOVEMENT_THRESHOLD || rotationChange > 0.01) {
      socket.emit("send_my_pos", [
        this.myColor,
        myName,
        {
          x: currentPosition.x,
          y: currentPosition.y,
          z: currentPosition.z,
        },
        [
          currentQuaternion.x,
          currentQuaternion.y,
          currentQuaternion.z,
          currentQuaternion.w,
        ],
      ]);

      this.previousPosition.copy(currentPosition);
      this.previousQuaternion.copy(currentQuaternion);
    }

    this.lastSentTime = time;
  },
});

// サーバーからの位置更新を受信
socket.on("update_your_pos", (msg) => {
  const [otherUserId, color, name, position, quaternion] = msg;
  if (!document.getElementById(otherUserId)) {
    createOtherUserAvatar(otherUserId, color, name, position);
  } else {
    updateOtherUserPosition(otherUserId, position, quaternion);
  }
});

// ユーザーが切断されたときにアバターを削除
socket.on("remove_user", (userId) => {
  console.log("Removing user:", userId);
  const userElement = document.getElementById(userId);
  if (userElement) {
    userElement.parentNode.removeChild(userElement);
  }
});

// 他のユーザーの表情データを受信
socket.on("update_expression", (data) => {
  const userId = data.id;
  const expression = data.expression;
  updateOtherUserExpression(userId, expression);
});

// 表情認識の結果をサーバーに送信
function updateAvatarExpression(expression) {
  const avatar = document.querySelector("#mybody");

  // 表情に応じてアバターの色を変更（必要に応じて）
  switch (expression) {
    case "happy":
      avatar.setAttribute("material", "color", "yellow");
      break;
    case "angry":
      avatar.setAttribute("material", "color", "red");
      break;
    // 他の表情に対する処理を追加
    default:
      avatar.setAttribute("material", "color", "white");
  }

  // 口の形状を変更
  changeFace(expression);

  // 表情が変わった場合のみサーバーに送信
  if (expression !== lastExpression) {
    lastExpression = expression;
    socket.emit("expressionUpdate", {
      id: socket.id,
      expression: expression,
    });
  }
}
